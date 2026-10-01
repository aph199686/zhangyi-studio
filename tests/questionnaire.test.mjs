import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, routeOptions, setInput, choose, recordDesignDecision, validateProject, intakeProfile } from '../nest/workbench-core.mjs';
import { QUESTION_BANK, questionnaireView, answerQuestion, usePresetRecommendation, reviewIssues, kickoffDraft } from '../nest/questionnaire.mjs';
import { focusOptions, intakeGuidance } from '../nest/workbench-core.mjs';

function existingGame() {
  let project = setInput(createProject(), '用现成赌桌做一款多局斗智游戏。', ['story', 'existing'], '已有引擎骨架');
  project = choose(project, 'route', 'new_game');
  project = choose(project, 'focus', 'world');
  return project;
}

test('题库有稳定主题和有效选项，已有决定预填后不重问', () => {
  assert.ok(QUESTION_BANK.length >= 40);
  assert.equal(new Set(QUESTION_BANK.map(item => item.id)).size, QUESTION_BANK.length);
  assert.equal(new Set(QUESTION_BANK.map(item => item.topic)).size, QUESTION_BANK.length);
  for (const item of QUESTION_BANK) {
    assert.ok(item.options.length >= 2 && item.options.length <= 4);
    assert.ok(item.options.some(option => option.value === item.recommended));
  }
  let project = existingGame();
  project = recordDesignDecision(project, '世界与舞台', '封闭避难城', '所有人物反复相遇');
  project = recordDesignDecision(project, '技能系统', '只用少数能力', '降低范围');
  const view = questionnaireView(project, { deep: true });
  assert.equal(view.find(item => item.id === 'world').accepted.label, '封闭避难城');
  assert.equal(view.find(item => item.id === 'skills').accepted.label, '只用少数能力');
  assert.ok(view.some(item => item.id === 'shop' && !item.accepted));
  assert.ok(!view.some(item => item.id === 'engine'));
  assert.equal(validateProject(project).version, project.version);
});

test('改上游答案只使关联的下游需复核，旧决定保留', () => {
  let project = existingGame();
  project = answerQuestion(project, 'promise', 'choice');
  project = answerQuestion(project, 'core_verb', 'choose');
  project = answerQuestion(project, 'loop_shape', 'chapter');
  project = answerQuestion(project, 'between', 'prepare');
  const before = project.designDecisions.length;
  project = answerQuestion(project, 'promise', 'mastery');
  assert.equal(project.designDecisions.length, before + 1);
  assert.equal(project.designDecisions.find(item => item.topic === '核心行动').status, 'needs_review');
  assert.equal(project.designDecisions.find(item => item.topic === '核心循环组织').status, 'needs_review');
  assert.equal(project.designDecisions.find(item => item.topic === '局间行动主轴').status, 'needs_review');
  assert.match(kickoffDraft(project), /需复核的旧决定/);
  project = answerQuestion(project, 'core_verb', 'act');
  assert.equal(project.designDecisions.find(item => item.topic === '核心行动' && item.label === '比较线索并做选择').status, 'superseded');
  assert.equal(validateProject(project).version, project.version);
});

test('补填此前缺的上游问题，不推翻已有项目的下游决定', () => {
  let project = existingGame();
  project = recordDesignDecision(project, '核心循环组织', '关键赌局加局间选择', '两局间准备');
  project = answerQuestion(project, 'core_verb', 'choose');
  assert.equal(project.designDecisions.find(item => item.topic === '核心循环组织').status, 'accepted');
});

test('草案区分已确认、未定及无法归类但仍保留的决定', () => {
  let project = existingGame();
  project = recordDesignDecision(project, '世界与舞台', '封闭避难城', '反复相遇');
  project = recordDesignDecision(project, '特别制作约束', '只用占位图', '美术工作延后');
  const draft = kickoffDraft(project);
  assert.match(draft, /世界与舞台：封闭避难城/);
  assert.match(draft, /特别制作约束：只用占位图/);
  assert.match(draft, /第一局目标：未定/);
  assert.match(draft, /离线首局草案/);
});

test('独立短局的可选题里，选择重开后局间行动题退出', () => {
  let project = setInput(createProject(), '多局接续的短游戏', ['mechanic']);
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  assert.deepEqual(questionnaireView(project).map(item => item.id), ['first_challenge', 'test_question']);
  assert.ok(questionnaireView(project, { deep: true }).some(item => item.id === 'between'));
  project = answerQuestion(project, 'loop_shape', 'run');
  assert.ok(!questionnaireView(project, { deep: true }).some(item => item.id === 'between'));
});

test('预设建议保持暂拟，用户选择后才转为确认', () => {
  let project = existingGame();
  project = usePresetRecommendation(project, 'art_scope');
  assert.equal(questionnaireView(project, { deep: true }).find(item => item.id === 'art_scope').accepted, null);
  assert.equal(project.designDecisions.at(-1).status, 'provisional');
  assert.match(kickoffDraft(project), /预设建议，尚待确认/);
  project = answerQuestion(project, 'art_scope', 'key');
  assert.equal(project.designDecisions.at(-2).status, 'superseded');
  assert.equal(project.designDecisions.at(-1).status, 'accepted');
  assert.equal(validateProject(project).version, project.version);
  let same = usePresetRecommendation(existingGame(), 'audio_scope');
  same = answerQuestion(same, 'audio_scope', 'feedback');
  assert.equal(same.designDecisions.at(-1).status, 'accepted');
});

test('输局重试与旧赌注冲突被提示，推荐不替用户改答案', () => {
  let project = existingGame();
  project = recordDesignDecision(project, '胜负代价', '资格递减加每局具体损失', '输局带着损失继续');
  project = answerQuestion(project, 'failure_continue', 'retry');
  assert.equal(reviewIssues(project).length, 1);
  const question = questionnaireView(project, { deep: true }).find(item => item.id === 'failure_continue');
  assert.equal(question.recommendation.value, 'cost');
  assert.equal(question.accepted.label, '学到规则后重试');
  assert.match(kickoffDraft(project), /待核对的矛盾/);
  project = answerQuestion(project, 'failure_continue', 'cost');
  assert.equal(reviewIssues(project).length, 0);
});

test('游戏品类与现成工程是独立轴：有无工程的战棋都给战棋首局', () => {
  let withEngine = setInput(createProject(), '想做一款新游戏', ['existing'], '现成工程可编译', 'tactics');
  assert.equal(routeOptions(withEngine).find(item => item.recommended).id, 'new_game');
  assert.equal(intakeProfile(withEngine).genre, 'tactics');
  withEngine = choose(choose(withEngine, 'route', 'new_game'), 'focus', 'loop');
  assert.deepEqual(questionnaireView(withEngine).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  assert.match(questionnaireView(withEngine)[0].options.map(item => item.label).join(' '), /守住|护送|击败/);
  assert.doesNotMatch(questionnaireView(withEngine)[0].options.map(item => item.label).join(' '), /赌|牌/);

  let withoutEngine = setInput(createProject(), '我想做战棋', ['mechanic'], '', 'tactics');
  withoutEngine = choose(choose(withoutEngine, 'route', 'short'), 'focus', 'first_turn');
  const questions = questionnaireView(withoutEngine);
  assert.ok(questions.some(item => item.id === 'first_challenge'));
  assert.ok(!questions.some(item => item.id === 'reuse_boundary'));
  assert.equal(intakeProfile(withoutEngine).genre, 'tactics');
});

test('用户说全新的战棋游戏时推荐沿用工程做新游戏，而非修旧项目', () => {
  const state = setInput(createProject(), '想沿用已有工程做一款全新的战棋游戏', ['existing'], '旧工程可编译', 'tactics');
  assert.equal(routeOptions(state).find(item => item.recommended).id, 'new_game');
});

test('只改品类保留工程路线，旧首局目标进入复核', () => {
  let project = setInput(createProject(), '想做一款新游戏', ['existing'], '已有工程', 'tactics');
  project = choose(choose(project, 'route', 'new_game'), 'focus', 'loop');
  project = answerQuestion(project, 'first_challenge', 'hold');
  const oldRouteId = project.decisions.route.id;
  project = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'management');
  assert.equal(project.decisions.route.status, 'accepted');
  assert.equal(project.decisions.route.id, oldRouteId);
  assert.equal(project.designDecisions.find(item => item.topic === '首局目标').status, 'needs_review');
  assert.match(questionnaireView(project).find(item => item.id === 'first_challenge').options[0].label, /订单/);
  assert.equal(validateProject(project).version, project.version);
});

test('种田参考的模组入口不强塞策略游戏重点', () => {
  let project = setInput(createProject(), '喜欢种田节奏，想做太空温室和照顾船员', ['reference']);
  project = choose(project, 'route', 'mod');
  const labels = focusOptions(project).map(item => item.label).join(' ');
  assert.match(labels, /可见内容|互动规则|完整体验/);
  assert.doesNotMatch(labels, /势力|争夺|地图/);
  assert.match(intakeGuidance(project).boundary, /仍需核实/);
  project = choose(project, 'focus', 'content');
  assert.equal(questionnaireView(project).length, 0);
  assert.match(kickoffDraft(project), /未核实目标游戏修改接口/);
});

test('模糊的朋友同玩愿望先给短局方向，再显示少量相关问题', () => {
  let project = setInput(createProject(), '想和朋友一起玩，最好有点搞笑，还没想好怎么玩', ['wish']);
  project = choose(project, 'route', 'compare');
  const options = focusOptions(project);
  assert.equal(options.length, 3);
  assert.match(options.map(item => item.effect).join(' '), /朋友|大家/);
  project = choose(project, 'focus', options[0].id);
  const questions = questionnaireView(project);
  assert.ok(questions.length <= 5);
  assert.ok(questions.some(item => item.id === 'party_mode'));
  assert.ok(!questions.some(item => item.id === 'promise'));
  assert.ok(!questions.some(item => item.id === 'first_action'));
  assert.ok(!questions.some(item => item.id === 'slice'));
  assert.match(kickoffDraft(project), /合作闯关/);
});

test('已有原型先诊断症状，用户描述仍是待核实线索', () => {
  let project = setInput(createProject(), '已有能玩的浏览器卡牌原型，朋友看不懂规则，只有周末', ['existing']);
  project = choose(project, 'route', 'improve');
  project = choose(project, 'focus', 'observe');
  const questions = questionnaireView(project);
  assert.deepEqual(questions.map(item => item.id), []);
  assert.match(intakeGuidance(project).boundary, /没有读取工程或观察玩家/);
  assert.match(kickoffDraft(project), /来自用户描述的推断/);
  assert.doesNotMatch(kickoffDraft(project), /玩家承诺：未定/);
});

test('已有项目未描述症状时才询问诊断焦点', () => {
  let project = setInput(createProject(), '我有一个原型，想看看哪里该改', ['existing']);
  assert.equal(routeOptions(project)[0].id, 'improve');
  project = choose(project, 'route', 'improve');
  project = choose(project, 'focus', 'observe');
  assert.deepEqual(questionnaireView(project).map(item => item.id), ['diagnosis_point']);
});
