import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, setInput, choose, validateProject } from '../nest/workbench-core.mjs';
import { answerQuestion } from '../nest/questionnaire.mjs';
import { importEvidence } from '../nest/build-task.mjs';
import { playtestGear, playtestTaskDocument, revisionDocument, importPlaytests } from '../nest/playtest.mjs';

const base = () => {
  let project = setInput(createProject(), '想做战棋短局', ['mechanic'], '', 'tactics');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  return answerQuestion(project, 'first_challenge', 'escort');
};
const withEvidence = (project, type) => importEvidence(project, {
  schemaVersion: 1, projectCreatedAt: project.createdAt, baseVersion: project.version,
  records: [{ type, source: 'user', note: '本地实际运行过一轮', at: '2026-10-01' }],
});
const sessionPayload = (project, sessions) => ({
  schemaVersion: 1, projectCreatedAt: project.createdAt, baseVersion: project.version, sessions,
});
const fullSession = { at: '2026-10-01', sample: { origin: '朋友三人', size: 3, caliber: '观察+访谈' },
  facts: ['开场 40 秒玩家问"我该干什么"'], conclusions: ['开场缺少目标提示'], suggestions: ['首屏加一个目标横幅'] };

test('档位路由：未制作→null、能跑→首次观察、玩通→体验走查、有场次→修订核对', () => {
  let project = base();
  assert.equal(playtestGear(project), null);
  project = withEvidence(project, 'build');
  assert.equal(playtestGear(project), null);
  project = withEvidence(project, 'run');
  assert.equal(playtestGear(project), 'observe');
  project = withEvidence(project, 'playthrough');
  assert.equal(playtestGear(project), 'walkthrough');
  project = importPlaytests(project, sessionPayload(project, [fullSession]));
  assert.equal(playtestGear(project), 'revise');
});

test('试飞任务书：含档位、红线与样本计划留空；未到节点时如实说先回 03', () => {
  const early = playtestTaskDocument(base());
  assert.match(early, /还没到试飞节点/);
  assert.match(early, /先回 03/);
  let project = withEvidence(base(), 'playthrough');
  const doc = playtestTaskDocument(project);
  assert.match(doc, /体验走查/);
  assert.match(doc, /不引导、不解释、先观察后提问/);
  assert.match(doc, /模拟 persona 与 AI 自问自答不是试玩/);
  assert.match(doc, /来源______；人数______；口径（观察／访谈／问卷）______/);
});

test('记录导入：版本绑定、三要素降级、无事实结论警告、双空拒绝', () => {
  const project = withEvidence(base(), 'playthrough');
  // 版本不符拒绝
  assert.throws(() => importPlaytests(project, { ...sessionPayload(project, [fullSession]),
    baseVersion: project.version + 1 }), /版本不一致/);
  // 三要素缺失 → 自述级
  const degraded = importPlaytests(project, sessionPayload(project, [
    { at: '2026-10-01', sample: { origin: '', size: 0, caliber: '' }, facts: ['玩家在第 2 分钟迷路'] },
  ]));
  assert.equal(degraded.playtests[0].degraded, true);
  assert.match(degraded.history.at(-1).summary, /降级为自述级/);
  // 有结论无事实 → unsupported 警告（仍导入，事实可为空的场次必须没有任何结论才合理）
  const flagged = importPlaytests(project, sessionPayload(project, [
    { at: '2026-10-01', sample: { origin: '同事', size: 1, caliber: '访谈' }, conclusions: ['太难了'] },
  ]));
  assert.equal(flagged.playtests[0].unsupported, true);
  assert.equal(flagged.playtests[0].degraded, false);
  // 事实与结论都空 → 拒绝
  assert.throws(() => importPlaytests(project, sessionPayload(project, [
    { at: '2026-10-01', sample: { origin: '同事', size: 1, caliber: '访谈' } },
  ])), /没有事实也没有结论/);
  // 导入不动设计决定
  const after = importPlaytests(project, sessionPayload(project, [fullSession]));
  assert.equal(after.decisions.route.status, 'accepted');
  assert.equal(after.version, project.version + 1);
});

test('方案改动后旧场次标需复核；修订建议只整理不落地', () => {
  let project = withEvidence(base(), 'playthrough');
  project = importPlaytests(project, sessionPayload(project, [fullSession]));
  const changed = setInput(project, '想做战棋短局，但改成护送为主线', ['mechanic'], '', 'tactics');
  assert.equal(changed.playtests[0].status, 'needs_review');
  const doc = revisionDocument(project);
  assert.match(doc, /2026-10-01 的场次/);
  assert.match(doc, /首屏加一个目标横幅/);
  assert.match(doc, /本文档只列建议，不替你改方案/);
  assert.match(doc, /回到"01 立项"改答案、或回"02 审方案"/);
  const empty = revisionDocument(base());
  assert.match(empty, /尚无试玩记录/);
});

test('playtests 字段通过项目校验，且被导出记录携带', () => {
  const base3 = withEvidence(base(), 'playthrough');
  const project = importPlaytests(base3, sessionPayload(base3, [fullSession]));
  const valid = validateProject(project);
  assert.equal(valid.playtests.length, 1);
  assert.throws(() => validateProject({ ...project, playtests: [{ id: 1 }] }), /试玩记录无效/);
});
