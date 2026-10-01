import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, setInput, choose, routeOptions, intakeProfile, validateProject } from '../nest/workbench-core.mjs';
import { questionnaireView, kickoffDraft } from '../nest/questionnaire.mjs';
import { reviewSnapshot } from '../nest/review-core.mjs';

const cases = [
  { name: '现成战棋工程做新游戏', idea: '利用旧工程做一款全新的战棋游戏', entries: ['existing'], genre: 'tactics', route: 'new_game', focus: 'loop', expected: ['first_challenge', 'reuse_boundary'], word: '守住' },
  { name: '无工程战棋短局', idea: '想做战棋短局', entries: ['mechanic'], genre: 'tactics', route: 'short', focus: 'first_turn', expected: ['first_challenge', 'test_question'], absent: 'reuse_boundary', word: '护送' },
  { name: '现成经营工程做新游戏', idea: '用现有工程做一款新的经营游戏', entries: ['existing'], genre: 'management', route: 'new_game', focus: 'loop', expected: ['first_challenge', 'reuse_boundary'], word: '订单' },
  { name: '无工程棋牌短局', idea: '想做牌局推理', entries: ['mechanic'], genre: 'gambling', route: 'short', focus: 'first_turn', expected: ['first_challenge', 'test_question'], absent: 'reuse_boundary', word: '破绽' },
  { name: '参考游戏模组', idea: '想在喜欢的游戏里做太空农场', entries: ['reference'], genre: 'management', route: 'mod', focus: 'content', expected: [], word: '修改接口' },
  { name: '旧原型诊断', idea: '试玩的人看不懂目标', entries: ['existing'], genre: 'other', route: 'improve', focus: 'observe', expected: [], word: '看不懂' },
  { name: '朋友同玩的模糊愿望', idea: '想和朋友一起玩，但还没想好游戏', entries: ['wish'], genre: 'auto', route: 'compare', focus: 'party_misread', expected: ['party_mode', 'test_question'], word: '合作' },
];

for (const scenario of cases) test(`入口矩阵：${scenario.name}`, () => {
  let state = setInput(createProject(), scenario.idea, scenario.entries, '', scenario.genre);
  assert.ok(routeOptions(state).some(item => item.id === scenario.route));
  state = choose(choose(state, 'route', scenario.route), 'focus', scenario.focus);
  const ids = questionnaireView(state).map(item => item.id);
  if (scenario.expected) assert.deepEqual(ids, scenario.expected);
  if (scenario.present) assert.ok(ids.includes(scenario.present));
  if (scenario.absent) assert.ok(!ids.includes(scenario.absent));
  const visibleText = `${questionnaireView(state).flatMap(item => item.options.map(option => option.label)).join(' ')} ${kickoffDraft(state)} ${reviewSnapshot(state).routeGaps.join(' ')}`;
  assert.match(visibleText, new RegExp(scenario.word));
  assert.equal(validateProject(state).version, state.version);
});

test('旧版记录没有品类字段时可导入，品类只从游戏想法暂推而不从工程推断', () => {
  let old = setInput(createProject(), '想做战棋游戏', ['existing'], '已有战棋工程');
  old = choose(choose(old, 'route', 'new_game'), 'focus', 'world');
  delete old.input.genre;
  const imported = validateProject(old);
  assert.equal(intakeProfile(imported).genre, 'tactics');
  assert.equal(imported.decisions.route.value, 'new_game');
  assert.deepEqual(questionnaireView(imported).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  const engineOnly = validateProject({ ...old, input: { ...old.input, idea: '' } });
  assert.equal(intakeProfile(engineOnly).genre, 'unspecified');
});
