import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTENT_PACKS, activeGenrePack, activeStylePack, stylePackPlan, validateContentPack } from '../nest/content-packs.mjs';
import { createProject, setInput, choose, intakeProfile, validateProject, projectOverview } from '../nest/workbench-core.mjs';
import { questionnaireView, answerQuestion, usePresetRecommendation, kickoffDraft } from '../nest/questionnaire.mjs';
import { reviewSnapshot } from '../nest/review-core.mjs';

const start = (entries, idea = '我想做战棋游戏') => {
  let project = setInput(createProject(), idea, entries, entries.includes('existing') ? '有现成工程，尚未本次运行核验' : '', 'tactics');
  project = choose(project, 'route', entries.includes('existing') ? 'new_game' : 'short');
  return choose(project, 'focus', entries.includes('existing') ? 'loop' : 'first_turn');
};

test('完整内容包格式有效且只在对应品类调用', () => {
  for (const pack of CONTENT_PACKS) assert.equal(validateContentPack(pack), pack);
  assert.equal(activeGenrePack('tactics')?.id, 'genre.tactics');
  assert.equal(activeGenrePack('management')?.id, 'genre.management');
  assert.equal(activeGenrePack('gambling')?.id, 'genre.gambling');
  assert.equal(activeGenrePack('rogue')?.id, 'genre.rogue');
  assert.equal(activeGenrePack('idle')?.id, 'genre.idle');
  assert.equal(activeGenrePack('shooter'), null);
  assert.throws(() => validateContentPack({ ...CONTENT_PACKS[0], firstChallenge: { topic: '首局目标', options: [] } }));
  assert.throws(() => validateContentPack({ ...CONTENT_PACKS[0], axis: 'style' }));
  assert.equal(validateContentPack({ schemaVersion: 1, id: 'style.example', axis: 'style', value: 'example', title: '示例', status: 'draft', boundary: '待验证', presentation: { visual: '可读', text: '简明', feedback: '清楚' }, verification: ['交目标用户看过并记录联想'] }).axis, 'style');
  assert.throws(() => validateContentPack({ schemaVersion: 1, id: 'style.example', axis: 'style', value: 'example', title: '示例', status: 'draft', boundary: '待验证', presentation: { visual: '可读', text: '简明', feedback: '清楚' } }), /呈现核验/);
  const project = setInput(createProject(), '想做餐厅经营游戏', ['existing'], '现有战棋工程', 'auto');
  assert.equal(intakeProfile(project).genre, 'management');
  const unrelated = start(['existing'], '我想做战棋');
  unrelated.input.constraints = '旧工程有护送关卡';
  assert.equal(questionnaireView(unrelated)[0].recommendation.value, 'hold');
});

test('战棋包随主导品类进入，两种工程条件都给相同战术判断', () => {
  const bare = start([]);
  const existing = start(['existing']);
  const deepBare = questionnaireView(bare, { deep: true });
  const deepExisting = questionnaireView(existing, { deep: true });
  for (const id of ['first_challenge', 'tactics_action', 'tactics_terrain', 'tactics_opponent']) {
    assert.ok(deepBare.some(item => item.id === id));
    assert.ok(deepExisting.some(item => item.id === id));
  }
  assert.ok(!deepBare.some(item => item.id === 'reuse_boundary'));
  assert.ok(deepExisting.some(item => item.id === 'reuse_boundary'));
  assert.deepEqual(questionnaireView(bare).map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  assert.equal(intakeProfile(existing).genre, intakeProfile(bare).genre);
});

test('用户原话只改变待确认推荐，已选目标引导战术建议和导出骨架', () => {
  let project = start([], '想做护送队伍撤离的战棋');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'escort');
  assert.match(questionnaireView(project)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'escort');
  const deep = questionnaireView(project, { deep: true });
  assert.equal(deep.find(item => item.id === 'tactics_action').recommendation.value, 'team');
  assert.equal(deep.find(item => item.id === 'tactics_terrain').recommendation.value, 'route');
  project = usePresetRecommendation(project, 'tactics_action');
  assert.equal(project.designDecisions.find(item => item.topic === '战棋回合抉择').status, 'provisional');
  assert.match(kickoffDraft(project), /战棋首局施工骨架/);
  assert.match(kickoffDraft(project), /短而危险的路线/);
  assert.match(kickoffDraft(project), /敌方威胁在玩家行动前可读/);
  assert.match(reviewSnapshot(project).advisories[0].source, /战棋内容包/);
});

test('独立短局草案区分暂拟与需复核，切换品类后旧决定留痕', () => {
  let project = start([]);
  project = answerQuestion(project, 'first_challenge', 'hold');
  project = usePresetRecommendation(project, 'tactics_action');
  assert.match(kickoffDraft(project), /预设建议，尚待确认[\s\S]*战棋回合抉择/);
  project = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'management');
  const draft = kickoffDraft(project);
  assert.match(draft, /需复核的旧决定[\s\S]*守住一处目标/);
  assert.match(draft, /需复核的旧决定[\s\S]*战棋回合抉择/);
});

test('改变首局目标或品类，旧战棋决定需复核且不丢历史', () => {
  let project = start(['existing']);
  project = answerQuestion(project, 'first_challenge', 'hold');
  project = answerQuestion(project, 'tactics_action', 'position');
  project = answerQuestion(project, 'tactics_terrain', 'cover');
  project = answerQuestion(project, 'first_challenge', 'escort');
  assert.equal(project.designDecisions.find(item => item.topic === '战棋回合抉择').status, 'needs_review');
  assert.equal(project.designDecisions.find(item => item.topic === '地形作用').status, 'needs_review');
  project = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'management');
  assert.equal(project.decisions.route.value, 'new_game');
  assert.equal(project.designDecisions.find(item => item.topic === '首局目标' && item.label === '护送目标抵达出口').status, 'needs_review');
  assert.ok(!questionnaireView(project, { deep: true }).some(item => item.id === 'tactics_action'));
  assert.match(kickoffDraft(project), /需复核的旧决定/);
});

const startGenre = (entries, idea, genre) => {
  let project = setInput(createProject(), idea, entries, entries.includes('existing') ? '有现成工程，尚未本次运行核验' : '', genre);
  project = choose(project, 'route', entries.includes('existing') ? 'new_game' : 'short');
  return choose(project, 'focus', entries.includes('existing') ? 'loop' : 'first_turn');
};

test('模拟经营包接入两条工程路径，推荐随原话与已选目标变化', () => {
  const bare = startGenre(['mechanic'], '想做餐厅经营游戏', 'management');
  const existing = startGenre(['existing'], '想做餐厅经营游戏', 'management');
  assert.deepEqual(questionnaireView(bare).map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  for (const id of ['mgmt_control', 'mgmt_goal', 'mgmt_pressure', 'mgmt_pacing']) {
    assert.ok(questionnaireView(bare, { deep: true }).some(item => item.id === id));
    assert.ok(questionnaireView(existing, { deep: true }).some(item => item.id === id));
  }
  let project = startGenre([], '想做撑过原料危机的经营游戏', 'management');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'shortage');
  assert.match(questionnaireView(project)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'order');
  const deep = questionnaireView(project, { deep: true });
  assert.equal(deep.find(item => item.id === 'mgmt_goal').recommendation.value, 'staged');
  assert.equal(deep.find(item => item.id === 'mgmt_pacing').recommendation.value, 'realtime');
  project = usePresetRecommendation(project, 'mgmt_goal');
  assert.equal(project.designDecisions.find(item => item.topic === '目标驱动').status, 'provisional');
  const draft = kickoffDraft(project);
  assert.match(draft, /模拟经营首局施工骨架/);
  assert.match(draft, /一块田/);
  assert.match(draft, /预设建议，尚待确认/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /模拟经营内容包/);
  assert.equal(reviewSnapshot(project).facts.filter(([topic]) => topic === '生产节奏').length, 1);
});

test('棋牌包升级保持旧选项值兼容，推荐随原话与已选目标变化', () => {
  const project0 = startGenre([], '想做识破对手破绽的牌局', 'gambling');
  const view = questionnaireView(project0);
  assert.deepEqual(view.map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(view[0].options.map(option => option.value), ['read', 'risk', 'rule']);
  assert.equal(view[0].recommendation.value, 'read');
  assert.match(view[0].recommendation.source, /待确认/);
  let project = answerQuestion(project0, 'first_challenge', 'rule');
  const deep = questionnaireView(project, { deep: true });
  for (const id of ['gam_axis', 'gam_random', 'gam_opponent']) assert.ok(deep.some(item => item.id === id));
  assert.equal(deep.find(item => item.id === 'gam_random').recommendation.value, 'minimal');
  assert.equal(deep.find(item => item.id === 'gam_opponent').recommendation.value, 'ai_single');
  project = answerQuestion(project, 'gam_axis', 'info');
  project = answerQuestion(project, 'gam_random', 'minimal');
  project = answerQuestion(project, 'gam_opponent', 'ai_single');
  const draft = kickoffDraft(project);
  assert.match(draft, /棋牌博弈首局施工骨架/);
  assert.match(draft, /公开规则对双方生效/);
  assert.match(draft, /真人匹配、天梯与 META 治理/);
  assert.ok(!/暂无完整内容包/.test(draft));
  const snapshot = reviewSnapshot(project);
  assert.match(snapshot.advisories[0].source, /棋牌博弈内容包/);
  for (const topic of ['博弈主轴', '随机性位置', '对手与赛制']) {
    assert.ok(snapshot.facts.some(([name, value]) => name === topic && value !== '未定'));
  }
});

test('肉鸽构筑包按品类进入，两种工程条件都给相同构筑判断', () => {
  const bare = startGenre(['mechanic'], '想做一个爬塔的牌组构筑游戏', 'rogue');
  const existing = startGenre(['existing'], '想做一个爬塔的牌组构筑游戏', 'rogue');
  assert.deepEqual(questionnaireView(bare).map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  for (const id of ['rogue_growth', 'rogue_deck', 'rogue_random', 'rogue_meta']) {
    assert.ok(questionnaireView(bare, { deep: true }).some(item => item.id === id));
    assert.ok(questionnaireView(existing, { deep: true }).some(item => item.id === id));
  }
  assert.equal(intakeProfile(bare).genre, 'rogue');
  assert.equal(intakeProfile(existing).genre, 'rogue');
  assert.equal(activeGenrePack('rogue')?.id, 'genre.rogue');
});

test('肉鸽包首局目标推荐标注待确认，已选目标引导成长动力与缓解手段', () => {
  let project = startGenre([], '想做用牌型凑出分数倍率的构筑游戏', 'rogue');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'threshold');
  assert.match(questionnaireView(project)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'threshold');
  const deep = questionnaireView(project, { deep: true });
  assert.equal(deep.find(item => item.id === 'rogue_growth').recommendation.value, 'multiplicative');
  assert.equal(deep.find(item => item.id === 'rogue_deck').recommendation.value, 'thin');
  assert.equal(deep.find(item => item.id === 'rogue_random').recommendation.value, 'skip');
  const meta = deep.find(item => item.id === 'rogue_meta');
  assert.equal(meta.recommendation.value, 'sideways');
  assert.match(meta.recommendation.source, /低证据|证据薄弱|仅供讨论/);
  assert.equal(meta.recommended, null);
  project = usePresetRecommendation(project, 'rogue_random');
  assert.equal(project.designDecisions.find(item => item.topic === '随机与缓解').status, 'provisional');
  const draft = kickoffDraft(project);
  assert.match(draft, /肉鸽构筑首局施工骨架/);
  assert.match(draft, /敌人下一步意图在玩家行动前可读/);
  assert.match(draft, /预设建议，尚待确认/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /肉鸽构筑内容包/);
});

test('肉鸽包默认推荐可追踪来源，未确认时不冒充已确认', () => {
  let project = startGenre([], '想做一个爬塔游戏', 'rogue');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'climb');
  assert.equal(questionnaireView(project)[0].recommendation.source, '肉鸽构筑内容包预设');
  const deep = questionnaireView(project, { deep: true });
  for (const id of ['rogue_growth', 'rogue_deck', 'rogue_random']) {
    assert.equal(deep.find(item => item.id === id).recommendation.source, '肉鸽构筑内容包预设');
  }
  project = answerQuestion(project, 'first_challenge', 'climb');
  const after = questionnaireView(project, { deep: true });
  assert.match(after.find(item => item.id === 'rogue_growth').recommendation.source, /已确认的首局目标＋肉鸽构筑内容包/);
});

test('切换出肉鸽品类后旧构筑决定留痕并需复核', () => {
  let project = startGenre([], '想做一个爬塔的牌组构筑游戏', 'rogue');
  project = answerQuestion(project, 'first_challenge', 'climb');
  project = answerQuestion(project, 'rogue_growth', 'mechanic');
  project = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics');
  assert.ok(!questionnaireView(project, { deep: true }).some(item => item.id === 'rogue_growth'));
  assert.match(kickoffDraft(project), /需复核的旧决定[\s\S]*成长动力/);
});

test('银河恶魔城包按品类进入，两种工程条件都给相同门控判断', () => {
  const bare = startGenre(['mechanic'], '想做一个能力门控的横版探索游戏', 'metroidvania');
  const existing = startGenre(['existing'], '想做一个能力门控的横版探索游戏', 'metroidvania');
  assert.deepEqual(questionnaireView(bare).map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  for (const id of ['mv_gate_ratio', 'mv_gate_style', 'mv_backtrack', 'mv_scope', 'mv_combat', 'mv_save']) {
    assert.ok(questionnaireView(bare, { deep: true }).some(item => item.id === id));
    assert.ok(questionnaireView(existing, { deep: true }).some(item => item.id === id));
  }
  assert.equal(intakeProfile(bare).genre, 'metroidvania');
  assert.equal(intakeProfile(existing).genre, 'metroidvania');
  assert.equal(activeGenrePack('metroidvania')?.id, 'genre.metroidvania');
});

test('银河恶魔城包首局目标推荐标注待确认，已选目标引导门控配比与回跑手段', () => {
  let project = startGenre([], '想做一块可以反复探索补满的地图', 'metroidvania');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'map');
  assert.match(questionnaireView(project)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'map');
  const deep = questionnaireView(project, { deep: true });
  assert.equal(deep.find(item => item.id === 'mv_gate_ratio').recommendation.value, 'two_plus');
  assert.equal(deep.find(item => item.id === 'mv_gate_style').recommendation.value, 'soft');
  assert.equal(deep.find(item => item.id === 'mv_backtrack').recommendation.value, 'shortcuts');
  assert.equal(deep.find(item => item.id === 'mv_save').recommendation.value, 'defined_cap');
  const scope = deep.find(item => item.id === 'mv_scope');
  assert.equal(scope.recommendation.value, 'expand_later');
  assert.match(scope.recommendation.source, /证据单薄|仅供讨论|低证据/);
  project = usePresetRecommendation(project, 'mv_gate_ratio');
  assert.equal(project.designDecisions.find(item => item.topic === '能力门配比').status, 'provisional');
  const draft = kickoffDraft(project);
  assert.match(draft, /银河城首局施工骨架/);
  assert.match(draft, /每个能力都解锁至少 2 处/);
  assert.match(draft, /预设建议，尚待确认/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /银河城内容包/);
});

test('银河恶魔城包默认推荐可追踪来源，未确认时不冒充已确认', () => {
  let project = startGenre([], '想做一个银河恶魔城', 'metroidvania');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'unlock');
  assert.equal(questionnaireView(project)[0].recommendation.source, '银河恶魔城内容包预设');
  const deep = questionnaireView(project, { deep: true });
  for (const id of ['mv_gate_ratio', 'mv_gate_style', 'mv_backtrack']) {
    assert.equal(deep.find(item => item.id === id).recommendation.source, '银河恶魔城内容包预设');
  }
  project = answerQuestion(project, 'first_challenge', 'unlock');
  const after = questionnaireView(project, { deep: true });
  assert.match(after.find(item => item.id === 'mv_gate_ratio').recommendation.source, /已确认的首局目标＋银河恶魔城内容包/);
});

test('切换出银河恶魔城品类后旧门控决定留痕并需复核', () => {
  let project = startGenre([], '想做一个能力门控的横版探索游戏', 'metroidvania');
  project = answerQuestion(project, 'first_challenge', 'unlock');
  project = answerQuestion(project, 'mv_gate_ratio', 'one');
  project = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics');
  assert.ok(!questionnaireView(project, { deep: true }).some(item => item.id === 'mv_gate_ratio'));
  assert.match(kickoffDraft(project), /需复核的旧决定[\s\S]*能力门配比/);
});

test('银河恶魔城包结构硬规则：每能力至少开两处已见门、开局可达触及首能力', () => {
  const pack = activeGenrePack('metroidvania');
  assert.equal(validateContentPack(pack), pack);
  const acceptance = pack.prototype.acceptance.join('；');
  assert.match(acceptance, /每个能力都解锁至少 2 处/);
  assert.match(acceptance, /零能力.*触及第一个能力/);
  assert.match(acceptance, /3–5 个/);
  assert.match(pack.prototype.defer.join('；'), /随机生成地图/);
  // 每个首局目标都有对应 mission，否则 validateContentPack 会抛错
  for (const option of pack.firstChallenge.options) assert.ok(pack.prototype.missions[option.value]);
});

test('视觉小说包按品类进入，两种工程条件都给相同叙事判断', () => {
  const bare = startGenre(['mechanic'], '想做一个多结局的剧情游戏', 'visual-novel');
  const existing = startGenre(['existing'], '想做一个多结局的剧情游戏', 'visual-novel');
  assert.deepEqual(questionnaireView(bare).map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  for (const id of ['vn_shape', 'vn_choice_type', 'vn_feedback', 'vn_scope', 'vn_protagonist', 'vn_ending']) {
    assert.ok(questionnaireView(bare, { deep: true }).some(item => item.id === id));
    assert.ok(questionnaireView(existing, { deep: true }).some(item => item.id === id));
  }
  assert.equal(intakeProfile(bare).genre, 'visual-novel');
  assert.equal(intakeProfile(existing).genre, 'visual-novel');
  assert.equal(activeGenrePack('visual-novel')?.id, 'genre.visual-novel');
});

test('视觉小说包首局目标推荐标注待确认，已选目标引导结构形态与选择形态', () => {
  let project = startGenre([], '想做分支剧情的视觉小说', 'visual-novel');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'branch_once');
  assert.match(questionnaireView(project)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'branch_once');
  const deep = questionnaireView(project, { deep: true });
  assert.equal(deep.find(item => item.id === 'vn_shape').recommendation.value, 'trunk_branch');
  assert.equal(deep.find(item => item.id === 'vn_choice_type').recommendation.value, 'remember');
  assert.equal(deep.find(item => item.id === 'vn_feedback').recommendation.value, 'immediate');
  assert.equal(deep.find(item => item.id === 'vn_protagonist').recommendation.value, 'voiced');
  assert.equal(deep.find(item => item.id === 'vn_ending').recommendation.value, 'closure');
  const scope = deep.find(item => item.id === 'vn_scope');
  assert.equal(scope.recommendation.value, 'expand_later');
  assert.match(scope.recommendation.source, /证据单薄|仅供讨论|低证据/);
  project = usePresetRecommendation(project, 'vn_choice_type');
  assert.equal(project.designDecisions.find(item => item.topic === '选择形态').status, 'provisional');
  const draft = kickoffDraft(project);
  assert.match(draft, /视觉小说首局施工骨架/);
  assert.match(draft, /角色提及与开门条件的数量应不少于换路/);
  assert.match(draft, /预设建议，尚待确认/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /视觉小说内容包/);
});

test('视觉小说包默认推荐可追踪来源，未确认时不冒充已确认', () => {
  let project = startGenre([], '想做一个视觉小说', 'visual-novel');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'read_through');
  assert.equal(questionnaireView(project)[0].recommendation.source, '视觉小说内容包预设');
  const deep = questionnaireView(project, { deep: true });
  for (const id of ['vn_shape', 'vn_choice_type', 'vn_feedback']) {
    assert.equal(deep.find(item => item.id === id).recommendation.source, '视觉小说内容包预设');
  }
  project = answerQuestion(project, 'first_challenge', 'read_through');
  const after = questionnaireView(project, { deep: true });
  assert.equal(after.find(item => item.id === 'vn_shape').recommendation.value, 'kinetic');
  assert.match(after.find(item => item.id === 'vn_shape').recommendation.source, /已确认的首局目标＋视觉小说内容包/);
});

test('切换出视觉小说品类后旧叙事决定留痕并需复核', () => {
  let project = startGenre([], '想做一个多结局的剧情游戏', 'visual-novel');
  project = answerQuestion(project, 'first_challenge', 'read_through');
  project = answerQuestion(project, 'vn_shape', 'kinetic');
  project = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics');
  assert.ok(!questionnaireView(project, { deep: true }).some(item => item.id === 'vn_shape'));
  assert.match(kickoffDraft(project), /需复核的旧决定[\s\S]*结构形态/);
});

test('视觉小说包结构硬规则：不归路红线、反馈层优先、结局须有收束', () => {
  const pack = activeGenrePack('visual-novel');
  assert.equal(validateContentPack(pack), pack);
  const acceptance = pack.prototype.acceptance.join('；');
  assert.match(acceptance, /不存在不归路/);
  assert.match(acceptance, /角色提及与开门条件的数量应不少于换路/);
  assert.match(acceptance, /坏结局含有收束内容/);
  assert.match(acceptance, /动笔前存在一份完整结构文档/);
  assert.match(pack.prototype.defer.join('；'), /多线解谜/);
  // 每个首局目标都有对应 mission，否则 validateContentPack 会抛错
  for (const option of pack.firstChallenge.options) assert.ok(pack.prototype.missions[option.value]);
});

test('解谜包按品类进入，两种工程条件都给相同谜题判断', () => {
  const bare = startGenre(['mechanic'], '想做一个烧脑的解谜游戏，玩家要观察场景找线索', 'puzzle');
  const existing = startGenre(['existing'], '想做一个烧脑的解谜游戏，玩家要观察场景找线索', 'puzzle');
  assert.deepEqual(questionnaireView(bare).map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  for (const id of ['pz_axis', 'pz_teach', 'pz_fairness', 'pz_hint', 'pz_difficulty', 'pz_scope']) {
    assert.ok(questionnaireView(bare, { deep: true }).some(item => item.id === id));
    assert.ok(questionnaireView(existing, { deep: true }).some(item => item.id === id));
  }
  assert.equal(intakeProfile(bare).genre, 'puzzle');
  assert.equal(intakeProfile(existing).genre, 'puzzle');
  assert.equal(activeGenrePack('puzzle')?.id, 'genre.puzzle');
});

test('解谜包从想法推测品类，且不与视觉小说/银河城抢包', () => {
  assert.equal(intakeProfile(startGenre(['mechanic'], '想做一个烧脑的解谜游戏', 'auto')).genre, 'puzzle');
  assert.equal(intakeProfile(startGenre(['mechanic'], '玩家要推箱子一样一步步解开机关', 'auto')).genre, 'puzzle');
  assert.equal(intakeProfile(startGenre(['mechanic'], '想做一款密室逃脱游戏', 'auto')).genre, 'puzzle');
  assert.equal(intakeProfile(startGenre(['mechanic'], '想做一个多结局的剧情游戏', 'auto')).genre, 'visual-novel');
  assert.equal(intakeProfile(startGenre(['mechanic'], '想做能力锁的横版探索', 'auto')).genre, 'metroidvania');
});

test('解谜包首局目标推荐：无原话线索时给预设，有线索时标注待确认', () => {
  let project = startGenre([], '想做一个解谜游戏', 'puzzle');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'mechanic_ladder');
  assert.equal(questionnaireView(project)[0].recommendation.source, '解谜内容包预设');
  const clue = startGenre([], '想做靠逻辑推理、答案唯一的小谜题集', 'puzzle');
  assert.equal(questionnaireView(clue)[0].recommendation.value, 'deduce_chain');
  assert.match(questionnaireView(clue)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'mechanic_ladder');
  const deep = questionnaireView(project, { deep: true });
  assert.equal(deep.find(item => item.id === 'pz_axis').recommendation.value, 'ladder');
  assert.equal(deep.find(item => item.id === 'pz_teach').recommendation.value, 'demo_then_use');
  assert.equal(deep.find(item => item.id === 'pz_fairness').recommendation.value, 'all_in_game');
  assert.equal(deep.find(item => item.id === 'pz_difficulty').recommendation.value, 'sawtooth');
  const hint = deep.find(item => item.id === 'pz_hint');
  assert.equal(hint.recommendation.value, 'assumption');
  assert.match(hint.recommendation.source, /单篇|仅供讨论|低证据/);
  const scope = deep.find(item => item.id === 'pz_scope');
  assert.equal(scope.recommendation.value, 'expand_later');
  assert.match(scope.recommendation.source, /证据单薄|仅供讨论|低证据/);
  project = usePresetRecommendation(project, 'pz_axis');
  assert.equal(project.designDecisions.find(item => item.topic === '关卡形态').status, 'provisional');
  const draft = kickoffDraft(project);
  assert.match(draft, /解谜首局施工骨架/);
  assert.match(draft, /考验什么/);
  assert.match(draft, /预设建议，尚待确认/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /解谜内容包/);
});

test('解谜包默认推荐可追踪来源，未确认时不冒充已确认', () => {
  let project = startGenre([], '想做一个解谜游戏', 'puzzle');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'mechanic_ladder');
  assert.equal(questionnaireView(project)[0].recommendation.source, '解谜内容包预设');
  const deep = questionnaireView(project, { deep: true });
  for (const id of ['pz_axis', 'pz_teach', 'pz_fairness']) {
    assert.equal(deep.find(item => item.id === id).recommendation.source, '解谜内容包预设');
  }
  project = answerQuestion(project, 'first_challenge', 'mechanic_ladder');
  const after = questionnaireView(project, { deep: true });
  assert.match(after.find(item => item.id === 'pz_axis').recommendation.source, /已确认的首局目标＋解谜内容包/);
});

test('解谜包原话线索分流：推理链与洞察关可被识别', () => {
  const logic = startGenre([], '想做一款靠逻辑推理、答案唯一的小谜题集', 'puzzle');
  assert.equal(questionnaireView(logic)[0].recommendation.value, 'deduce_chain');
  assert.match(questionnaireView(logic)[0].recommendation.source, /待确认/);
  const insight = startGenre([], '想做让人恍然大悟的巧妙解谜', 'puzzle');
  assert.equal(questionnaireView(insight)[0].recommendation.value, 'insight_room');
});

test('切换出解谜品类后旧谜题决定留痕并需复核', () => {
  let project = startGenre([], '想做一个烧脑的解谜游戏', 'puzzle');
  project = answerQuestion(project, 'first_challenge', 'mechanic_ladder');
  project = answerQuestion(project, 'pz_axis', 'ladder');
  project = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics');
  assert.ok(!questionnaireView(project, { deep: true }).some(item => item.id === 'pz_axis'));
  assert.match(kickoffDraft(project), /需复核的旧决定[\s\S]*关卡形态/);
});

test('解谜包结构硬规则：公平性检验、归纳检验、不藏信息', () => {
  const pack = activeGenrePack('puzzle');
  assert.equal(validateContentPack(pack), pack);
  const acceptance = pack.prototype.acceptance.join('；');
  assert.match(acceptance, /公平性检验/);
  assert.match(acceptance, /归纳检验/);
  assert.match(acceptance, /关键交互物能从背景中清楚区分/);
  assert.match(acceptance, /同一套规则贯穿全部关卡/);
  assert.match(pack.prototype.defer.join('；'), /程序生成与求解器/);
  assert.match(pack.prototype.defer.join('；'), /需要真实世界或冷门外部知识的谜题/);
  // 每个首局目标都有对应 mission，否则 validateContentPack 会抛错
  for (const option of pack.firstChallenge.options) assert.ok(pack.prototype.missions[option.value]);
});

test('无完整包的品类在草案中如实标注覆盖不足', () => {
  const project = startGenre([], '想做平台跳跃游戏', 'other');
  assert.match(kickoffDraft(project), /暂无完整内容包/);
  const existing = startGenre(['existing'], '想做平台跳跃游戏', 'other');
  assert.match(kickoffDraft(existing), /暂无完整内容包/);
});

test('古风风格包通过含核验的契约校验，缺核验即拒绝', () => {
  const pack = activeStylePack('guofeng');
  assert.ok(pack);
  assert.equal(pack.axis, 'style');
  assert.equal(pack.status, 'complete');
  assert.equal(validateContentPack(pack), pack);
  assert.ok(Array.isArray(pack.verification) && pack.verification.length >= 3);
  assert.throws(() => validateContentPack({ ...pack, verification: [] }), /呈现核验/);
  assert.throws(() => validateContentPack({ ...pack, verification: undefined }), /呈现核验/);
  assert.equal(activeStylePack('unknown'), null);
});

test('风格包只改变呈现与核验，不改写胜负或回合规则', () => {
  const pack = activeStylePack('guofeng');
  const { visual, text, feedback } = pack.presentation;
  for (const slot of [visual, text, feedback]) assert.ok(typeof slot === 'string' && slot.length > 40);
  // 风格包不得自带任何胜负/首局/回合字段
  for (const forbidden of ['firstChallenge', 'prototype', 'questions']) assert.equal(pack[forbidden], undefined);
  const plan = stylePackPlan('guofeng');
  assert.match(plan, /古风表现指导/);
  assert.match(plan, /画面：/);
  assert.match(plan, /文本：/);
  assert.match(plan, /反馈：/);
  assert.match(plan, /呈现核验：/);
  assert.match(plan, /依据边界：/);
  assert.equal(stylePackPlan('none'), '');
  assert.equal(stylePackPlan('unknown'), '');
});

test('选定古风后草案出现表现指导，且与品类包并存互不覆盖', () => {
  let project = setInput(createProject(), '想做一款武侠题材的短局游戏', ['mechanic'], '', 'tactics', 'guofeng');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const draft = kickoffDraft(project);
  assert.match(draft, /战棋首局施工骨架/);
  assert.match(draft, /古风表现指导（风格包预设）/);
  assert.match(draft, /首屏就要打出最独特的文化符号/);
  assert.match(draft, /自由联想测试/);
  // 表现风格不得挤掉品类包的胜负判断
  assert.match(draft, /战棋首局施工骨架[\s\S]*古风表现指导/);
  assert.match(draft, /牌组构筑归本包|依据边界：离线设计预设/);
});

test('不选风格时草案不出现风格包，且风格独立于品类与工程', () => {
  let project = startGenre([], '想做战棋', 'tactics');
  assert.ok(!/表现指导（风格包预设）/.test(kickoffDraft(project)));
  // 有工程不改变风格判断：加风格后两种工程路径都出现同一段表现指导
  const bare = setInput(createProject(), '想做武侠短局', ['mechanic'], '', 'other', 'guofeng');
  const withEngine = setInput(createProject(), '想做武侠短局', ['existing'], '有现成工程', 'other', 'guofeng');
  for (const item of [bare, withEngine]) {
    const p = choose(item, 'route', item.input.entries.includes('existing') ? 'new_game' : 'short');
    const q = choose(p, 'focus', item.input.entries.includes('existing') ? 'loop' : 'first_turn');
    assert.match(kickoffDraft(q), /古风表现指导（风格包预设）/);
  }
});

test('风格栏非法值被拒绝，旧记录可回写并保留风格', () => {
  assert.throws(() => setInput(createProject(), '随便', ['mechanic'], '', 'tactics', 'nonexistent'), /未知表现风格/);
  let project = setInput(createProject(), '想做武侠短局', ['mechanic'], '', 'tactics', 'guofeng');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const revalidated = validateProject(project);
  assert.equal(revalidated.input.style, 'guofeng');
  assert.match(projectOverview(revalidated), /表现风格：古风（武侠、仙侠、国潮）/);
  // 只改风格、不动材料，不应把已确认的路线打回需复核
  const switched = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics', 'none');
  assert.equal(switched.decisions.route.status, 'accepted');
  assert.ok(!/表现指导（风格包预设）/.test(kickoffDraft(switched)));
});

test('二次元风格包通过含核验的契约校验，只改表现不改胜负', () => {
  const pack = activeStylePack('anime');
  assert.ok(pack);
  assert.equal(pack.id, 'style.anime');
  assert.equal(pack.axis, 'style');
  assert.equal(pack.status, 'complete');
  assert.equal(validateContentPack(pack), pack);
  assert.ok(Array.isArray(pack.verification) && pack.verification.length >= 3);
  for (const forbidden of ['firstChallenge', 'prototype', 'questions']) assert.equal(pack[forbidden], undefined);
  const plan = stylePackPlan('anime');
  assert.match(plan, /二次元表现指导/);
  assert.match(plan, /剪影测试/);
  assert.match(plan, /记忆点移除测试/);
  assert.match(plan, /依据边界：离线设计预设/);
});

test('多个风格包并存且互不串味，切换风格只换表现段', () => {
  const base = () => {
    let p = setInput(createProject(), '想做一款短局游戏', ['mechanic'], '', 'tactics', 'guofeng');
    p = choose(p, 'route', 'short');
    return choose(p, 'focus', 'first_turn');
  };
  const guofeng = kickoffDraft(base());
  const switched = setInput(base(), '想做一款短局游戏', ['mechanic'], '', 'tactics', 'anime');
  const anime = kickoffDraft(switched);
  assert.match(guofeng, /古风表现指导/);
  assert.ok(!/二次元表现指导/.test(guofeng));
  assert.match(anime, /二次元表现指导/);
  assert.ok(!/古风表现指导/.test(anime));
  // 品类骨架两版都在，风格不改变品类判断
  assert.match(guofeng, /战棋首局施工骨架/);
  assert.match(anime, /战棋首局施工骨架/);
  assert.equal(switched.decisions.route.status, 'accepted');
});

test('西幻风格包通过含核验的契约校验，缺核验即拒绝', () => {
  const pack = activeStylePack('western-fantasy');
  assert.ok(pack);
  assert.equal(pack.id, 'style.western-fantasy');
  assert.equal(pack.axis, 'style');
  assert.equal(pack.status, 'complete');
  assert.equal(validateContentPack(pack), pack);
  assert.ok(Array.isArray(pack.verification) && pack.verification.length >= 3);
  assert.throws(() => validateContentPack({ ...pack, verification: [] }), /呈现核验/);
  assert.throws(() => validateContentPack({ ...pack, presentation: { ...pack.presentation, feedback: '' } }), /表现指导/);
});

test('西幻风格包只改呈现不改胜负，且反馈层如实标注低证据', () => {
  const pack = activeStylePack('western-fantasy');
  const { visual, text, feedback } = pack.presentation;
  for (const slot of [visual, text, feedback]) assert.ok(typeof slot === 'string' && slot.length > 40);
  for (const forbidden of ['firstChallenge', 'prototype', 'questions']) assert.equal(pack[forbidden], undefined);
  // 反馈层证据薄，必须明说，不得冒充来源
  assert.match(feedback, /证据偏薄|低证据/);
  assert.match(feedback, /外推/);
  assert.match(pack.boundary, /依据公开检索与卡片库蒸馏/);
  assert.match(pack.boundary, /未运行、未平衡、未试玩/);
  const plan = stylePackPlan('western-fantasy');
  assert.match(plan, /西幻表现指导（风格包预设）/);
  assert.match(plan, /画面：/);
  assert.match(plan, /文本：/);
  assert.match(plan, /反馈：/);
  assert.match(plan, /呈现核验：/);
  assert.match(plan, /依据边界：/);
});

test('西幻的验收判据可外部观察，且与相邻风格包划界', () => {
  const pack = activeStylePack('western-fantasy');
  const checks = pack.verification.join(' ');
  // 身份 / 联想 / 色板 / 剪影 / 对比度 / 命名 六类至少覆盖到关键动作
  assert.match(checks, /身份测试/);
  assert.match(checks, /联想指向测试/);
  assert.match(checks, /色板收窄/);
  assert.match(checks, /剪影可读性/);
  assert.match(checks, /对比度可读性/);
  assert.match(checks, /命名质检/);
  // 必须交给目标市场的人看，不能自评
  assert.match(checks, /不能只由设计者自评/);
  // 与古风/二次元的划界写在画面层与边界里
  assert.match(pack.boundary, /古风|赛博朋克|二次元/);
  assert.match(pack.presentation.visual, /自然主义|材质可信/);
  // 不得承诺「考据准确即等于做对了」
  assert.ok(!/考据.*(过关|合格|正确)的?(唯一|全部)标准/.test(pack.presentation.visual));
});

test('选定西幻后草案出现表现指导，且与品类包并存互不覆盖', () => {
  let project = setInput(createProject(), '想做一款中世纪骑士题材的短局游戏', ['mechanic'], '', 'tactics', 'western-fantasy');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const draft = kickoffDraft(project);
  assert.match(draft, /战棋首局施工骨架/);
  assert.match(draft, /西幻表现指导（风格包预设）/);
  assert.match(draft, /泛泛的中世纪奇幻|这个世界是不是自己的/);
  assert.match(draft, /身份测试/);
  // 表现风格不得挤掉品类包的胜负判断
  assert.match(draft, /战棋首局施工骨架[\s\S]*西幻表现指导/);
});

test('三个风格包互不串味，切换风格只换表现段且保留品类判断', () => {
  const base = (style) => {
    let p = setInput(createProject(), '想做一款短局游戏', ['mechanic'], '', 'tactics', style);
    p = choose(p, 'route', 'short');
    return choose(p, 'focus', 'first_turn');
  };
  const guofeng = kickoffDraft(base('guofeng'));
  const anime = kickoffDraft(base('anime'));
  const western = kickoffDraft(base('western-fantasy'));
  assert.match(guofeng, /古风表现指导/);
  assert.match(anime, /二次元表现指导/);
  assert.match(western, /西幻表现指导/);
  // 三者互不出现对方的风格段
  assert.ok(!/西幻表现指导/.test(guofeng));
  assert.ok(!/西幻表现指导/.test(anime));
  assert.ok(!/古风表现指导|二次元表现指导/.test(western));
  // 品类骨架三版都在
  for (const draft of [guofeng, anime, western]) assert.match(draft, /战棋首局施工骨架/);
});

test('赛博朋克风格包通过含核验的契约校验，缺核验即拒绝', () => {
  const pack = activeStylePack('cyberpunk');
  assert.ok(pack);
  assert.equal(pack.id, 'style.cyberpunk');
  assert.equal(pack.axis, 'style');
  assert.equal(pack.status, 'complete');
  assert.equal(validateContentPack(pack), pack);
  assert.ok(Array.isArray(pack.verification) && pack.verification.length >= 3);
  assert.throws(() => validateContentPack({ ...pack, verification: [] }), /呈现核验/);
  assert.throws(() => validateContentPack({ ...pack, presentation: { ...pack.presentation, visual: '' } }), /表现指导/);
});

test('赛博朋克风格包只改呈现不改胜负，且反馈层如实标注低证据', () => {
  const pack = activeStylePack('cyberpunk');
  const { visual, text, feedback } = pack.presentation;
  for (const slot of [visual, text, feedback]) assert.ok(typeof slot === 'string' && slot.length > 40);
  for (const forbidden of ['firstChallenge', 'prototype', 'questions']) assert.equal(pack[forbidden], undefined);
  // 反馈层证据薄，必须明说，不得冒充来源
  assert.match(feedback, /证据偏薄|低证据/);
  assert.match(feedback, /外推/);
  // 检索到但无可核查作者/方法的来源必须明说未采信
  assert.match(feedback, /未采信/);
  assert.match(pack.boundary, /依据公开检索与卡片库蒸馏/);
  assert.match(pack.boundary, /未运行、未平衡、未试玩/);
  const plan = stylePackPlan('cyberpunk');
  assert.match(plan, /赛博朋克表现指导（风格包预设）/);
  for (const seg of ['画面：', '文本：', '反馈：', '呈现核验：', '依据边界：']) assert.ok(plan.includes(seg));
});

test('赛博朋克的验收判据可外部观察，且与相邻风格包划界', () => {
  const pack = activeStylePack('cyberpunk');
  const checks = pack.verification.join(' ');
  // 并置 / 反差 / 空间辨认 / 留白落点 / 雷同自检 / 语域回读 六类
  assert.match(checks, /并置测试/);
  assert.match(checks, /反差测试/);
  assert.match(checks, /空间辨认测试/);
  assert.match(checks, /留白与落点测试/);
  assert.match(checks, /雷同自检/);
  assert.match(checks, /语域回读测试/);
  assert.match(checks, /不能只由设计者自评/);
  // 与西幻/二次元/古风划界写在边界里
  assert.match(pack.boundary, /西幻|二次元|古风/);
  // 核心判据：塞满未来之物不是赛博朋克，只是科幻
  assert.match(pack.presentation.visual, /不是赛博朋克|只是科幻/);
  // 留白/视觉噪音这条必须来自一手自承的翻车点
  assert.match(pack.presentation.visual, /留白/);
});

test('选定赛博朋克后草案出现表现指导，且与品类包并存互不覆盖', () => {
  let project = setInput(createProject(), '想做一款近未来义体题材的短局游戏', ['mechanic'], '', 'tactics', 'cyberpunk');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const draft = kickoffDraft(project);
  assert.match(draft, /战棋首局施工骨架/);
  assert.match(draft, /赛博朋克表现指导（风格包预设）/);
  assert.match(draft, /只是科幻|霓虹/);
  assert.match(draft, /并置测试/);
  // 表现风格不得挤掉品类包的胜负判断
  assert.match(draft, /战棋首局施工骨架[\s\S]*赛博朋克表现指导/);
});

test('四个风格包互不串味，切换风格只换表现段且保留品类判断', () => {
  const base = (style) => {
    let p = setInput(createProject(), '想做一款短局游戏', ['mechanic'], '', 'tactics', style);
    p = choose(p, 'route', 'short');
    return choose(p, 'focus', 'first_turn');
  };
  const drafts = {
    guofeng: kickoffDraft(base('guofeng')),
    anime: kickoffDraft(base('anime')),
    'western-fantasy': kickoffDraft(base('western-fantasy')),
    cyberpunk: kickoffDraft(base('cyberpunk')),
  };
  const titles = { guofeng: '古风表现指导', anime: '二次元表现指导', 'western-fantasy': '西幻表现指导', cyberpunk: '赛博朋克表现指导' };
  for (const [style, title] of Object.entries(titles)) {
    assert.match(drafts[style], new RegExp(title));
    // 不出现其他三个风格的表现段
    for (const [other, otherTitle] of Object.entries(titles)) {
      if (other === style) continue;
      assert.ok(!new RegExp(otherTitle).test(drafts[style]), `${style} 不应含 ${otherTitle}`);
    }
    assert.match(drafts[style], /战棋首局施工骨架/);
  }
});

test('五个风格包互不串味，切换风格只换表现段且保留品类判断', () => {
  const base = (style) => {
    let p = setInput(createProject(), '想做一款短局游戏', ['mechanic'], '', 'tactics', style);
    p = choose(p, 'route', 'short');
    return choose(p, 'focus', 'first_turn');
  };
  const titles = {
    guofeng: '古风表现指导',
    anime: '二次元表现指导',
    'western-fantasy': '西幻表现指导',
    cyberpunk: '赛博朋克表现指导',
    steampunk: '蒸汽朋克表现指导',
  };
  const drafts = {};
  for (const style of Object.keys(titles)) drafts[style] = kickoffDraft(base(style));
  for (const [style, title] of Object.entries(titles)) {
    assert.match(drafts[style], new RegExp(title));
    // 不出现其他四个风格的表现段
    for (const [other, otherTitle] of Object.entries(titles)) {
      if (other === style) continue;
      assert.ok(!new RegExp(otherTitle).test(drafts[style]), `${style} 不应含 ${otherTitle}`);
    }
    assert.match(drafts[style], /战棋首局施工骨架/);
  }
});

test('九个风格包互不串味，切换风格只换表现段且保留品类判断', () => {
  const base = (style) => {
    let p = setInput(createProject(), '想做一款短局游戏', ['mechanic'], '', 'tactics', style);
    p = choose(p, 'route', 'short');
    return choose(p, 'focus', 'first_turn');
  };
  const titles = {
    guofeng: '古风表现指导',
    anime: '二次元表现指导',
    'western-fantasy': '西幻表现指导',
    cyberpunk: '赛博朋克表现指导',
    steampunk: '蒸汽朋克表现指导',
    cozy: '治愈系表现指导',
    pixel: '像素复古表现指导',
    horror: '恐怖氛围表现指导',
    'hard-scifi': '硬科幻表现指导',
  };
  const drafts = {};
  for (const style of Object.keys(titles)) drafts[style] = kickoffDraft(base(style));
  for (const [style, title] of Object.entries(titles)) {
    assert.match(drafts[style], new RegExp(title));
    // 不出现其他八个风格的表现段
    for (const [other, otherTitle] of Object.entries(titles)) {
      if (other === style) continue;
      assert.ok(!new RegExp(otherTitle).test(drafts[style]), `${style} 不应含 ${otherTitle}`);
    }
    assert.match(drafts[style], /战棋首局施工骨架/);
  }
});

test('治愈系风格包通过含核验的契约校验，缺核验即拒绝', () => {
  const pack = activeStylePack('cozy');
  assert.ok(pack);
  assert.equal(pack.id, 'style.cozy');
  assert.equal(pack.axis, 'style');
  assert.equal(pack.status, 'complete');
  assert.equal(validateContentPack(pack), pack);
  assert.ok(Array.isArray(pack.verification) && pack.verification.length >= 3);
  assert.throws(() => validateContentPack({ ...pack, verification: [] }), /呈现核验/);
  assert.throws(() => validateContentPack({ ...pack, presentation: { ...pack.presentation, feedback: '' } }), /表现指导/);
});

test('治愈系风格包只改呈现不改胜负，且反馈层如实标注低证据', () => {
  const pack = activeStylePack('cozy');
  const { visual, text, feedback } = pack.presentation;
  for (const slot of [visual, text, feedback]) assert.ok(typeof slot === 'string' && slot.length > 40);
  for (const forbidden of ['firstChallenge', 'prototype', 'questions']) assert.equal(pack[forbidden], undefined);
  // 反馈层证据薄，必须明说，不得冒充来源
  assert.match(feedback, /证据单薄|低证据/);
  // 文本层同样标有限，不得假装充分
  assert.match(text, /证据有限|低证据/);
  // 来源之间存在真实分歧，必须原样报告而不是择一粉饰
  assert.match(feedback + pack.verification.join(' '), /分歧|矛盾/);
  assert.match(pack.boundary, /依据公开检索与卡片库蒸馏/);
  assert.match(pack.boundary, /未运行、未平衡、未试玩/);
  const plan = stylePackPlan('cozy');
  assert.match(plan, /治愈系表现指导（风格包预设）/);
  for (const seg of ['画面：', '文本：', '反馈：', '呈现核验：', '依据边界：']) assert.ok(plan.includes(seg));
});

test('治愈系的验收判据可外部观察，并与恐怖氛围包划清交界', () => {
  const pack = activeStylePack('cozy');
  const checks = pack.verification.join(' ');
  // 对比 / 跨门槛 / 节奏权 / 仪式三条件 / 差异化自述 / 玩家依赖
  assert.match(checks, /对比测试/);
  assert.match(checks, /跨门槛测试/);
  assert.match(checks, /节奏权测试/);
  assert.match(checks, /仪式三条件测试/);
  assert.match(checks, /差异化自述/);
  assert.match(checks, /玩家依赖确认/);
  assert.match(checks, /不能只由设计者自评/);
  // 核心判据：用对比生成庇护感，不是把一切做暖
  assert.match(pack.presentation.visual, /对比生成庇护感|看得见但进不来/);
  // 「画风治愈不构成卖点」的市场反例必须写明
  assert.match(pack.presentation.visual + checks, /差异|同质化/);
  // 与恐怖氛围包的交界必须写明归属
  assert.match(pack.boundary, /恐怖氛围/);
  assert.match(pack.boundary, /安全区/);
});

test('治愈系风格包与恐怖氛围包互不串味（两包定位相反，不得互相包含）', () => {
  const cozy = activeStylePack('cozy');
  // 治愈系不得把「不适成为主体」写进自己的呈现指导
  assert.ok(!/不适本身即主体|危险是主体/.test(cozy.presentation.visual));
  // 治愈系必须把「不适挡在外面」写成纪律，而不是写成追求危险
  assert.match(cozy.presentation.visual, /看得见但进不来|挡在外面|安全地/);
  // 边界必须点明 creepy-cozy 交界的归属判据
  assert.match(cozy.boundary, /侵入安全区|失去节奏掌控|失去掌控/);
});

test('选定治愈系后草案出现表现指导，且与品类包并存互不覆盖', () => {
  let project = setInput(createProject(), '想做一款安静的咖啡店经营短局', ['mechanic'], '', 'tactics', 'cozy');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const draft = kickoffDraft(project);
  assert.match(draft, /战棋首局施工骨架/);
  assert.match(draft, /治愈系表现指导（风格包预设）/);
  assert.match(draft, /对比测试/);
  // 表现风格不得挤掉品类包的胜负判断
  assert.match(draft, /战棋首局施工骨架[\s\S]*治愈系表现指导/);
});

test('治愈系风格栏非法值被拒绝，旧记录回写保留风格', () => {
  let project = setInput(createProject(), '想做安静的咖啡店经营短局', ['mechanic'], '', 'tactics', 'cozy');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const revalidated = validateProject(project);
  assert.equal(revalidated.input.style, 'cozy');
  assert.match(projectOverview(revalidated), /表现风格：治愈系／cozy（庇护感、日常仪式、低压力）/);
  // 只改风格、不动材料，不应把已确认的路线打回需复核
  const switched = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics', 'none');
  assert.equal(switched.decisions.route.status, 'accepted');
  assert.ok(!/表现指导（风格包预设）/.test(kickoffDraft(switched)));
});

test('像素复古风格包通过含核验的契约校验，缺核验或缺反馈即拒绝', () => {
  const pack = activeStylePack('pixel');
  assert.ok(pack);
  assert.equal(pack.id, 'style.pixel');
  assert.equal(pack.axis, 'style');
  assert.equal(pack.status, 'complete');
  assert.equal(validateContentPack(pack), pack);
  assert.ok(Array.isArray(pack.verification) && pack.verification.length >= 3);
  assert.throws(() => validateContentPack({ ...pack, verification: [] }), /呈现核验/);
  assert.throws(() => validateContentPack({ ...pack, presentation: { ...pack.presentation, feedback: '' } }), /表现指导/);
  // 恰好十键，且不得带胜负字段
  assert.deepEqual(Object.keys(pack).sort(), ['axis', 'boundary', 'id', 'presentation', 'schemaVersion', 'shortTitle', 'status', 'title', 'value', 'verification'].sort());
  for (const forbidden of ['firstChallenge', 'prototype', 'questions', 'review']) assert.equal(pack[forbidden], undefined);
});

test('像素复古风格包只改呈现不改胜负，且文本反馈层如实标注证据不足', () => {
  const pack = activeStylePack('pixel');
  const { visual, text, feedback } = pack.presentation;
  for (const slot of [visual, text, feedback]) {
    assert.ok(typeof slot === 'string' && slot.length > 40);
  }
  // 文本层与研究记录一致：天然薄，必须明说
  assert.match(text, /证据单薄|低证据/);
  // 反馈层证据有限，必须明说且不得冒充来源
  assert.match(feedback, /证据有限|低证据/);
  // 来源之间存在真实分歧，必须原样报告而不是择一粉饰
  assert.match(pack.verification.join(' ') + pack.boundary, /分歧|矛盾/);
  assert.match(pack.boundary, /依据公开检索与卡片库蒸馏/);
  assert.match(pack.boundary, /未运行、未平衡、未试玩/);
  const plan = stylePackPlan('pixel');
  assert.match(plan, /像素复古表现指导（风格包预设）/);
  for (const seg of ['画面：', '文本：', '反馈：', '呈现核验：', '依据边界：']) assert.ok(plan.includes(seg));
});

test('像素复古的验收判据可外部观察，且与相邻风格包划清两刀', () => {
  const pack = activeStylePack('pixel');
  const checks = pack.verification.join(' ');
  // 核心纪律：一种像素尺寸、整数缩放、最近邻、剪影、色数、降本、差异化、成本警戒、复古处理
  assert.match(checks, /像素尺寸一致性核验/);
  assert.match(checks, /缩放与滤波核验/);
  assert.match(checks, /整数取整核验/);
  assert.match(checks, /剪影测试/);
  assert.match(checks, /目标尺寸回看测试/);
  assert.match(checks, /色数与明暗核验/);
  assert.match(checks, /降本路径确认/);
  assert.match(checks, /差异化自述/);
  assert.match(checks, /成本警戒核验/);
  assert.match(checks, /复古处理核验/);
  assert.match(checks, /不能只由设计者自评/);
  // 内核：受限栅格下的可读性纪律，不是方格贴图
  assert.match(pack.presentation.visual, /可读性纪律|一种像素尺寸/);
  // 第一刀：复古 ≠ 像素，必须写明
  assert.match(pack.boundary, /复古不等于像素|复古 ≠ 像素|复古不等于/);
  assert.match(pack.boundary, /可选叠加层/);
  // 第二刀：只管呈现技术纪律，不管题材，可叠加任一题材包
  assert.match(pack.boundary, /可被古风|可被其中任一|不管题材/);
  // 与治愈系不越界（像素可叠加于治愈系，反之亦然）
  assert.match(pack.boundary, /治愈系/);
});

test('像素复古包与古风/二次元包互不串味（只管技术纪律，不抢文化联想）', () => {
  const pixel = activeStylePack('pixel');
  // 像素包不得把文化联想写成自己的纪律
  assert.ok(!/武侠|仙侠|国潮/.test(pixel.presentation.visual));
  assert.ok(!/日式幻想|二次元/.test(pixel.presentation.visual));
  // 像素包必须把「可叠加任一题材」写成边界，而不是自成一个文化题材
  assert.match(pixel.boundary, /可被古风|可被其中任一|不管题材/);
  // 因果可读性（仓库内既有卡片）不得被色数预算吃掉
  assert.match(pixel.presentation.visual, /质感|因果/);
});

test('选定像素复古后草案出现表现指导，且与品类包并存互不覆盖', () => {
  let project = setInput(createProject(), '想做一款受限色数的小样', ['mechanic'], '', 'tactics', 'pixel');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const draft = kickoffDraft(project);
  assert.match(draft, /战棋首局施工骨架/);
  assert.match(draft, /像素复古表现指导（风格包预设）/);
  assert.match(draft, /像素尺寸一致性核验/);
  // 表现风格不得挤掉品类包的胜负判断
  assert.match(draft, /战棋首局施工骨架[\s\S]*像素复古表现指导/);
});

test('像素复古风格栏非法值被拒绝，旧记录回写保留风格', () => {
  let project = setInput(createProject(), '想做受限色数的小样', ['mechanic'], '', 'tactics', 'pixel');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const revalidated = validateProject(project);
  assert.equal(revalidated.input.style, 'pixel');
  assert.match(projectOverview(revalidated), /表现风格：像素／复古（呈现技术纪律、可叠加任一题材）/);
  // 只改风格、不动材料，不应把已确认的路线打回需复核
  const switched = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics', 'none');
  assert.equal(switched.decisions.route.status, 'accepted');
  assert.ok(!/表现指导（风格包预设）/.test(kickoffDraft(switched)));
});

test('恐怖氛围风格包通过含核验的契约校验，缺核验或缺反馈即拒绝', () => {
  const pack = activeStylePack('horror');
  assert.ok(pack);
  assert.equal(pack.id, 'style.horror');
  assert.equal(pack.axis, 'style');
  assert.equal(pack.status, 'complete');
  assert.equal(validateContentPack(pack), pack);
  assert.ok(Array.isArray(pack.verification) && pack.verification.length >= 3);
  assert.throws(() => validateContentPack({ ...pack, verification: [] }), /呈现核验/);
  assert.throws(() => validateContentPack({ ...pack, presentation: { ...pack.presentation, feedback: '' } }), /表现指导/);
  // 恰好十键，且不得带胜负字段
  assert.deepEqual(Object.keys(pack).sort(), ['axis', 'boundary', 'id', 'presentation', 'schemaVersion', 'shortTitle', 'status', 'title', 'value', 'verification'].sort());
  for (const forbidden of ['firstChallenge', 'prototype', 'questions', 'review']) assert.equal(pack[forbidden], undefined);
});

test('恐怖氛围风格包只改呈现不改胜负，且文本反馈层如实标注证据强度', () => {
  const pack = activeStylePack('horror');
  const { visual, text, feedback } = pack.presentation;
  for (const slot of [visual, text, feedback]) {
    assert.ok(typeof slot === 'string' && slot.length > 40);
  }
  // 文本层与研究记录一致：氛围包、天生不是主干，必须明说
  assert.match(text, /证据有限|低证据/);
  // 反馈层反而证据充分（三条硬规则来自一手演讲），不得标成单薄
  assert.match(feedback, /证据充分/);
  assert.match(feedback, /静音/);
  // 三处来源分歧必须原样报告而不是择一粉饰
  assert.match(pack.verification.join(' ') + pack.boundary, /分歧|矛盾/);
  assert.match(pack.boundary, /依据公开检索与卡片库蒸馏/);
  assert.match(pack.boundary, /未运行、未平衡、未试玩/);
  const plan = stylePackPlan('horror');
  assert.match(plan, /恐怖氛围表现指导（风格包预设）/);
  for (const seg of ['画面：', '文本：', '反馈：', '呈现核验：', '依据边界：']) assert.ok(plan.includes(seg));
});

test('恐怖氛围的验收判据可外部观察，且与治愈系划清 creepy-cozy 归属', () => {
  const pack = activeStylePack('horror');
  const checks = pack.verification.join(' ');
  // 核心纪律：十比一走廊、预期而非跳吓、权力回收、纯黑、静音、安全区、假阳性、过场降级、事后记忆
  assert.match(checks, /十比一走廊检验/);
  assert.match(checks, /跳吓之外有交代检验/);
  assert.match(checks, /权力回收检验/);
  assert.match(checks, /纯黑检验/);
  assert.match(checks, /静音检验/);
  assert.match(checks, /安全区检验/);
  assert.match(checks, /假阳性检验/);
  assert.match(checks, /过场降级检验/);
  assert.match(checks, /事后记忆检验/);
  assert.match(checks, /不能只由设计者自评/);
  // 内核：预期而非跳吓，不是加怪物加血加跳吓
  assert.match(pack.presentation.visual, /预期/);
  assert.match(pack.presentation.visual, /收据|兑现/);
  // 权力是恐惧的敌人
  assert.match(pack.presentation.visual, /权力是恐惧的敌人|胜算|不可战胜|没有胜算/);
  // 第一刀：只管呈现与氛围，不管玩法规则
  assert.match(pack.boundary, /不管玩法规则|不定义胜负与回合规则/);
  // 第二刀：creepy-cozy 归属治愈系为主包，本包作叠加层
  assert.match(pack.boundary, /creepy-cozy|治愈系/);
  assert.match(pack.boundary, /叠加层|主包/);
  // 不声称 creepy-cozy 归自己
  assert.match(pack.boundary, /不声称/);
});

test('恐怖氛围包与治愈系包互不串味（情绪主干相反，不得互相包含）', () => {
  const horror = activeStylePack('horror');
  const cozy = activeStylePack('cozy');
  // 恐怖包不得把「庇护感/治愈」写进自己的内核
  assert.ok(!/庇护感如何成立|日常仪式/.test(horror.presentation.visual));
  // 恐怖包必须把「全黑是挫败不是恐惧」写成纪律，而不是越黑越好
  assert.match(horror.presentation.visual, /全黑|挫败/);
  // 恐怖包必须把「安全区要真的安全」写成纪律，而不是安全区必然不安全
  assert.match(horror.presentation.visual, /安全区|真的安全|松一口气/);
  // 治愈系一侧仍保留「把不适挡在外面」的纪律，两包不越界
  assert.match(cozy.presentation.visual, /看得见但进不来|挡在外面|安全地/);
  // 两包的边界都必须点明 creepy-cozy 归属判据
  assert.match(horror.boundary, /creepy-cozy/);
  assert.match(cozy.boundary, /恐怖氛围/);
});

test('选定恐怖氛围后草案出现表现指导，且与品类包并存互不覆盖', () => {
  let project = setInput(createProject(), '想做一款靠预期而非跳吓的短局', ['mechanic'], '', 'tactics', 'horror');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const draft = kickoffDraft(project);
  assert.match(draft, /战棋首局施工骨架/);
  assert.match(draft, /恐怖氛围表现指导（风格包预设）/);
  assert.match(draft, /十比一走廊检验/);
  assert.match(draft, /静音检验/);
  // 表现风格不得挤掉品类包的胜负判断
  assert.match(draft, /战棋首局施工骨架[\s\S]*恐怖氛围表现指导/);
});

test('恐怖氛围风格栏非法值被拒绝，旧记录回写保留风格', () => {
  let project = setInput(createProject(), '想做一款靠预期而非跳吓的短局', ['mechanic'], '', 'tactics', 'horror');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const revalidated = validateProject(project);
  assert.equal(revalidated.input.style, 'horror');
  assert.match(projectOverview(revalidated), /表现风格：恐怖氛围（只管呈现与不安，不管玩法规则）/);
  // 只改风格、不动材料，不应把已确认的路线打回需复核
  const switched = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics', 'none');
  assert.equal(switched.decisions.route.status, 'accepted');
  assert.ok(!/表现指导（风格包预设）/.test(kickoffDraft(switched)));
});

test('硬科幻风格包通过含核验的契约校验，缺核验或缺反馈即拒绝', () => {
  const pack = activeStylePack('hard-scifi');
  assert.ok(pack);
  assert.equal(pack.id, 'style.hard-scifi');
  assert.equal(pack.axis, 'style');
  assert.equal(pack.status, 'complete');
  assert.equal(validateContentPack(pack), pack);
  assert.ok(Array.isArray(pack.verification) && pack.verification.length >= 3);
  assert.throws(() => validateContentPack({ ...pack, verification: [] }), /呈现核验/);
  assert.throws(() => validateContentPack({ ...pack, presentation: { ...pack.presentation, feedback: '' } }), /表现指导/);
  // 恰好十键，且不得带胜负字段
  assert.deepEqual(Object.keys(pack).sort(), ['axis', 'boundary', 'id', 'presentation', 'schemaVersion', 'shortTitle', 'status', 'title', 'value', 'verification'].sort());
  for (const forbidden of ['firstChallenge', 'prototype', 'questions', 'review']) assert.equal(pack[forbidden], undefined);
});

test('硬科幻风格包只改呈现不改胜负，且三层如实标注证据强度', () => {
  const pack = activeStylePack('hard-scifi');
  const { visual, text, feedback } = pack.presentation;
  for (const slot of [visual, text, feedback]) {
    assert.ok(typeof slot === 'string' && slot.length > 40);
  }
  // 主人拍板「照做但显式标单薄」：三层均为方向，不得冒充已验证结论
  assert.match(pack.boundary, /显单薄|单薄/);
  assert.match(text, /证据单薄|低证据/);
  assert.match(feedback, /证据单薄|低证据/);
  // 三处来源分歧必须原样报告而不是择一粉饰
  assert.match(pack.verification.join(' ') + pack.boundary, /分歧|矛盾/);
  assert.match(pack.boundary, /依据公开检索与卡片库蒸馏/);
  assert.match(pack.boundary, /未运行、未平衡、未试玩/);
  const plan = stylePackPlan('hard-scifi');
  assert.match(plan, /硬科幻表现指导（风格包预设）/);
  for (const seg of ['画面：', '文本：', '反馈：', '呈现核验：', '依据边界：']) assert.ok(plan.includes(seg));
});

test('硬科幻的验收判据可外部观察，且与相邻技术底座风格划界', () => {
  const pack = activeStylePack('hard-scifi');
  const checks = pack.verification.join(' ');
  // 核心纪律：可外推、功能可读、反无菌、尺度被设计、真空声音通道、界面功能优先、字号归类、可见性、让步清单、资源投放
  assert.match(checks, /可外推检验/);
  assert.match(checks, /功能可读检验/);
  assert.match(checks, /有人住过检验/);
  assert.match(checks, /尺度是否被设计检验/);
  assert.match(checks, /真空声音通道检验/);
  assert.match(checks, /界面功能优先检验/);
  assert.match(checks, /字号与归类检验/);
  assert.match(checks, /可见性偿还检验/);
  assert.match(checks, /让步清单检验/);
  assert.match(checks, /资源投放检验/);
  assert.match(checks, /不能只由设计者自评/);
  // 内核：从当下技术可外推，不是造型更未来
  assert.match(pack.presentation.visual, /从当下技术可外推|画一条线/);
  // 功能主义不等于无菌（一手原话给出的反面纪律）
  assert.match(pack.presentation.visual, /无菌|有人住过/);
  // 尺度必须被设计，大而空是第一失败模式
  assert.match(pack.presentation.visual, /大而空|尺度/);
  // 与蒸汽朋克／赛博朋克在材质与年代上划界
  assert.match(pack.boundary, /蒸汽朋克/);
  assert.match(pack.boundary, /赛博朋克/);
  assert.match(pack.boundary, /真空、金属、仪表/);
  // 与太空歌剧／软科幻划界
  assert.match(pack.boundary, /太空歌剧|软科幻/);
  // 不裁定模拟深度，但要求让步显式
  assert.match(pack.boundary, /不裁定|模拟深度/);
});

test('硬科幻包与恐怖氛围包互不串味，且不判定硬科幻是否好玩', () => {
  const scifi = activeStylePack('hard-scifi');
  const horror = activeStylePack('horror');
  // 硬科幻不得把「不安／恐惧」写进自己的内核
  assert.ok(!/恐惧|吓人|跳吓/.test(scifi.presentation.visual));
  // 硬科幻必须把「可外推」写成判据，而不是「越写实越好」
  assert.match(scifi.presentation.visual, /可外推|可读/);
  // 硬科幻必须要求让步显式，而不是假装全做对了
  assert.match(scifi.presentation.feedback + scifi.boundary, /让步/);
  // 恐怖包一侧仍保留「留白要留在看不清是什么」的纪律，两包不越界
  assert.match(horror.presentation.visual, /留白|看不清/);
  // 两包可叠加，且叠加时职责要分清（本包管技术可信、恐怖包管不安）
  assert.match(scifi.boundary, /恐怖氛围/);
});

test('选定硬科幻后草案出现表现指导，且与品类包并存互不覆盖', () => {
  let project = setInput(createProject(), '想做一款从当下技术可外推的短局', ['mechanic'], '', 'tactics', 'hard-scifi');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const draft = kickoffDraft(project);
  assert.match(draft, /战棋首局施工骨架/);
  assert.match(draft, /硬科幻表现指导（风格包预设）/);
  assert.match(draft, /可外推检验/);
  assert.match(draft, /真空声音通道检验/);
  // 表现风格不得挤掉品类包的胜负判断
  assert.match(draft, /战棋首局施工骨架[\s\S]*硬科幻表现指导/);
});

test('硬科幻风格栏非法值被拒绝，旧记录回写保留风格', () => {
  let project = setInput(createProject(), '想做一款从当下技术可外推的短局', ['mechanic'], '', 'tactics', 'hard-scifi');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const revalidated = validateProject(project);
  assert.equal(revalidated.input.style, 'hard-scifi');
  assert.match(projectOverview(revalidated), /表现风格：硬科幻／太空（只管呈现与技术可信，不管玩法规则）/);
  // 只改风格、不动材料，不应把已确认的路线打回需复核
  const switched = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics', 'none');
  assert.equal(switched.decisions.route.status, 'accepted');
  assert.ok(!/表现指导（风格包预设）/.test(kickoffDraft(switched)));
});

test('蒸汽朋克风格包通过含核验的契约校验，缺核验即拒绝', () => {
  const pack = activeStylePack('steampunk');
  assert.ok(pack);
  assert.equal(pack.id, 'style.steampunk');
  assert.equal(pack.axis, 'style');
  assert.equal(pack.status, 'complete');
  assert.equal(validateContentPack(pack), pack);
  assert.ok(Array.isArray(pack.verification) && pack.verification.length >= 3);
  assert.throws(() => validateContentPack({ ...pack, verification: [] }), /呈现核验/);
  assert.throws(() => validateContentPack({ ...pack, presentation: { ...pack.presentation, feedback: '' } }), /表现指导/);
});

test('蒸汽朋克风格包只改呈现不改胜负，且反馈层如实标注低证据', () => {
  const pack = activeStylePack('steampunk');
  const { visual, text, feedback } = pack.presentation;
  for (const slot of [visual, text, feedback]) assert.ok(typeof slot === 'string' && slot.length > 40);
  for (const forbidden of ['firstChallenge', 'prototype', 'questions']) assert.equal(pack[forbidden], undefined);
  // 反馈层证据薄，必须明说，不得冒充来源
  assert.match(feedback, /证据单薄|低证据/);
  // 来源之间存在真实矛盾，必须原样报告而不是择一粉饰
  assert.match(feedback, /矛盾|分歧|相反答案/);
  assert.match(pack.boundary, /依据公开检索与卡片库蒸馏/);
  assert.match(pack.boundary, /未运行、未平衡、未试玩/);
  const plan = stylePackPlan('steampunk');
  assert.match(plan, /蒸汽朋克表现指导（风格包预设）/);
  for (const seg of ['画面：', '文本：', '反馈：', '呈现核验：', '依据边界：']) assert.ok(plan.includes(seg));
});

test('蒸汽朋克的验收判据可外部观察，且与技术底座相邻包划界', () => {
  const pack = activeStylePack('steampunk');
  const checks = pack.verification.join(' ');
  // 齿轮啮合 / 机械可读 / 强调色 / 整体性 / 阶层可读 / 死控件 / 密度落点 / 回读
  assert.match(checks, /齿轮啮合测试/);
  assert.match(checks, /机械可读性测试/);
  assert.match(checks, /强调色测试/);
  assert.match(checks, /整体性测试/);
  assert.match(checks, /社会阶层可读性测试/);
  assert.match(checks, /死控件排查/);
  assert.match(checks, /密度落点测试/);
  assert.match(checks, /不能只由设计者自评/);
  // 与赛博朋克的技术底座划界必须写明
  assert.match(pack.boundary, /赛博朋克/);
  assert.match(pack.boundary, /数字／网络／义体归赛博朋克/);
  // 核心判据：可见的机械，且装饰齿轮是被点名的塌法
  assert.match(pack.presentation.visual, /看得见的机械|懒人蒸汽朋克/);
  // 柴油朋克是同包内时代分叉，且证据强度低于主干
  assert.match(pack.presentation.visual, /柴油朋克/);
  assert.match(pack.presentation.visual, /证据强度低于主干|证据强度显著少于/);
  // 「一切皆棕」这条最典型塌法必须写明
  assert.match(pack.presentation.visual, /一切皆棕/);
});

test('选定蒸汽朋克后草案出现表现指导，且与品类包并存互不覆盖', () => {
  let project = setInput(createProject(), '想做一款维多利亚机械题材的短局游戏', ['mechanic'], '', 'tactics', 'steampunk');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const draft = kickoffDraft(project);
  assert.match(draft, /战棋首局施工骨架/);
  assert.match(draft, /蒸汽朋克表现指导（风格包预设）/);
  assert.match(draft, /齿轮/);
  // 表现风格不得挤掉品类包的胜负判断
  assert.match(draft, /战棋首局施工骨架[\s\S]*蒸汽朋克表现指导/);
});

test('蒸汽朋克风格栏非法值被拒绝，旧记录回写保留风格', () => {
  let project = setInput(createProject(), '想做维多利亚机械短局', ['mechanic'], '', 'tactics', 'steampunk');
  project = choose(project, 'route', 'short');
  project = choose(project, 'focus', 'first_turn');
  const revalidated = validateProject(project);
  assert.equal(revalidated.input.style, 'steampunk');
  assert.match(projectOverview(revalidated), /表现风格：蒸汽朋克与柴油朋克（维多利亚机械、两战之间）/);
  // 只改风格、不动材料，不应把已确认的路线打回需复核
  const switched = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics', 'none');
  assert.equal(switched.decisions.route.status, 'accepted');
  assert.ok(!/表现指导（风格包预设）/.test(kickoffDraft(switched)));
});

test('品类推断只有一份实现，两处口径一致且过宽词不误判', async () => {
  const { inferGenreFromIdea, CONTENT_PACKS: packs } = await import('../nest/content-packs.mjs');
  const { GENRE_OPTIONS, STYLE_OPTIONS } = await import('../nest/workbench-core.mjs');
  for (const [idea, genre] of [['想做战棋', 'tactics'], ['想做牌局推理', 'gambling'], ['想做爬塔构筑', 'rogue'],
    ['想做银河恶魔城', 'metroidvania'], ['想做视觉小说', 'visual-novel'], ['想做解谜游戏', 'puzzle'], ['想做餐厅经营', 'management']]) {
    assert.equal(inferGenreFromIdea(idea), genre);
    assert.equal(intakeProfile(setInput(createProject(), idea, ['mechanic'])).genre, genre);
  }
  assert.equal(inferGenreFromIdea('想做一个有很多选项的游戏'), 'unspecified');
  assert.equal(intakeProfile(setInput(createProject(), '想做一个有很多选项的游戏', ['mechanic'])).genre, 'unspecified');
  for (const pack of packs.filter(item => item.axis === 'genre' && item.status === 'complete')) {
    assert.ok(GENRE_OPTIONS.some(option => option.id === pack.value), `GENRE_OPTIONS 缺 ${pack.value}`);
  }
  for (const pack of packs.filter(item => item.axis === 'style' && item.status === 'complete')) {
    assert.ok(STYLE_OPTIONS.some(option => option.id === pack.value), `STYLE_OPTIONS 缺 ${pack.value}`);
  }
});

test('派对包接入两条工程路径，推荐随原话与已选目标变化', () => {
  const bare = startGenre([], '想做和朋友一起玩的派对游戏', 'party');
  const existing = startGenre(['existing'], '想做和朋友一起玩的派对游戏', 'party');
  assert.deepEqual(questionnaireView(bare).map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  for (const id of ['party_group', 'party_joy', 'party_device', 'party_length']) {
    assert.ok(questionnaireView(bare, { deep: true }).some(item => item.id === id));
  }
  let project = startGenre([], '想做谁是卧底那样的诈唬派对游戏', 'party');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'sus');
  assert.match(questionnaireView(project)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'sus');
  const deep = questionnaireView(project, { deep: true });
  assert.equal(deep.find(item => item.id === 'party_joy').recommendation.value, 'bluff');
  assert.equal(deep.find(item => item.id === 'party_device').recommendation.value, 'phones');
  const draft = kickoffDraft(project);
  assert.match(draft, /派对首局施工骨架/);
  assert.match(draft, /私密信息/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /派对内容包/);
  assert.equal(intakeProfile(setInput(createProject(), '想做派对游戏', ['mechanic'])).genre, 'party');
});

test('恐怖包接入，推荐随原话与已选目标变化，与风格包不串味', () => {
  let project = startGenre([], '想做便利店夜班的恐怖游戏', 'horror');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'shift');
  assert.match(questionnaireView(project)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'shift');
  const deep = questionnaireView(project, { deep: true });
  for (const id of ['horror_lever', 'horror_power', 'horror_death', 'horror_safe']) {
    assert.ok(deep.some(item => item.id === id));
  }
  assert.equal(deep.find(item => item.id === 'horror_lever').recommendation.value, 'creep');
  assert.equal(deep.find(item => item.id === 'horror_death').recommendation.value, 'wake');
  const draft = kickoffDraft(project);
  assert.match(draft, /恐怖首局施工骨架/);
  assert.match(draft, /便利店值班/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /恐怖内容包/);
  assert.equal(intakeProfile(setInput(createProject(), '想做恐怖游戏', ['mechanic'])).genre, 'horror');
  const styled = setInput(createProject(), '想做恐怖游戏', ['mechanic'], '', 'horror');
  assert.equal(validateProject({ ...styled, input: { ...styled.input, style: 'horror' } }).input.style, 'horror');
});

test('塔防包接入，推荐随原话与已选目标变化', () => {
  let project = startGenre([], '想做塔防游戏', 'towerdefense');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'hold');
  project = answerQuestion(project, 'first_challenge', 'focus');
  const deep = questionnaireView(project, { deep: true });
  for (const id of ['td_path', 'td_depth', 'td_block', 'td_econ']) {
    assert.ok(deep.some(item => item.id === id));
  }
  assert.equal(deep.find(item => item.id === 'td_path').recommendation.value, 'fixed');
  assert.equal(deep.find(item => item.id === 'td_depth').recommendation.value, 'few');
  const draft = kickoffDraft(project);
  assert.match(draft, /塔防首局施工骨架/);
  assert.match(draft, /发卡弯/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /塔防内容包/);
  assert.match(reviewSnapshot(project).advisories[0].title, /漏怪永远可归因/);
  assert.equal(intakeProfile(setInput(createProject(), '想做塔防游戏', ['mechanic'])).genre, 'towerdefense');
  const existing = startGenre(['existing'], '想做塔防游戏', 'towerdefense');
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
});

test('生存建造包按品类进入，两种工程条件都给相同生存判断', () => {
  const bare = startGenre([], '想做一个要撑过第一波袭击的生存游戏', 'survival');
  const existing = startGenre(['existing'], '想做一个要撑过第一波袭击的生存游戏', 'survival');
  assert.deepEqual(questionnaireView(bare).map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  for (const id of ['sv_pressure', 'sv_first_night', 'sv_scarcity', 'sv_scope']) {
    assert.ok(questionnaireView(bare, { deep: true }).some(item => item.id === id));
    assert.ok(questionnaireView(existing, { deep: true }).some(item => item.id === id));
  }
  assert.equal(intakeProfile(bare).genre, 'survival');
  assert.equal(intakeProfile(existing).genre, 'survival');
  assert.equal(activeGenrePack('survival')?.id, 'genre.survival');
});

test('生存建造包首局目标推荐标注待确认，已选目标引导压力与稀缺', () => {
  let project = startGenre([], '想做一个要撑过第一波袭击的生存游戏', 'survival');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'hold_wave');
  assert.match(questionnaireView(project)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'hold_wave');
  const deep = questionnaireView(project, { deep: true });
  assert.equal(deep.find(item => item.id === 'sv_pressure').recommendation.value, 'single');
  assert.equal(deep.find(item => item.id === 'sv_first_night').recommendation.value, 'sandbag');
  assert.equal(deep.find(item => item.id === 'sv_scarcity').recommendation.value, 'time');
  assert.equal(deep.find(item => item.id === 'sv_scope').recommendation.value, 'small_dense');
  assert.match(deep.find(item => item.id === 'sv_pressure').recommendation.source, /已确认的首局目标＋生存建造内容包/);
  project = usePresetRecommendation(project, 'sv_pressure');
  assert.equal(project.designDecisions.find(item => item.topic === '压力系统数量').status, 'provisional');
  const draft = kickoffDraft(project);
  assert.match(draft, /生存建造首局施工骨架/);
  assert.match(draft, /制作链首轮闭环/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /生存建造内容包/);
});

test('生存建造包默认推荐可追踪来源，未确认时不冒充已确认', () => {
  let project = startGenre([], '想做一个生存建造游戏', 'survival');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'survive_night');
  assert.equal(questionnaireView(project)[0].recommendation.source, '生存建造内容包预设');
  for (const id of ['sv_pressure', 'sv_first_night', 'sv_scarcity']) {
    assert.equal(questionnaireView(project, { deep: true }).find(item => item.id === id).recommendation.source, '生存建造内容包预设');
  }
  project = answerQuestion(project, 'first_challenge', 'survive_night');
  assert.match(questionnaireView(project, { deep: true }).find(item => item.id === 'sv_scarcity').recommendation.source, /已确认的首局目标＋生存建造内容包/);
});

test('切换出生存品类后旧生存决定留痕并需复核', () => {
  let project = startGenre([], '想做一个生存建造游戏', 'survival');
  project = answerQuestion(project, 'first_challenge', 'survive_night');
  project = answerQuestion(project, 'sv_pressure', 'two');
  project = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics');
  assert.ok(!questionnaireView(project, { deep: true }).some(item => item.id === 'sv_pressure'));
  assert.match(kickoffDraft(project), /需复核的旧决定[\s\S]*压力系统数量/);
});

test('生存建造包结构硬规则：首轮闭环、压力可控、死亡可归因', () => {
  const pack = activeGenrePack('survival');
  assert.equal(validateContentPack(pack), pack);
  const acceptance = pack.prototype.acceptance.join('；');
  assert.match(acceptance, /制作链首轮闭环/);
  assert.match(acceptance, /致死.*1–2 个|压力系统控制在 1–2 个/);
  assert.match(acceptance, /不依赖外部教程/);
  assert.match(acceptance, /死因/);
  assert.match(pack.prototype.defer.join('；'), /多人同步与联机/);
  assert.match(pack.prototype.defer.join('；'), /程序化生成的大地图/);
  assert.match(pack.boundary, /资源压力＋失败代价/);
  assert.match(pack.boundary, /经营包/);
  for (const option of pack.firstChallenge.options) assert.ok(pack.prototype.missions[option.value]);
});

test('广义模拟包按品类进入，两种工程条件都给相同作业判断', () => {
  const bare = startGenre([], '想做一个小偷模拟器', 'simulation');
  const existing = startGenre(['existing'], '想做一个小偷模拟器', 'simulation');
  assert.deepEqual(questionnaireView(bare).map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  for (const id of ['sm_job_loop', 'sm_progress', 'sm_penalty', 'sm_variety']) {
    assert.ok(questionnaireView(bare, { deep: true }).some(item => item.id === id));
    assert.ok(questionnaireView(existing, { deep: true }).some(item => item.id === id));
  }
  assert.equal(intakeProfile(bare).genre, 'simulation');
  assert.equal(intakeProfile(existing).genre, 'simulation');
  assert.equal(activeGenrePack('simulation')?.id, 'genre.simulation');
});

test('广义模拟包首局目标推荐标注待确认，已选目标引导骨架与联动', () => {
  let project = startGenre([], '想做一个小偷模拟器', 'simulation');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'steal_job');
  assert.match(questionnaireView(project)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'steal_job');
  const deep = questionnaireView(project, { deep: true });
  assert.equal(deep.find(item => item.id === 'sm_job_loop').recommendation.value, 'full');
  assert.equal(deep.find(item => item.id === 'sm_progress').recommendation.value, 'tool');
  assert.equal(deep.find(item => item.id === 'sm_variety').recommendation.value, 'unique');
  const penalty = deep.find(item => item.id === 'sm_penalty');
  assert.equal(penalty.recommendation.value, 'none');
  assert.match(penalty.recommendation.source, /供讨论|单作品样本/);
  let flipper = startGenre([], '想做个翻修房子的模拟游戏', 'simulation');
  assert.equal(questionnaireView(flipper)[0].recommendation.value, 'flip_room');
  flipper = answerQuestion(flipper, 'first_challenge', 'flip_room');
  const flipDeep = questionnaireView(flipper, { deep: true });
  assert.equal(flipDeep.find(item => item.id === 'sm_progress').recommendation.value, 'skill');
  assert.equal(flipDeep.find(item => item.id === 'sm_variety').recommendation.value, 'minigame');
  project = usePresetRecommendation(project, 'sm_job_loop');
  assert.equal(project.designDecisions.find(item => item.topic === '首单骨架').status, 'provisional');
  const draft = kickoffDraft(project);
  assert.match(draft, /模拟器首局施工骨架/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /模拟器内容包的首局验收预设|广义模拟内容包/);
});

test('广义模拟包默认推荐可追踪来源，运输线索分流到待确认', () => {
  let project = startGenre([], '想做一个模拟器游戏', 'simulation');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'clean_job');
  assert.equal(questionnaireView(project)[0].recommendation.source, '广义模拟内容包预设');
  for (const id of ['sm_job_loop', 'sm_progress', 'sm_variety']) {
    assert.equal(questionnaireView(project, { deep: true }).find(item => item.id === id).recommendation.source, '广义模拟内容包预设');
  }
  assert.match(questionnaireView(project, { deep: true }).find(item => item.id === 'sm_penalty').recommendation.source, /广义模拟内容包预设/);
  const truck = startGenre([], '想做个卡车运输模拟', 'simulation');
  const rec = questionnaireView(truck)[0].recommendation;
  assert.equal(rec.value, 'flip_room');
  assert.match(rec.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'clean_job');
  assert.match(questionnaireView(project, { deep: true }).find(item => item.id === 'sm_job_loop').recommendation.source, /已确认的首局目标＋广义模拟内容包/);
});

test('切换出模拟品类后旧作业决定留痕并需复核', () => {
  let project = startGenre([], '想做一个模拟器游戏', 'simulation');
  project = answerQuestion(project, 'first_challenge', 'clean_job');
  project = answerQuestion(project, 'sm_job_loop', 'quick');
  project = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics');
  assert.ok(!questionnaireView(project, { deep: true }).some(item => item.id === 'sm_job_loop'));
  assert.match(kickoffDraft(project), /需复核的旧决定[\s\S]*首单骨架/);
});

test('广义模拟包结构硬规则：四步闭环、命名定位、完成度可见', () => {
  const pack = activeGenrePack('simulation');
  assert.equal(validateContentPack(pack), pack);
  const acceptance = pack.prototype.acceptance.join('；');
  assert.match(acceptance, /接单→执行→验收→结算/);
  assert.match(acceptance, /地理线索/);
  assert.match(acceptance, /完成度始终可见/);
  assert.match(acceptance, /无教程也能独立做完第一单/);
  assert.match(pack.prototype.defer.join('；'), /载具类作业/);
  assert.match(pack.prototype.defer.join('；'), /失败惩罚机制/);
  assert.match(pack.boundary, /经营包/);
  for (const option of pack.firstChallenge.options) assert.ok(pack.prototype.missions[option.value]);
});

test('增量挂机包按品类进入，两种工程条件都给相同放置判断', () => {
  const bare = startGenre([], '想做一个挂机放置游戏', 'idle');
  const existing = startGenre(['existing'], '想做一个挂机放置游戏', 'idle');
  assert.deepEqual(questionnaireView(bare).map(item => item.id), ['first_challenge', 'test_question']);
  assert.deepEqual(questionnaireView(existing).map(item => item.id), ['first_challenge', 'reuse_boundary']);
  for (const id of ['idl_pace', 'idl_wait', 'idl_prestige', 'idl_offline']) {
    assert.ok(questionnaireView(bare, { deep: true }).some(item => item.id === id));
    assert.ok(questionnaireView(existing, { deep: true }).some(item => item.id === id));
  }
  assert.equal(intakeProfile(bare).genre, 'idle');
  assert.equal(activeGenrePack('idle')?.id, 'genre.idle');
});

test('增量挂机包首局目标推荐标注待确认，已选目标引导重置规则与离线', () => {
  let project = startGenre([], '想做一个挂机放置游戏，重点是冲到第一次重置转生', 'idle');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'first_reset');
  assert.match(questionnaireView(project)[0].recommendation.source, /待确认/);
  project = answerQuestion(project, 'first_challenge', 'first_reset');
  const deep = questionnaireView(project, { deep: true });
  assert.equal(deep.find(item => item.id === 'idl_pace').recommendation.value, 'frequent');
  assert.equal(deep.find(item => item.id === 'idl_wait').recommendation.value, 'decision');
  assert.equal(deep.find(item => item.id === 'idl_prestige').recommendation.value, 'taught');
  const offline = deep.find(item => item.id === 'idl_offline');
  assert.equal(offline.recommendation.value, 'capped');
  assert.match(offline.recommendation.source, /低证据|供讨论/);
  project = usePresetRecommendation(project, 'idl_pace');
  assert.equal(project.designDecisions.find(item => item.topic === '首个爆点节奏').status, 'provisional');
  const draft = kickoffDraft(project);
  assert.match(draft, /增量挂机首局施工骨架/);
  assert.ok(!/暂无完整内容包/.test(draft));
  assert.match(reviewSnapshot(project).advisories[0].source, /增量挂机内容包/);
});

test('增量挂机包默认推荐可追踪来源，未确认时不冒充已确认', () => {
  let project = startGenre([], '想做一个挂机放置游戏', 'idle');
  assert.equal(questionnaireView(project)[0].recommendation.value, 'click_to_auto');
  assert.equal(questionnaireView(project)[0].recommendation.source, '增量挂机内容包预设');
  for (const id of ['idl_pace', 'idl_wait', 'idl_prestige']) {
    assert.equal(questionnaireView(project, { deep: true }).find(item => item.id === id).recommendation.source, '增量挂机内容包预设');
  }
  assert.match(questionnaireView(project, { deep: true }).find(item => item.id === 'idl_offline').recommendation.source, /增量挂机内容包预设/);
  project = answerQuestion(project, 'first_challenge', 'click_to_auto');
  assert.match(questionnaireView(project, { deep: true }).find(item => item.id === 'idl_prestige').recommendation.source, /已确认的首局目标＋增量挂机内容包/);
});

test('切换出增量挂机品类后旧放置决定留痕并需复核', () => {
  let project = startGenre([], '想做一个挂机放置游戏', 'idle');
  project = answerQuestion(project, 'first_challenge', 'click_to_auto');
  project = answerQuestion(project, 'idl_wait', 'parallel');
  project = setInput(project, project.input.idea, project.input.entries, project.input.constraints, 'tactics');
  assert.ok(!questionnaireView(project, { deep: true }).some(item => item.id === 'idl_wait'));
  assert.match(kickoffDraft(project), /需复核的旧决定[\s\S]*等待上限/);
});

test('增量挂机包结构硬规则：曲线可模拟、等待上限、重置可读、离线比值', () => {
  const pack = activeGenrePack('idle');
  assert.equal(validateContentPack(pack), pack);
  const acceptance = pack.prototype.acceptance.join('；');
  assert.match(acceptance, /曲线可脚本预演/);
  assert.match(acceptance, /重置落在可承诺|重置.*可承诺/);
  assert.match(acceptance, /明确比值或硬上限/);
  assert.match(acceptance, /触发即判负/);
  assert.match(acceptance, /无决策的长等待段/);
  assert.match(pack.prototype.defer.join('；'), /多人\/排行榜经济/);
  assert.match(pack.prototype.defer.join('；'), /把离线收益做成主玩法/);
  assert.match(pack.boundary, /mgmt_pacing/);
  assert.match(pack.boundary, /经营包/);
  for (const option of pack.firstChallenge.options) assert.ok(pack.prototype.missions[option.value]);
});

test('studio.mjs 的 genreNames 与 GENRE_OPTIONS 保持同步（缺包会显示 undefined）', async () => {
  const { readFileSync } = await import('node:fs');
  const studio = readFileSync(new URL('../nest/studio.mjs', import.meta.url), 'utf8');
  // genreNames 现在直接从 GENRE_OPTIONS 派生（单一来源），不再手工维护字面量表；
  // 此断言防止有人改回手工副本而漏同步。
  assert.match(studio, /const genreNames = Object\.fromEntries\(GENRE_OPTIONS\.map\(option => \[option\.id, option\.label\]\)\)/,
    'genreNames 必须由 GENRE_OPTIONS 派生');
  assert.match(studio, /GENRE_OPTIONS, createProject/, 'studio.mjs 必须导入 GENRE_OPTIONS');
});

test('品类推断不抢包：挖矿挂机归 idle、狩猎模拟器归 simulation', async () => {
  const { inferGenreFromIdea } = await import('../nest/content-packs.mjs');
  assert.equal(inferGenreFromIdea('挖矿题材的挂机游戏'), 'idle');
  assert.equal(inferGenreFromIdea('狩猎模拟器'), 'simulation');
  assert.equal(inferGenreFromIdea('想在荒岛上求生'), 'survival');
});

test('引擎包：格式有效，工程条件驱动核验清单进入草案', async () => {
  const { CONTENT_PACKS: packs, validateContentPack, activeEnginePack } = await import('../nest/content-packs.mjs');
  for (const id of ['engine.unity-mono', 'engine.unity-il2cpp', 'engine.renpy']) {
    const pack = packs.find(item => item.id === id);
    assert.ok(pack, `缺 ${id}`);
    assert.equal(validateContentPack(pack), pack);
  }
  assert.equal(activeEnginePack('有一个 Unity 5.6 的旧工程')?.value, 'unity-mono');
  assert.equal(activeEnginePack('Unity 2021 IL2CPP 工程')?.value, 'unity-il2cpp');
  assert.equal(activeEnginePack("已有 Ren'Py 工程")?.value, 'renpy');
  assert.equal(activeEnginePack(''), null);
  assert.equal(activeEnginePack('没有引擎条件'), null);
  let project = setInput(createProject(), '沿用旧工程做一款全新的战棋游戏', ['existing'], '有一个 Unity 5.6 的旧工程', 'tactics');
  project = choose(project, 'route', 'new_game');
  project = choose(project, 'focus', 'loop');
  const draft = kickoffDraft(project);
  assert.match(draft, /引擎核验清单/);
  assert.match(draft, /引用链核验/);
  const noEngine = startGenre([], '想做战棋短局', 'tactics');
  assert.ok(!/引擎核验清单/.test(kickoffDraft(noEngine)), '无工程条件不出现引擎清单');
});

test('棋牌包新增对手智能题，默认最浅档', () => {
  const project = startGenre([], '想做识破对手破绽的牌局', 'gambling');
  const deep = questionnaireView(project, { deep: true });
  const q = deep.find(item => item.id === 'gam_ai');
  assert.ok(q, 'gam_ai 未出现');
  assert.equal(q.recommendation.value, 'plain');
  assert.match(q.options[1].label, /作弊庄家/);
});
