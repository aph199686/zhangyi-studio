import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, setInput, choose, validateProject } from '../nest/workbench-core.mjs';
import { answerQuestion, kickoffDraft } from '../nest/questionnaire.mjs';
import { buildTaskDocument, importEvidence, evidenceLevel, evidenceBoardLabel } from '../nest/build-task.mjs';
import { reviewSnapshot } from '../nest/review-core.mjs';

const ready = () => {
  let project = setInput(createProject(), '想做战棋短局', ['mechanic'], '', 'tactics');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  return answerQuestion(project, 'first_challenge', 'escort');
};

test('制作任务包：含首局规格、验收、纪律与页脚，未定处诚实标注', () => {
  const doc = buildTaskDocument(ready());
  assert.match(doc, /护送目标抵达出口/);
  assert.match(doc, /战棋首局施工骨架/);
  assert.match(doc, /制作纪律/);
  assert.match(doc, /构建通过、运行通过、玩通是三件不同的事/);
  assert.match(doc, /把对话分开/);
  assert.match(doc, /对话记录不是项目记录/);
  assert.match(doc, /制作任务包 v/);
  const blank = buildTaskDocument(createProject());
  assert.match(blank, /未定——先回 01 选定/);
});

test('证据导入：版本绑定、分级、三要素降级、不动设计决定', () => {
  const project = ready();
  const payload = {
    schemaVersion: 1, projectCreatedAt: project.createdAt, baseVersion: project.version,
    records: [
      { type: 'build', note: 'esbuild 构建 0 错误', source: 'log', at: '2026-09-30' },
      { type: 'playtest', note: '找朋友玩了一局', source: 'user', at: '2026-09-30' },
    ],
  };
  const next = importEvidence(project, payload);
  assert.equal(next.version, project.version + 1);
  assert.equal(next.evidence.length, 2);
  assert.equal(next.evidence[1].degraded, true);
  assert.equal(evidenceLevel(next), 'playthrough');
  assert.equal(evidenceBoardLabel(next), '已玩通，未试玩');
  assert.equal(next.designDecisions.length, project.designDecisions.length);
  assert.throws(() => importEvidence(project, { ...payload, baseVersion: 99 }), /版本不一致/);
  assert.throws(() => importEvidence(project, { ...payload, records: [] }), /1—8 条/);
  assert.throws(() => importEvidence(project, { ...payload, records: [{ type: 'hack', note: 'x', source: 'user', at: '1' }] }), /类型无效/);
});

test('完整真人试玩证据不降级，方案变更后旧证据标需复核', () => {
  const project = ready();
  const next = importEvidence(project, {
    schemaVersion: 1, projectCreatedAt: project.createdAt, baseVersion: project.version,
    records: [{ type: 'playtest', note: '两人试玩', source: 'log', at: '2026-09-30',
      sample: { origin: '两位没玩过桌游的朋友', size: '2', caliber: '独立玩完一局' } }],
  });
  assert.equal(evidenceLevel(next), 'playtest');
  assert.equal(evidenceBoardLabel(next), '有真人试玩记录');
  const changed = setInput(next, '想做银河恶魔城', next.input.entries, next.input.constraints, 'metroidvania');
  assert.equal(changed.evidence[0].status, 'needs_review');
  assert.equal(evidenceLevel(changed), null);
  const rerouted = choose(choose(next, 'route', 'compare'), 'focus', 'solo_discover');
  assert.equal(rerouted.evidence[0].status, 'needs_review');
});

test('审方案提示随证据状态变化', () => {
  const project = ready();
  assert.ok(reviewSnapshot(project).advisories.some(item => /还没有运行和真人试玩证据/.test(item.title)));
  const next = importEvidence(project, {
    schemaVersion: 1, projectCreatedAt: project.createdAt, baseVersion: project.version,
    records: [{ type: 'run', note: '本地跑通一局', source: 'log', at: '2026-09-30' }],
  });
  const advisories = reviewSnapshot(next).advisories;
  assert.ok(!advisories.some(item => /还没有运行和真人试玩证据/.test(item.title)));
  assert.ok(advisories.some(item => /当前证据等级：已运行，未玩通/.test(item.title)));
});

test('validateProject 拒绝畸形证据条目', () => {
  const project = ready();
  const bad = structuredClone(project);
  bad.evidence.push({ id: 'e1', type: 'hack', note: 'x', source: 'user', at: '1', status: 'current' });
  assert.throws(() => validateProject(bad), /可玩证据无效/);
  assert.equal(validateProject(project).version, project.version);
});

test('立项草案与任务包在无包品类不含引擎清单，提 Unity 才出现', () => {
  const noEngine = kickoffDraft(ready());
  assert.ok(!/引擎核验清单/.test(noEngine));
  let withEngine = setInput(createProject(), '沿用旧工程做一款全新的战棋游戏', ['existing'], '有一个 Unity 2021 旧工程', 'tactics');
  withEngine = choose(withEngine, 'route', 'new_game');
  withEngine = choose(withEngine, 'focus', 'loop');
  assert.match(buildTaskDocument(withEngine), /引擎核验清单/);
  assert.match(buildTaskDocument(withEngine), /引用链核验/);
});
