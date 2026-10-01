import { focusOptions, intakeGuidance, intakeProfile, recordDesignDecision } from './workbench-core.mjs';
import { activeGenrePack, genrePackRecommendation, genrePackPlan, stylePackPlan, enginePackPlan } from './content-packs.mjs';

// 题库是离线预设。这里的推荐是默认草案，不代表模型已评审当前项目。
const card = (id, group, topic, prompt, why, options, settings = {}) => ({
  id, group, topic, prompt, why,
  options: options.map(([value, label, effect]) => ({ value, label, effect })),
  recommended: options[0][0], depth: 'essential', when: 'all', dependsOn: [], ...settings,
});

export const QUESTION_BANK = [
  card('party_mode', '先定朋友怎样同玩', '同玩方式', '朋友们第一版怎样一起操作？', '这会直接改变界面、联机成本和首次试玩方式。', [
    ['one_screen', '围着同一块屏幕玩', '先做本地同屏，朋友可以当面讨论；第一版不需要联机。'],
    ['pass_device', '轮流拿同一部设备', '每个人看到的信息可以不同，但必须设计交接和防偷看。'],
    ['online', '各自用设备远程玩', '适合异地朋友，但需要连接、同步和掉线处理，首版工作量明显增加。']], { when: 'party_compare' }),
  card('diagnosis_point', '先诊断现有项目', '首个待查症状', '第一次接触的人，最先可能卡在哪里？', '先把用户描述当线索，观察真实行为后再决定改哪里。', [
    ['clarity', '看不懂目标或规则', '请对方不听解释试玩一轮，记下第一次停住的位置和当时他以为该做什么。'],
    ['feedback', '做了操作却看不出结果', '记录他在哪一步不知道自己的行动是否有效，再检查画面、声音与结算反馈。'],
    ['scope', '流程太长，做不完一轮', '先测一轮耗时与中断位置，再决定缩短流程还是删掉一段。']], { when: 'improve' }),
  card('reuse_boundary', '先看现有工程能帮什么', '复用意图', '新游戏第一版最想借用工程中的哪一层？', '这里只记录打算复用什么；是否能运行要另查。', [
    ['core', '先借用核心玩法操作', '优先试现有的移动、交互或结算等核心操作；旧内容暂不视为新游戏内容。'],
    ['shell', '先借用运行框架与界面', '保留启动、输入和存档等外壳，核心规则按新体验重新设计；改造量可能更大。'],
    ['data', '先借用内容制作流程', '先检查关卡、角色或数值如何接入；原有代码与素材的使用范围需要单独核实。']], { when: 'new_game' }),
  card('first_challenge', '让第一局具体起来', '首局目标', '第一局让玩家亲手完成什么？', '先有一场能玩完的短局，才能判断实际需要哪些系统。', [
    ['hold', '守住一处目标', '玩家利用位置和有限行动阻止威胁；守到目标完成算胜，目标失守算败。'],
    ['escort', '护送目标抵达出口', '玩家开路并保护移动中的目标；抵达出口算胜，目标受阻或被击倒算败。'],
    ['defeat', '击败指定对手', '玩家集中行动处理关键敌人；敌人倒下算胜，己方失去继续行动能力算败。']], { when: 'first_challenge' }),
  card('promise', '想让玩家经历什么', '玩家承诺', '玩家玩完第一段，最想记住什么？', '它决定哪些功能值得做。', [
    ['choice', '自己的选择改变局势', '玩家每次拍板都要看见人物、资源或下一局规则变化；重点是后果，不是选项数量。'], ['mastery', '逐渐掌握一套玩法', '让玩家先学会一条规则，再发现它能被利用或反制；重点是越玩越会判断。'], ['story', '参与一段难忘的故事', '让玩家的行动推动人物关系和事件；重点是我参与了，而非只看剧情。']]),
  card('first_action', '想让玩家经历什么', '首十分钟行动', '玩家开始后，最先亲手做什么？', '先确定可操作的一步，避免开场只讲设定。', [
    ['decide', '做一次有后果的选择', '开场就让玩家选一件会留下后果的事，随后马上兑现。'], ['try', '试一遍核心玩法', '前十分钟完成一局最简挑战：看懂规则、操作、得到结算。'], ['explore', '走进一个能发现秘密的地方', '先让玩家自己找出可用线索，再用它进入第一场挑战。']]),
  card('audience', '想让玩家经历什么', '目标玩家', '这第一版最想给谁玩？', '不同玩家愿意学的规则量不同。', [
    ['curious', '喜欢题材、愿意尝试的新玩家', '入门要轻。'], ['genre', '熟悉这类游戏的玩家', '可以更快进入复杂选择。'], ['friends', '先给身边朋友试玩', '先做短而完整的一局。']], { depth: 'deep' }),
  card('reference_relation', '想让玩家经历什么', '参考游戏路径', '你想怎样借用喜欢的游戏？', '决定制作边界和验证方式。', [
    ['mod', '先做模组', '先核实目标游戏开放哪些修改口。'], ['small', '做一局相似体验的小样', '用独立短局验证核心体验。'], ['original', '逐步做自己的完整版本', '需要重新定义规则和内容。']], { when: 'reference', depth: 'deep' }),
  card('reference_appeal', '想让玩家经历什么', '参考游戏吸引点', '那款游戏最抓住你的是什么？', '先保留真正想复现的感受。', [
    ['decisions', '每一步都要权衡', '先做有代价的决策。'], ['world', '想待在那个世界', '先做一个能互动的场景。'], ['growth', '从弱到强很过瘾', '先做一次看得见的成长。']], { when: 'reference', depth: 'deep' }),
  card('scope_goal', '想让玩家经历什么', '首版目标', '第一份能玩的版本做到哪一步就够？', '先定交付边界。', [
    ['slice', '一段从开始到结束的短局', '只做入场、一次核心操作、结果和重开，最快暴露规则问题。'], ['chapter', '一个完整章节', '包含人物、准备、关键挑战和结果；能测衔接，但内容量明显增加。'], ['system', '先让核心规则运转', '先在无正式剧情和美术的白盒里检验最难的规则。']]),

  card('player_identity', '玩家怎样行动', '玩家角色', '玩家在这个世界里是谁？', '身份应该影响能做的事。', [
    ['newcomer', '刚进入世界的新人', '自然学习规则。'], ['insider', '熟悉规则但处境不利的人', '更快进入博弈。'], ['outsider', '被迫卷入的普通人', '用陌生视角发现异常。']], { when: 'story' }),
  card('player_goal', '玩家怎样行动', '眼前目标', '玩家眼前最想办成哪件事？', '目标要能推动第一段操作。', [
    ['survive', '撑过眼前考验', '玩家一开始就知道不通过会失去什么，目标清楚。'], ['save', '保住某个人或东西', '每次局间准备都与这份牵挂有关，人物会影响打法。'], ['discover', '查清一个关键秘密', '线索要能改变行动，不能只作为剧情收集品。']]),
  card('core_verb', '玩家怎样行动', '核心行动', '玩家大部分时间在做什么？', '决定游戏真正要实现的动作。', [
    ['choose', '比较线索并做选择', '玩家主要根据情报推断下一步；规则操作可以很轻。'], ['act', '操作规则并争取优势', '玩家亲自执行关键操作、看反馈、调整策略；每一步应对结果产生影响。'], ['negotiate', '与人交换信息和条件', '玩家主要判断对方想要什么，再决定暴露、交换或隐瞒。']], { dependsOn: ['玩家承诺'] }),
  card('loop_shape', '玩家怎样行动', '核心循环组织', '一段游玩怎样接到下一段？', '避免关键操作与下一段目标脱节。', [
    ['chapter', '关键挑战接准备阶段', '适合控制节奏的章节。'], ['explore', '自由探索中触发挑战', '需要更多地图和事件内容。'], ['run', '短局结束后从头再来', '适合规则驱动的重复游玩。']], { dependsOn: ['核心行动'] }),
  card('between', '玩家怎样行动', '局间行动主轴', '两次关键挑战之间，玩家主要做什么？', '这决定第二套玩法是否有存在理由。', [
    ['prepare', '为下一次挑战做准备', '局间行动在下一局兑现。'], ['investigate', '调查世界的真相', '线索要改变后续判断。'], ['recover', '恢复资源和关系', '要防止变成例行补给。']], { when: 'multi', dependsOn: ['核心循环组织'] }),
  card('first_result', '玩家怎样行动', '第一段可见结果', '玩家完成第一步后，马上看见什么改变？', '让玩家知道自己的操作有效。', [
    ['world', '世界状态改变', '反馈落在场景或规则上。'], ['person', '有人改变态度', '反馈落在关系上。'], ['resource', '得到或失去关键资源', '反馈落在生存处境上。']], { depth: 'deep' }),
  card('learning', '玩家怎样行动', '规则教学', '新玩家怎样学会第一条重要规则？', '避免开场说明书。', [
    ['safe', '先做一次低风险尝试', '容错高。'], ['guided', '由角色带着做', '可顺便塑造人物。'], ['observe', '先看别人成功或失败', '悬念强，但玩家参与较晚。']], { depth: 'deep' }),

  card('stakes', '输赢与人物', '胜负代价', '这一轮赢了和输了，接下来各改变什么？', '输赢必须改变处境。', [
    ['status', '改变继续参与的资格', '长线压力清楚。'], ['person', '改变一个人的命运或立场', '人物代价更直接。'], ['resource', '改变可用资源和机会', '便于进入下一轮选择。']], { dependsOn: ['核心循环组织'] }),
  card('failure_continue', '输赢与人物', '失败后继续方式', '输掉一次后，玩家怎样继续？', '决定失败是否只剩读档。', [
    ['cost', '带着明确损失继续', '本次失败造成的资源、机会或关系变化会保留到下一段。'], ['retry', '学到规则后重试', '本次重打，损失不进入后续流程；若先前定了失败留损失，需要重新拍板。'], ['ending', '走向另一条结局', '失败直接转入不同结局或章节，需制作能承接这条分支的内容。']], { dependsOn: ['胜负代价'] }),
  card('win_signal', '输赢与人物', '胜利反馈', '玩家怎样知道自己赢得了什么？', '胜利需要具体可见。', [
    ['access', '打开新机会或地点', '扩大行动空间。'], ['trust', '改变他人的决定', '强化人物回应。'], ['resource', '得到能马上用的资源', '强化下一轮准备。']], { depth: 'deep' }),
  card('major_people', '输赢与人物', '主要参赛者', '第一段最需要哪类对手或同伴？', '人物应给玩家不同的选择压力。', [
    ['rival', '懂规则的对手', '挑战玩家的判断。'], ['ally', '有条件的盟友', '合作伴随代价。'], ['mirror', '与玩家处境相似的人', '让选择后果更近。']], { when: 'story' }),
  card('relationship', '输赢与人物', '好感系统', '玩家和人物的关系怎样影响行动？', '只保留能改变选择的关系。', [
    ['trust', '信任与承诺影响合作', '少数状态也能有后果。'], ['score', '数值成长解锁能力', '容易形成刷分行为。'], ['events', '只记录具体事件', '状态简单，但分支需要写清。']], { when: 'story', depth: 'deep' }),
  card('world_response', '输赢与人物', '世界回应', '玩家做完重要决定后，世界怎样回应？', '让因果被看见。', [
    ['rules', '规则或权限改变', '偏系统反馈。'], ['people', '人物行动改变', '偏叙事反馈。'], ['space', '可去的地方改变', '偏探索反馈。']], { when: 'story', depth: 'deep' }),
  card('secret', '输赢与人物', '首个悬念', '第一段最值得玩家追问的是什么？', '悬念要能推动下一步行动。', [
    ['rule', '这条规则是否公平', '适合规则型故事。'], ['person', '谁在隐瞒关键事实', '适合人物交涉。'], ['place', '这个地方为何如此运作', '适合调查探索。']], { when: 'story', depth: 'deep' }),

  card('world', '舞台与制作范围', '世界与舞台', '第一版主要发生在哪里？', '集中场景能降低制作量。', [
    ['closed', '一个反复返回的封闭场所', '人物和规则可以逐渐变化。'], ['route', '几处按顺序抵达的地点', '章节区分清楚。'], ['open', '可自由往返的区域', '探索空间较大。']], { when: 'story' }),
  card('organizer', '舞台与制作范围', '赌局主办者', '如果挑战由人举办，谁定规则？', '主办者的目的会影响所有规则。', [
    ['institution', '维持秩序的组织', '规则有制度压力。'], ['private', '掌握资源的个人或集团', '冲突更集中。'], ['automatic', '无人公开负责的系统', '悬疑感更强。']], { when: 'gambling' }),
  card('tables', '舞台与制作范围', '六种赌桌的首版范围', '现成赌桌第一版用多少？', '源码现成也有内容与测试成本。', [
    ['few', '先选四种以内', '让每桌有剧情职责。'], ['all', '六桌都进入主线', '内容压力明显增大。'], ['one', '先做一桌可玩的短局', '最快验证核心玩法。']], { when: 'gambling_existing' }),
  card('minigames', '舞台与制作范围', '三种对话小游戏', '局间小游戏第一版怎样处理？', '它们需要服务主循环。', [
    ['cut', '先不放进第一版', '集中在关键挑战。'], ['one', '只留一个有剧情作用的', '需定义它改变什么。'], ['all', '三个都保留', '制作和教学成本增加。']], { when: 'gambling_existing', depth: 'deep' }),
  card('dialogue', '舞台与制作范围', '对话轮盘系统', '玩家和角色怎样交谈？', '交谈方式应服务玩家目的。', [
    ['intent', '选交谈目的并谈条件', '结果能影响准备。'], ['cards', '抽取话题卡', '随机感强，目的性较弱。'], ['fixed', '主要看固定剧情', '制作简单，玩家控制少。']], { when: 'gambling_existing' }),
  card('economy', '舞台与制作范围', '经济系统', '第一版需要几套资源？', '每多一套都增加理解与平衡成本。', [
    ['one', '一项最重要的生存资源', '压力集中。'], ['two', '生存资格加可花资源', '选择更多，账本更复杂。'], ['legacy', '沿用原金钱与债务', '改造少，但可能和新世界不合。']], { when: 'gambling_existing' }),
  card('adversity', '舞台与制作范围', '逆境值系统', '输局要给玩家补偿吗？', '防止故意输局变成最优策略。', [
    ['clue', '只有实际发现线索才留下收获', '损失仍然成立。'], ['points', '每次输都攒通用点数', '需要验证是否诱导故意输。'], ['none', '不提供补偿', '规则最清楚。']], { when: 'gambling_existing', depth: 'deep' }),
  card('skills', '舞台与制作范围', '技能系统', '角色专属技能第一版怎样处理？', '技能应改变一局中的判断。', [
    ['few', '只留少数有代价的能力', '例如一次看牌或换情报，但每次使用都要付出可见代价。'], ['all', '沿用原技能体系', '需要逐项证明技能不会替玩家做判断，还要重新平衡所有赌桌。'], ['none', '先不设技能', '先靠规则、线索和交涉形成胜法；以后再判断技能是否必要。']], { when: 'gambling_existing' }),
  card('shop', '舞台与制作范围', '物品与商店', '第一版还需要买卖物品吗？', '商店不能只因代码现成而存在。', [
    ['specific', '只留能改变下一局准备的物品', '每件物品必须改变下一局的一个具体选择，获取方式也要写清。'], ['all', '沿用完整商店', '要同时设计货币、价格、取得与消耗，很容易偏离斗智主线。'], ['none', '第一版不设商店', '局间只靠行动机会、情报和人物承诺做取舍。']], { when: 'gambling_existing' }),
  card('map', '舞台与制作范围', '地图探索', '局间需要自己走地图吗？', '地图成本取决于选择是否发生在空间里。', [
    ['menu', '直接选要去的人或地点', '用菜单完成有限局间行动，适合地点本身不承担推理的版本。'], ['small', '保留少量可走区域', '只做几个确有线索、人物或阻碍的地点，玩家走到哪里才算一次选择。'], ['all', '沿用完整地图', '每个区域都要有用途与事件，否则玩家只是在空地图上赶路。']], { when: 'gambling_existing' }),
  card('quiz', '舞台与制作范围', '问答系统', '问答题库第一版要用吗？', '题目应测玩家在游戏里学到的东西。', [
    ['none', '第一版不做问答', '若赌局本身已经检验玩家理解，就不另做一套题目。'], ['story', '只问玩家已发现的规则与线索', '题目必须来自玩家实际见过的信息，并影响行动，不能靠猜背景设定。'], ['trivia', '做独立知识问答', '需要额外题库和难度维护，也容易打断局前准备。']], { when: 'gambling_existing' }),
  card('engine', '舞台与制作范围', '制作工具', '第一版准备用什么制作？', '决定交接和试玩方式。', [
    ['current', '沿用手头已有工具', '尽快验证内容。'], ['simple', '选能最快做短局的工具', '少量功能先跑通。'], ['undecided', '先不定，等小样目标清楚', '暂缓技术投入。']], { when: 'no_existing', depth: 'deep' }),
  card('art_scope', '舞台与制作范围', '首版视觉范围', '第一版的画面做到什么程度？', '先让玩家看懂状态。', [
    ['functional', '清楚的占位画面', '优先验证玩法。'], ['key', '做好一个关键场景', '更容易测试氛围。'], ['polished', '接近正式美术', '耗时较多。']], { depth: 'deep' }),
  card('audio_scope', '舞台与制作范围', '首版声音范围', '声音第一版承担什么？', '声音应反馈行动或建立氛围。', [
    ['feedback', '先做关键反馈音', '强化操作结果。'], ['mood', '先做一段氛围音乐', '强化场景情绪。'], ['later', '先不做声音', '先测基本流程。']], { depth: 'deep' }),

  card('slice', '第一份可玩版本', '可玩切片边界', '第一份可玩的内容从哪儿开始，到哪儿结束？', '有终点才能判断是否做完。', [
    ['single', '进入一轮并走到结果', '玩家能开始、操作、看到结果并重开；两轮之间的内容以后补。'], ['chapter', '准备、挑战、结果各有一步', '至少一次事前选择会在挑战中兑现，结果再改变后续处境。'], ['system', '先单独试玩一个机制', '只检验最不确定的规则，暂不宣称章节已能完整游玩。']], { dependsOn: ['首版目标', '核心循环组织'] }),
  card('test_question', '第一份可玩版本', '首个验证问题', '找人试玩时，最想知道哪件事？', '先测一个能观察的问题。', [
    ['understand', '玩家能否看懂该做什么', '观察首次接触者能否不靠解释完成第一轮，并记下卡住的位置。'], ['choice', '玩家是否看见选择的后果', '试玩后请他指出哪次选择改变了结果；答不出就先修反馈。'], ['continue', '玩家是否想继续下一段', '完成完整短局后再问想不想继续，并追问具体原因；不能只看口头好评。']]),
  card('test_partner', '第一份可玩版本', '首批试玩者', '第一版先交给谁试玩？', '不同试玩者能发现不同问题。', [
    ['new', '没玩过这类游戏的人', '检查上手困难。'], ['experienced', '熟悉这类游戏的人', '检查规则深度。'], ['both', '两类人各找几位', '比较理解差异。']], { depth: 'deep' }),
  card('restart', '第一份可玩版本', '重开方式', '一段结束后，玩家怎样再来一次？', '短小样需要完整结束和重开。', [
    ['retry', '直接重试这一段', '便于比较选择。'], ['chapter', '回章节入口', '适合叙事段落。'], ['save', '从存档继续', '需要维护状态一致。']], { depth: 'deep' }),
  card('handoff', '第一份可玩版本', '开发交接重点', '交给下一个制作模型时，最怕它改错什么？', '交接必须锁住最重要的边界。', [
    ['rules', '核心规则与胜负', '优先写行为规格。'], ['story', '人物与剧情因果', '优先写场景状态。'], ['tech', '现有工程兼容性', '优先写版本和接口限制。']], { depth: 'deep' }),
  card('unknown', '第一份可玩版本', '最大未定项', '现在哪个未知最可能推翻方案？', '先标出风险，别当成已证实。', [
    ['fun', '核心玩法实际是否吸引人', '做短局试玩。'], ['scope', '制作量是否超出能力', '先砍第一版范围。'], ['clarity', '玩家是否看懂目标', '先做入门测试。']], { depth: 'deep' }),
];

// 品类包只增补同品类问题；是否带工程继续由项目路线单独决定。
export function availableQuestions(project) {
  return [...QUESTION_BANK, ...(activeGenrePack(intakeProfile(project).genre)?.questions ?? [])];
}

const acceptedFor = (project, topic) => (project.designDecisions ?? [])
  .find(item => item.topic === topic && item.status === 'accepted');
const provisionalFor = (project, topic) => (project.designDecisions ?? [])
  .find(item => item.topic === topic && item.status === 'provisional');
const reviewFor = (project, topic) => (project.designDecisions ?? [])
  .find(item => item.topic === topic && item.status === 'needs_review');

function firstChallengeOptions(project) {
  const pack = activeGenrePack(intakeProfile(project).genre);
  if (pack) return pack.firstChallenge.options;
  const choices = {
    gambling: [
      ['read', '识破一次对手的破绽', '玩家观察、下注并验证判断；识破破绽算胜，误判导致本局失利。'],
      ['risk', '押上一件重要资源', '玩家在继续与止损之间取舍；守住资源或赢得目标算胜，押注失败算败。'],
      ['rule', '利用一条公开规则反制对手', '玩家先学规则再找到反制时机；反制成功算胜，机会用尽算败。'],
    ],
    management: [
      ['order', '完成一份有条件的订单', '玩家安排有限资源满足需求；按时交付算胜，期限内未完成算败。'],
      ['shortage', '撑过一次资源短缺', '玩家重新分配人手或物资；维持关键服务算胜，核心资源耗尽算败。'],
      ['tradeoff', '在两位顾客之间做取舍', '玩家选择优先满足谁并看见后果；守住本轮目标算胜，失去必要条件算败。'],
    ],
    rogue: [
      ['climb', '推进到本层终点并击败关底', '玩家在一条分层路线上选择节点、逐步强化牌组；击败本层 BOSS 算胜，牌组或生命耗尽算败。'],
      ['threshold', '在有限出牌次数内达到分数门槛', '玩家用抽到的牌凑出尽可能高的牌型得分；达到当轮门槛算胜，用尽次数未达标算败。'],
      ['survive', '在越来越强的波次里坚持若干回合', '玩家每轮用有限资源应对成批敌人；撑满约定波次算胜，被压垮算败。'],
    ],
    metroidvania: [
      ['unlock', '用第一个能力打开先前见过却过不去的门', '玩家拿到新能力后折返开锁、世界扩张算达成，始终找不到一处已见门算失败。'],
      ['traverse', '从入口穿过多段新能力、抵达深处的出口', '玩家沿一条能力门控的路线向深处推进；抵达出口算胜，被卡在无路可走处算败。'],
      ['map', '把一小块地图的探索度补满并取下核心奖励', '玩家用新能力补齐先前够不到的分支；探索度达标并取走钥匙算胜，遗漏关键分支无法推进算败。'],
    ],
    'visual-novel': [
      ['read_through', '读完一个完整短篇并抵达唯一结局', '玩家从开场一路读到结局，全程零分支或仅有无后果的表态选择；读完并看到收束算达成，中途放弃算失败。'],
      ['branch_once', '在一处关键选择上走出自己的一条路', '玩家在主干上遇到一个会改变后续内容的选择；抵达该线的结局算达成，选择被无视而被察觉算失败。'],
      ['reach_ending', '把主干读完并解锁一个「真结局」所需的前置', '玩家先走完一条直接线，再凭读到的信息打开另一条结局；两个结局都能读到算达成，前置无法在已读内容里取得判失败。'],
    ],
    'puzzle': [
      ['mechanic_ladder', '一条规则加五到八关阶梯，证明规则本身立得住', '玩家从最简形态学会一条规则，再在逐关变化里把它用到底；全部关卡都用同一套规则解开算达成，靠新增机制或猜出题人意图过关算失败。'],
      ['insight_room', '一组各自独立的洞察关，每关一个「原来是这样」', '玩家在每关撞上一个几乎成功、最后一步失败的错误思路，随后自己换框架解开；解完后能说出为什么算达成，靠反复试错撞对算失败。'],
      ['deduce_chain', '一条可演绎的推理链，答案唯一且可从已给信息推出', '玩家靠排除与逻辑一步步收窄，最终结论可由线索唯一确定；玩家能复述推理链算达成，需要外部知识或猜测算失败。'],
    ],
    unspecified: [      ['goal', '完成一个清楚的小目标', '玩家反复使用一项主要操作抵达目标；完成算胜，机会用尽算败。'],
      ['protect', '保护一件重要事物', '玩家分配有限行动阻止损失；守住目标算胜，目标被破坏算败。'],
      ['choice', '做一次会改变结果的选择', '玩家比较两种方案并执行；结果立即呈现，失败可重试或另行承接。'],
    ],
  };
  return choices[intakeProfile(project).genre].map(([value, label, effect]) => ({ value, label, effect }));
}

function adaptedQuestion(project, question) {
  return question.id === 'first_challenge'
    ? { ...question, options: firstChallengeOptions(project), recommended: firstChallengeOptions(project)[0].value }
    : question;
}

export function recommendationFor(project, question) {
  const pack = activeGenrePack(intakeProfile(project).genre);
  const packRecommendation = pack && (question.id === 'first_challenge' || pack.questions.some(item => item.id === question.id))
    ? genrePackRecommendation(project, question) : null;
  if (packRecommendation && question.options.some(item => item.value === packRecommendation.value)) return packRecommendation;
  const decided = topic => acceptedFor(project, topic)?.label ?? '';
  const gamble = /赌|牌局|赌场|斗智/.test(`${project.input.idea} ${project.input.constraints}`);
  const rules = {
    diagnosis_point: intakeProfile(project).symptom && [intakeProfile(project).symptom,
      '用户原话提示了这个症状；这里只是待核实假设，不能替代观察首次试玩。依据卡 ur-001 的上手期检查维度。'],
    promise: gamble && ['mastery', '现有赌局最有价值的是让玩家学会识破、利用和反制规则；先把这条成长线做出来。'],
    first_action: decided('玩家承诺') === '逐渐掌握一套玩法'
      && ['try', '既然目标是掌握玩法，开头就让玩家完成一局简化挑战，不先灌输世界观。'],
    scope_goal: project.input.entries.includes('existing')
      && ['slice', '现成工程能运行，不等于新内容已成立。先完成短局，可更快检查规则与反馈。'],
    player_goal: /临时居民/.test(decided('玩家角色'))
      && ['survive', '已有角色处境是临时资格将到期，第一段目标应直接落在保住资格。'],
    core_verb: gamble && ['act', '这个项目保留了关键赌桌；让玩家亲自操作、观察对手并调整策略，才能证明赌桌有存在价值。'],
    failure_continue: /资格递减|带着.*损失|损失.*继续/.test(`${decided('胜负代价')} ${acceptedFor(project, '胜负代价')?.consequence ?? ''}`)
      && ['cost', '之前已定输局扣资格并带着损失继续。正式赌局选择读档重打会撤销这条决定；教学练习可另设重试。'],
    skills: gamble && ['none', '先测试没有技能时，规则、情报与交涉是否足以支撑斗智；技能之后再加。'],
    shop: /单一居留资格/.test(decided('经济系统'))
      && ['none', '首版已收束为单一资格资源；完整商店会重新引入货币与价格体系。'],
    map: /完整章节/.test(decided('首版目标')) && /下一局做准备/.test(decided('局间行动主轴'))
      && ['small', '一个完整章节可以用少量有目的的地点承载线索和交涉；每处都必须影响下一局。'],
    quiz: /逐渐掌握一套玩法/.test(decided('玩家承诺'))
      && ['story', '若保留问答，就只检查玩家刚从规则或线索学到的内容，并让答案影响行动。'],
    slice: /完整章节/.test(decided('首版目标'))
      && ['chapter', '要检验章节能否成立，至少需要一次准备兑现到挑战，再看到结果。'],
    test_question: /逐渐掌握一套玩法/.test(decided('玩家承诺'))
      && ['understand', '先观察新玩家能否独立看懂规则和完成第一局；看不懂时，“想不想继续”很难解释。'],
  };
  const [value, reason] = rules[question.id] || [question.recommended,
    `题库预设先试“${question.options.find(item => item.value === question.recommended)?.label}”，它较容易做成可验证的第一版；没有足够证据时仍由你拍板。`];
  return { value, reason, source: question.id === 'diagnosis_point' && rules[question.id]
    ? '用户原话中的待核实线索' : rules[question.id] ? '已确认的项目记录' : '通用题库预设' };
}

export function reviewIssues(project) {
  const stakes = acceptedFor(project, '胜负代价');
  const failure = acceptedFor(project, '失败后继续方式');
  if (stakes && failure?.label === '学到规则后重试'
    && !/可重试|不跨局扣|不结算/.test(stakes.label)
    && /资格递减|带着.*损失|损失.*继续/.test(`${stakes.label} ${stakes.consequence}`)) {
    return [{ id: 'loss-or-retry', questionId: 'failure_continue',
      title: '输局到底留损失，还是读档重打？',
      detail: '已确认的赌注要求输局扣资格并带着损失继续；后选的“重试”会抹掉这次损失。建议正式赌局采用带损失继续，只把重试留给教学练习。需要你核对，工作台不会替你改答案。' }];
  }
  return [];
}

function matches(project, rule) {
  const entries = project.input.entries;
  const idea = `${project.input.idea} ${project.input.constraints}`;
  const gambling = /赌|牌局|赌场|斗智/.test(idea);
  if (rule === 'all') return true;
  if (rule === 'improve') return project.decisions.route?.value === 'improve';
  if (rule === 'new_game') return project.decisions.route?.value === 'new_game';
  if (rule === 'first_challenge') return ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'party_compare') return project.decisions.route?.value === 'compare'
    && intakeProfile(project).social === 'party';
  if (rule === 'reference') return entries.includes('reference');
  if (rule === 'story') return entries.includes('story') || gambling;
  if (rule === 'multi') {
    const loop = acceptedFor(project, '核心循环组织');
    if (loop) return !/短局结束后从头再来/.test(loop.label);
    return /多局|章节|回合|下一局/.test(idea);
  }
  if (rule === 'gambling') return gambling;
  if (rule === 'gambling_existing') return gambling && entries.includes('existing');
  if (rule === 'no_existing') return !entries.includes('existing');
  if (rule === 'tactics') return intakeProfile(project).genre === 'tactics'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'party_genre') return intakeProfile(project).genre === 'party'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'horror_genre') return intakeProfile(project).genre === 'horror'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'towerdefense') return intakeProfile(project).genre === 'towerdefense'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'management') return intakeProfile(project).genre === 'management'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'gambling_genre') return intakeProfile(project).genre === 'gambling'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'rogue_genre') return intakeProfile(project).genre === 'rogue'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'metroidvania_genre') return intakeProfile(project).genre === 'metroidvania'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'visual_novel_genre') return intakeProfile(project).genre === 'visual-novel'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'puzzle_genre') return intakeProfile(project).genre === 'puzzle'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'survival_genre') return intakeProfile(project).genre === 'survival'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'simulation_genre') return intakeProfile(project).genre === 'simulation'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  if (rule === 'idle_genre') return intakeProfile(project).genre === 'idle'
    && ['new_game', 'short'].includes(project.decisions.route?.value);
  return false;
}

export function questionnaireView(project, { deep = false } = {}) {
  const route = project.decisions.route?.value;
  const routeQuestions = {
    improve: intakeProfile(project).symptom ? [] : ['diagnosis_point'],
    compare: intakeProfile(project).social === 'party'
      ? ['party_mode', 'test_question'] : ['audience', 'test_question'],
    mod: [],
    new_game: ['reuse_boundary', 'first_challenge'],
    short: ['first_challenge', 'test_question'],
  };
  const allowed = routeQuestions[route];
  const visible = availableQuestions(project).filter(item => (!allowed || allowed.includes(item.id)
      || (['new_game', 'short'].includes(route) && deep && item.when !== 'new_game'))
    && matches(project, item.when) && (deep || item.depth === 'essential'));
  if (route === 'new_game') visible.sort((a, b) => (a.id === 'first_challenge' ? -1 : b.id === 'first_challenge' ? 1 : 0));
  return visible.map(raw => {
    const item = adaptedQuestion(project, raw);
    const accepted = acceptedFor(project, item.topic);
    const stillApplies = item.id !== 'first_challenge' || !accepted
      || item.options.some(option => option.label === accepted.label);
    return { ...item,
      recommendation: recommendationFor(project, item),
      accepted: stillApplies ? accepted ?? null : null,
      provisional: provisionalFor(project, item.topic) ?? null,
      needsReview: !stillApplies ? accepted : reviewFor(project, item.topic) ?? null,
    };
  });
}

export function answerQuestion(project, id, value) {
  const question = questionnaireView(project, { deep: true }).find(item => item.id === id);
  if (!question) throw new Error('这道题不适用于当前项目。');
  const option = question.options.find(item => item.value === value);
  if (!option) throw new Error('请选择题目提供的选项。');
  const previous = acceptedFor(project, question.topic);
  if (previous?.label === option.label) return project;
  const next = recordDesignDecision(project, question.topic, option.label, option.effect, 'user');
  acceptedFor(next, question.topic).questionId = id;
  acceptedFor(next, question.topic).optionValue = value;
  if (!previous) return next;
  const changedTopics = new Set([question.topic]);
  for (const item of availableQuestions(next)) {
    if (!item.dependsOn.some(topic => changedTopics.has(topic))) continue;
    const downstream = acceptedFor(next, item.topic);
    if (downstream) {
      downstream.status = 'needs_review';
      changedTopics.add(item.topic);
    }
  }
  return next;
}

export function usePresetRecommendation(project, id) {
  const question = availableQuestions(project).find(item => item.id === id);
  if (!question || question.depth !== 'deep' || !matches(project, question.when)) {
    throw new Error('这道题不能由预设建议代答。');
  }
  if (acceptedFor(project, question.topic)) return project;
  const option = question.options.find(item => item.value === recommendationFor(project, question).value);
  const existing = provisionalFor(project, question.topic);
  if (existing?.label === option.label) return project;
  const next = recordDesignDecision(project, question.topic, option.label, option.effect, 'preset');
  const saved = acceptedFor(next, question.topic);
  saved.status = 'provisional';
  saved.questionId = id;
  next.history.at(-1).type = 'provisional_decision';
  next.history.at(-1).summary = `预设暂拟${question.topic}：${option.label}（待你确认）`;
  return next;
}

const clean = value => String(value ?? '').replace(/\r/g, '').trim();
const acceptedLine = item => `- ${item.topic}：${item.label}。${item.consequence}`;

export function kickoffDraft(project) {
  const guidance = intakeGuidance(project);
  const route = project.decisions.route?.value;
  const focus = project.decisions.focus?.status === 'accepted' ? project.decisions.focus : null;
  if (route === 'improve') {
    const inferred = { clarity: '看不懂目标或规则', feedback: '操作后看不出结果', scope: '流程太长，做不完一轮' };
    const symptom = acceptedFor(project, '首个待查症状')?.label
      ?? inferred[intakeProfile(project).symptom] ?? '待观察首次接触者后定位';
    return `# 立项书草案（现有项目诊断）\n\n> 项目记录 v${project.version} · 离线起步草案 · 尚未读取工程或观察玩家\n\n## 用户带来的现状\n\n${clean(project.input.idea) || '未记录'}\n\n## 当前只先查一件事\n\n- 待查症状：${symptom}。${acceptedFor(project, '首个待查症状') ? '用户已选；仍需观察验证。' : '来自用户描述的推断，尚未由玩家观察验证。'}\n- 诊断重点：${focus?.label ?? '未定'}\n- 建议：${guidance.suggestion}\n- 判断依据：${guidance.basis}\n\n## 下一次观察\n\n1. 让首次接触者独立尝试一轮，中途不解释。\n2. 记下第一次停住的位置、之前的操作、他以为该做什么。\n3. 根据记录只改一处，再观察下一位首次接触者。\n\n## 证据边界\n\n- ${guidance.boundary}\n- 当前没有本项目的运行或真人试玩证据；此文档不判定修法有效。\n\n—— 张翼 Spread the Pinions · 立项书草案 v${project.version}\n`;
  }
  if (route === 'compare') {
    const alternatives = focusOptions(project).filter(item => item.id !== focus?.value)
      .map(item => `- ${item.label}：${item.effect}`).join('\n') || '- 暂无。';
    return `# 立项书草案（方向比较）\n\n> 项目记录 v${project.version} · 离线预设草案 · 未经模型评审\n\n## 用户想要的体验\n\n${clean(project.input.idea) || '尚未写下具体想法。'}\n\n## 当前选择\n\n- 先试：${focus?.label ?? '未定'}。${focus?.effect ?? ''}\n- 同玩方式：${acceptedFor(project, '同玩方式')?.label ?? '未定'}\n- 首个观察问题：${acceptedFor(project, '首个验证问题')?.label ?? '未定'}\n\n## 另外两条可比较的方向\n\n${alternatives}\n\n## 还不能直接制作的部分\n\n- 所选方向尚需写清具体规则、结束条件与制作约束，再交给制作。\n- ${guidance.boundary}\n- 没有运行和真人试玩证据，不判断哪条方向更好玩。\n\n—— 张翼 Spread the Pinions · 立项书草案 v${project.version}\n`;
  }
  if (route === 'mod') return `# 立项书草案（模组起步）\n\n> 项目记录 v${project.version} · 离线起步草案 · 未核实目标游戏修改接口\n\n## 用户想重现的体验\n\n${clean(project.input.idea) || '未记录'}\n\n## 第一项改动\n\n- ${focus?.label ?? '未定'}。${focus?.effect ?? ''}\n- 张翼建议：${guidance.suggestion}\n- 判断依据：${guidance.basis}\n\n## 开工前核实\n\n1. 确认目标游戏允许修改什么、需要哪些工具，以及能否在原游戏中运行。\n2. 只做选定的第一项改动，检查玩家是否看见新的行动或反馈。\n3. 模组支持、发布规则与实际效果尚未验证，不把此草案当作可行性结论。\n\n—— 张翼 Spread the Pinions · 立项书草案 v${project.version}\n`;
  if (route === 'short') {
    const challenge = acceptedFor(project, '首局目标');
    const test = acceptedFor(project, '首个验证问题');
    const candidates = firstChallengeOptions(project).map(item => `- ${item.label}：${item.effect}`).join('\n');
    const other = (project.designDecisions ?? []).filter(item => item.status === 'accepted'
      && !['首局目标', '首个验证问题'].includes(item.topic)).map(acceptedLine).join('\n') || '- 暂无。';
    const provisional = (project.designDecisions ?? []).filter(item => item.status === 'provisional')
      .map(acceptedLine).join('\n') || '- 暂无。';
    const needsReview = (project.designDecisions ?? []).filter(item => item.status === 'needs_review')
      .map(acceptedLine).join('\n') || '- 暂无。';
    const issues = reviewIssues(project).map(item => `- ${item.title}：${item.detail}`).join('\n') || '- 暂无明确矛盾；仍需专业复核。';
    const packNote = activeGenrePack(intakeProfile(project).genre) ? '' : '## 内容包覆盖说明\n\n- 当前品类暂无完整内容包：上方首局候选来自通用题库预设，覆盖有限。可保存项目包，让带张翼 skill 的 AI 按你的题材重做首局设计。\n\n';
    return `# 立项书草案（独立短局）\n\n> 项目记录 v${project.version} · 离线首局草案 · 未经实际游玩验证\n\n## 你想做的游戏\n\n${clean(project.input.idea) || '尚未写下具体想法。'}\n\n## 第一局\n\n- 玩家目标：${challenge?.label ?? '未定'}。${challenge?.consequence ?? ''}\n- 第一份作品重点：${focus?.label ?? '未定'}。${focus?.effect ?? ''}\n- 首次试玩先观察：${test?.label ?? '未定'}。${test?.consequence ?? ''}\n\n${genrePackPlan(project, intakeProfile(project).genre)}${stylePackPlan(project.input.style)}${packNote}## 还可考虑的首局候选\n\n${candidates}\n\n## 先前已记下的其他决定\n\n${other}\n\n## 预设建议，尚待确认\n\n${provisional}\n\n## 需复核的旧决定\n\n${needsReview}\n\n## 待核对的矛盾\n\n${issues}\n\n## 下一步\n\n1. 把所选首局写成玩家可执行的操作、胜负条件、结束画面和重开方式。\n2. 制作一局小样并在目标环境实际玩完。\n3. 按首个验证问题观察首次接触者；目前没有运行或真人试玩证据。\n\n—— 张翼 Spread the Pinions · 立项书草案 v${project.version}\n`;
  }
  if (route === 'new_game') {
    const reuse = acceptedFor(project, '复用意图');
    const challenge = acceptedFor(project, '首局目标');
    const options = firstChallengeOptions(project);
    const candidateList = options.map(item => `- ${item.label}：${item.effect}`).join('\n');
    const otherDecisions = (project.designDecisions ?? []).filter(item => item.status === 'accepted'
      && !['复用意图', '首局目标'].includes(item.topic)).map(acceptedLine).join('\n') || '- 暂无。';
    const provisional = (project.designDecisions ?? []).filter(item => item.status === 'provisional')
      .map(acceptedLine).join('\n') || '- 暂无。';
    const needsReview = ((project.designDecisions ?? []).filter(item => item.status === 'needs_review')
      .map(acceptedLine).join('\n') || '- 暂无。')
      + '\n\n## 待核对的矛盾\n\n'
      + (reviewIssues(project).map(item => `- ${item.title}：${item.detail}`).join('\n') || '- 暂无明确矛盾；仍需专业复核。');
    const packNote = activeGenrePack(intakeProfile(project).genre) ? '' : '## 内容包覆盖说明\n\n- 当前品类暂无完整内容包：上方首局候选来自通用题库预设，覆盖有限。可保存项目包，让带张翼 skill 的 AI 按你的题材重做首局设计。\n\n';
    return `# 立项书草案（沿用工程做新游戏）\n\n> 项目记录 v${project.version} · 离线首局草案 · 未核实工程运行\n\n## 已给出的新游戏想法与工程线索\n\n- 新游戏想法：${clean(project.input.idea) || '未填写；不能从工程类型推断新游戏已经设计好。'}\n- 工程条件：${clean(project.input.constraints) || '未记录。'}\n- 第一份作品重点：${focus?.label ?? '未定'}\n\n## 复用与第一局\n\n- 打算复用：${reuse?.label ?? '未定'}。${reuse?.consequence ?? '这只是复用意图。'}\n- 第一局目标：${challenge?.label ?? '未定'}。${challenge?.consequence ?? ''}\n\n${genrePackPlan(project, intakeProfile(project).genre)}${stylePackPlan(project.input.style)}${enginePackPlan(project.input.constraints)}${packNote}## 可反应的首局候选\n\n${candidateList}\n\n## 先前已记下的其他决定\n\n${otherDecisions}\n\n## 预设建议，尚待确认\n\n${provisional}\n\n## 需复核的旧决定\n\n${needsReview}\n\n## 交给张翼继续核验\n\n1. 只读盘点现有工程：分别标明代码存在、编译通过、实际玩通的证据。\n2. 把所选首局写成玩家具体操作、胜负条件和结束画面；尚未选时先给草案供选择。\n3. ${guidance.boundary}\n\n—— 张翼 Spread the Pinions · 立项书草案 v${project.version}\n`;
  }
  const accepted = (project.designDecisions ?? []).filter(item => item.status === 'accepted');
  const provisional = (project.designDecisions ?? []).filter(item => item.status === 'provisional');
  const review = (project.designDecisions ?? []).filter(item => item.status === 'needs_review');
  const issues = reviewIssues(project);
  const visible = questionnaireView(project);
  const missing = visible.filter(item => !item.accepted && !item.provisional);
  const get = topic => accepted.find(item => item.topic === topic)?.label ?? '未定';
  const unclassified = accepted.filter(item => !QUESTION_BANK.some(question => question.topic === item.topic));
  return `# 立项书草案\n\n> 项目记录 v${project.version} · 固定题库与用户决定生成 · 未经张翼模型逐项评审\n\n## 起步方向\n\n- 路线：${project.decisions.route?.label ?? '未定'}\n- 选中的短局或重点：${project.decisions.focus?.label ?? '未定'}\n- 张翼离线建议：${guidance.suggestion}\n- 判断依据：${guidance.basis}\n- 还要核实：${guidance.boundary}\n\n## 玩家会经历什么\n\n- 玩家承诺：${get('玩家承诺')}\n- 玩家身份：${get('玩家角色')}\n- 首十分钟：${get('首十分钟行动')}\n- 眼前目标：${get('眼前目标')}\n\n## 怎样玩与怎样变化\n\n- 核心行动：${get('核心行动')}\n- 循环：${get('核心循环组织')}\n- 局间行动：${get('局间行动主轴')}\n- 胜负代价：${get('胜负代价')}\n- 失败后继续：${get('失败后继续方式')}\n\n## 舞台与首版范围\n\n- 舞台：${get('世界与舞台')}\n- 首版目标：${get('首版目标')}\n- 可玩切片：${get('可玩切片边界')}\n- 首个验证问题：${get('首个验证问题')}\n\n## 待核对的矛盾\n\n${issues.map(item => `- ${item.title}：${item.detail}`).join('\n') || '- 当前规则检查未发现明确矛盾；仍需张翼做专业复核。'}\n\n## 已确认的决定\n\n${accepted.map(acceptedLine).join('\n') || '- 暂无。'}\n\n## 预设建议，尚待确认\n\n${provisional.map(acceptedLine).join('\n') || '- 暂无。'}\n\n## 需复核的旧决定\n\n${review.map(acceptedLine).join('\n') || '- 暂无。'}\n\n## 仍缺的关键决定\n\n${missing.map(item => `- ${item.topic}：${item.prompt}`).join('\n') || '- 当前必要路径已填；仍需用真人试玩和工程检查验证。'}\n\n## 其他已确认材料\n\n${unclassified.map(acceptedLine).join('\n') || '- 暂无。'}\n\n## 来源和限制\n\n- 用户原话：${clean(project.input.idea) || '未记录'}\n- 已有条件：${clean(project.input.constraints) || '未记录'}\n- 已确认、预设暂拟、需复核和未定分开列出；此文档是工作草案，不代表玩法已被验证。\n- 尚无基于本问卷的真人试玩结论。\n\n—— 张翼 Spread the Pinions · 立项书草案 v${project.version}\n`;
}
