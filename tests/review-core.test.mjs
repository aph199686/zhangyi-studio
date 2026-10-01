import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, choose, setInput, recordDesignDecision } from '../nest/workbench-core.mjs';
import { answerQuestion, questionnaireView } from '../nest/questionnaire.mjs';
import { reviewSnapshot, chooseFirstTable, keepRetry, reviewDocument } from '../nest/review-core.mjs';

function example() {
  let project = setInput(createProject(), '现成赌桌引擎，做一个斗智赌博游戏', ['existing']);
  project = choose(project, 'route', 'new_game');
  project = choose(project, 'focus', 'world');
  project = recordDesignDecision(project, '六种赌桌的首版范围', '四桌进入主线，两桌排出首版',
    '首版关键赌局使用21点、德州扑克、BINGO和猜数字。');
  project = recordDesignDecision(project, '胜负代价', '资格递减加每局具体损失',
    '输局会损失资格及本局押上的东西，故事带着这项损失继续。');
  return answerQuestion(project, 'failure_continue', 'retry');
}

test('审方案读出现有矛盾，但查看本身不改项目', () => {
  const project = example();
  const before = JSON.stringify(project);
  const view = reviewSnapshot(project);
  assert.equal(view.issues[0].id, 'loss-or-retry');
  assert.equal(view.needsFirstTable, true);
  assert.equal(view.ready, false);
  assert.equal(JSON.stringify(project), before);
  assert.match(reviewDocument(project), /不是张翼正式裁决书/);
});

test('选择首桌不撤回四桌范围，重选保留历史', () => {
  const project = example();
  const first = chooseFirstTable(project, 'blackjack');
  assert.equal(reviewSnapshot(first).firstTable.label, '21 点');
  assert.equal(reviewSnapshot(first).firstTable.reviewChoiceId, 'blackjack');
  assert.equal(first.designDecisions.find(item => item.topic === '六种赌桌的首版范围').status, 'accepted');
  const second = chooseFirstTable(first, 'bingo');
  assert.equal(reviewSnapshot(second).firstTable.label, 'BINGO');
  assert.equal(second.designDecisions.filter(item => item.topic === '首个可玩赌桌').length, 2);
});

test('保留重试必须由用户动作撤回旧输局损失', () => {
  const project = example();
  const resolved = keepRetry(project);
  assert.equal(reviewSnapshot(resolved).issues.length, 0);
  assert.equal(project.designDecisions.find(item => item.topic === '胜负代价').status, 'accepted');
  assert.equal(resolved.designDecisions.find(item => item.topic === '胜负代价').status, 'superseded');
  assert.match(reviewDocument(resolved), /正式输局可重试/);
});

test('通用项目不出现赌桌和特定引擎，比较路线要选具体方向', () => {
  let project = setInput(createProject(), '', ['wish']);
  project = choose(project, 'route', 'compare');
  project = choose(project, 'focus', 'solo_discover');
  const view = reviewSnapshot(project);
  const document = reviewDocument(project);
  assert.equal(view.ready, false);
  assert.match(view.routeGaps.join(' '), /具体规则/);
  assert.match(document, /发现秘密/);
  assert.doesNotMatch(document, /首个可玩赌桌|一桌待选赌局|Ren'Py|现有引擎可运行/);
});

test('比较路线答完必要题仍只算选了概念，审查不冒充制作就绪', () => {
  let project = setInput(createProject(), '想和朋友一起玩，最好有点搞笑', ['wish']);
  project = choose(project, 'route', 'compare');
  project = choose(project, 'focus', 'party_misread');
  project = answerQuestion(project, 'party_mode', 'one_screen');
  project = answerQuestion(project, 'test_question', 'understand');
  const view = reviewSnapshot(project);
  assert.equal(view.missing.length, 0);
  assert.equal(view.ready, false);
  assert.match(reviewDocument(project), /规则、结束条件和制作约束尚未细化/);
  assert.ok(!view.facts.some(([topic]) => topic === '玩家承诺'));
});

test('已有原型的症状只作待观察线索，可直接安排首次玩家观察', () => {
  let project = setInput(createProject(), '已有卡牌原型，朋友看不懂规则', ['existing']);
  project = choose(project, 'route', 'improve');
  project = choose(project, 'focus', 'observe');
  const view = reviewSnapshot(project);
  assert.equal(view.missing.length, 0);
  assert.equal(view.ready, true);
  assert.match(view.facts.find(([topic]) => topic === '首个待查症状')[1], /用户描述，待观察/);
  assert.match(reviewDocument(project), /可以安排观察首次玩家/);
});

test('模组路线需要先核实修改接口，不能仅凭答完通用题宣布开工', () => {
  let project = setInput(createProject(), '参考一款策略游戏制作历史题材模组', ['reference']);
  project = choose(project, 'route', 'mod');
  project = choose(project, 'focus', 'content');
  assert.equal(reviewSnapshot(project).ready, false);
  assert.match(reviewDocument(project), /模组可行性未核实/);
});

test('沿用工程做新游戏答完通用题仍需具体首局和运行核验', () => {
  let project = setInput(createProject(), '', ['existing'], '已有回合制原型代码');
  project = choose(project, 'route', 'new_game');
  project = choose(project, 'focus', 'world');
  for (let i = 0; i < 30; i++) {
    const next = questionnaireView(project).find(item => !item.accepted && !item.provisional);
    if (!next) break;
    project = answerQuestion(project, next.id, next.recommended);
  }
  const view = reviewSnapshot(project);
  assert.equal(view.missing.length, 0);
  assert.equal(view.ready, false);
  assert.match(reviewDocument(project), /问卷选完不能代替这一步/);
  assert.match(reviewDocument(project), /区分代码存在、编译通过和实际玩通/);
});
