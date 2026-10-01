import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, setInput, choose, validateProject } from '../nest/workbench-core.mjs';
import { reviewTaskDocument, importReview, latestReview, resolveIntervention, interventionDocument } from '../nest/review-exchange.mjs';
import { reviewSnapshot } from '../nest/review-core.mjs';
import { answerQuestion } from '../nest/questionnaire.mjs';

function project() {
  let state = setInput(createProject(), '做一款新游戏', ['existing'], '有战棋工程', 'tactics');
  state = choose(choose(state, 'route', 'new_game'), 'focus', 'loop');
  return state;
}

function result(state) {
  return { schemaVersion: 1, projectCreatedAt: state.createdAt, baseVersion: state.version,
    summary: '先把首局目标定具体，复用范围仍需核实。',
    interventions: [{ topic: '首局目标', current: '未定', proposal: '守住撤离点三回合',
      effect: '玩家每回合在移动、防守与救援之间取舍。', reason: '有明确目标和结束条件。',
      cost: '需要制作敌方推进和三回合结算。', verification: '运行完整三回合并记录胜负反馈。',
      basis: 'inference', basisDetail: '项目记录只说明有工程和想做战棋。' }] };
}

test('审查任务绑定项目版本；导入只产生建议，用户采纳后才成决定', () => {
  const before = answerQuestion(answerQuestion(project(), 'first_challenge', 'hold'), 'reuse_boundary', 'core');
  assert.match(reviewTaskDocument(before), new RegExp(`"baseVersion": ${before.version}`));
  const reviewed = importReview(before, result(before));
  assert.equal(reviewed.designDecisions.length, before.designDecisions.length);
  assert.equal(latestReview(reviewed).interventions[0].status, 'proposed');
  assert.match(reviewSnapshot(reviewed).routeGaps[0], /审查意见已回挂/);
  const accepted = resolveIntervention(reviewed, latestReview(reviewed).interventions[0].id, 'accept');
  assert.equal(accepted.version, reviewed.version + 1);
  assert.equal(accepted.designDecisions.find(item => item.topic === '首局目标' && item.status === 'accepted').label, '守住撤离点三回合');
  assert.match(interventionDocument(accepted), /用户已采纳/);
  assert.equal(validateProject(accepted).version, accepted.version);
});

test('陈旧、跨项目或格式不全的 AI 结果不会覆盖记录', () => {
  const before = project();
  assert.throws(() => importReview(before, { ...result(before), baseVersion: before.version - 1 }), /版本不一致/);
  assert.throws(() => importReview(before, { ...result(before), projectCreatedAt: 'other' }), /版本不一致/);
  const broken = result(before);
  broken.interventions[0].cost = '';
  assert.throws(() => importReview(before, broken), /改动代价/);
  assert.equal(before.judgments.length, 0);
});

test('项目条件变化使未采纳建议过期，但历史仍保留', () => {
  const before = project();
  const reviewed = importReview(before, result(before));
  const changed = setInput(reviewed, reviewed.input.idea, reviewed.input.entries, reviewed.input.constraints, 'management');
  assert.equal(latestReview(changed).interventions[0].status, 'needs_review');
  assert.throws(() => resolveIntervention(changed, latestReview(changed).interventions[0].id, 'accept'), /过期/);
  assert.match(interventionDocument(changed), /已过期/);
});
