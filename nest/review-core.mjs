import { intakeProfile, recordDesignDecision } from './workbench-core.mjs';
import { reviewIssues, questionnaireView } from './questionnaire.mjs';
import { activeGenrePack } from './content-packs.mjs';
import { evidenceBoardLabel } from './build-task.mjs';

const active = (project, topic) => (project.designDecisions ?? []).find(item => item.topic === topic && item.status === 'accepted');
const label = (project, topic) => active(project, topic)?.label ?? '未定';
const symptomLabel = project => {
  const inferred = { clarity: '看不懂目标或规则', feedback: '做了操作却看不出结果', scope: '流程太长，做不完一轮' };
  return active(project, '首个待查症状')?.label
    ?? (inferred[intakeProfile(project).symptom] ? `${inferred[intakeProfile(project).symptom]}（用户描述，待观察）` : '未定');
};

export const FIRST_TABLES = [
  { value: 'blackjack', label: '21 点', detail: '建议先做：规则容易入门，能把识破作弊、准备、赌局和结果连成一轮。' },
  { value: 'holdem', label: '德州扑克', detail: '多人心理战较强；对手行为、信息展示和测试量都更大。' },
  { value: 'bingo', label: 'BINGO', detail: '适合呈现公开规则是否公平；需要先设计玩家能采取的反制行动。' },
  { value: 'hitandbit', label: '猜数字', detail: '推理规则集中、制作较轻；要补上与人物和赌注的联系。' },
];

export function reviewSnapshot(project) {
  const genrePack = activeGenrePack(intakeProfile(project).genre);
  const issues = reviewIssues(project);
  const missing = questionnaireView(project).filter(item => !item.accepted && !item.provisional);
  const needsReview = (project.designDecisions ?? []).filter(item => item.status === 'needs_review');
  const firstTable = active(project, '首个可玩赌桌');
  const gamblingTables = active(project, '六种赌桌的首版范围');
  const needsFirstTable = Boolean(gamblingTables
    && ['21点', '德州扑克', 'BINGO', '猜数字'].every(name => `${gamblingTables.label} ${gamblingTables.consequence}`.includes(name)));
  const route = project.decisions.route?.status === 'accepted' ? project.decisions.route.value : null;
  const hasAIReview = (project.judgments ?? []).some(item => item.kind === 'ai_review');
  const newGameQuestions = route === 'new_game' ? questionnaireView(project) : [];
  const newGameDefined = newGameQuestions.every(item => item.accepted);
  const routeGaps = route === 'compare'
    ? ['短局方向已选，但具体规则、结束条件和制作约束尚未细化。保存项目包，交给带张翼 skill 的 AI 细化成可执行草案，再判断能否开工。']
    : route === 'mod'
      ? ['模组可行性未核实：先确认目标游戏开放的修改接口、发布规则，以及首个改动能否装入原游戏。']
      : route === 'new_game'
        ? [newGameDefined
          ? hasAIReview
            ? '张翼审查意见已回挂；仍需把第一局操作、胜负与结束画面写成可执行规格，并只读核验工程实际能运行的链路。AI 建议本身不是运行证据。'
            : '第一局方向已选，仍需张翼核对具体操作、胜负与结束画面，并只读核验工程能运行的链路；问卷选完不能代替这一步。'
          : '现有工程做新游戏仍缺具体首局与复用边界：先选玩家第一局做什么，再核对源码、编译和实际运行证据。']
      : route === 'short'
        ? ['独立短局目前只定了方向；还要写清每回合操作、胜负与结束画面，并做出可从头玩到尾的一局。']
      : [];
  const advisories = [];
  if (genrePack?.review && ['new_game', 'short'].includes(route)) advisories.push({
    title: genrePack.review.title,
    detail: `${genrePack.review.detail} 首版暂缓：${genrePack.prototype.defer.join('、')}。`,
    source: `${genrePack.shortTitle ?? genrePack.title}内容包的首局验收预设；尚无本项目试玩证据`,
  });
  if (needsFirstTable && /完整章节/.test(label(project, '首版目标'))) advisories.push({
    title: '四桌加完整章节，内容量会很快放大',
    detail: '每桌不仅要能运行，还要有入门说明、对手行为、人物赌注和输赢后果。先用一桌打通章节的一轮，再决定另外三桌的接入次序。',
    source: '已确认的“首版目标”与“四桌主线”',
  });
  if (label(project, '玩家承诺').includes('掌握') && label(project, '首十分钟行动').includes('试一遍')) advisories.push({
    title: '第一局要让新人自己看懂，而不只是打完',
    detail: '开场已经决定让玩家试玩核心规则。制作时要记录他何时看懂目标、何时知道可用行动，以及输赢后能否说出原因。',
    source: '已确认的“玩家承诺”与“首十分钟行动”',
  });
  const currentEvidence = (project.evidence ?? []).filter(item => item.status === 'current');
  const staleEvidence = (project.evidence ?? []).filter(item => item.status === 'needs_review');
  if (!currentEvidence.length) advisories.push({
    title: '当前方案还没有运行和真人试玩证据',
    detail: route === 'mod' ? '先核实目标游戏允许怎样修改，再在原游戏中运行第一项改动；之后观察玩家是否看见变化。'
      : `问卷回答只能描述计划。下一步需要实际玩一轮，再观察首次接触者${project.input.entries.includes('existing') ? '；已有原型或引擎是否能运行，也需另行核实' : ''}。`,
    source: staleEvidence.length ? '旧证据已随方案变更过期，需重新核验' : '项目记录 evidence 为空',
  });
  if (currentEvidence.length) advisories.push({
    title: `当前证据等级：${evidenceBoardLabel(project)}`,
    detail: '构建通过、实际运行、从头玩通、真人试玩是四级不同的证据；没到真人试玩前，不判断好不好玩。',
    source: '03 证据状态板',
  });
  return {
    issues, missing, needsReview, routeGaps, firstTable: needsFirstTable ? firstTable : null, needsFirstTable, advisories,
    ready: Boolean(project.decisions.route?.status === 'accepted' && project.decisions.focus?.status === 'accepted'
      && !issues.length && !missing.length && !needsReview.length && !routeGaps.length && (!needsFirstTable || firstTable)),
    facts: [
      ['游戏品类', ({ tactics: '战棋或战术策略', gambling: '棋牌、赌局或心理博弈', rogue: '肉鸽或牌组构筑', metroidvania: '银河恶魔城（能力门控探索）', 'visual-novel': '视觉小说或叙事冒险（阅读推进与分支）', puzzle: '解谜（理解与推导为核心的谜题）', management: '经营或养成', unspecified: '尚未确定' })[intakeProfile(project).genre]
        + `（${intakeProfile(project).genreSource}）`],
      ['第一份作品重点', project.decisions.focus?.status === 'accepted' ? project.decisions.focus.label : '未定'],
      ...(route === 'compare' ? [
        ...(active(project, '同玩方式') ? [['同玩方式', label(project, '同玩方式')]] : []),
        ['首个验证问题', label(project, '首个验证问题')],
      ] : route === 'improve' ? [
        ['首个待查症状', symptomLabel(project)],
      ] : route === 'new_game' ? [
        ['打算复用', label(project, '复用意图')],
        ['首局目标', label(project, '首局目标')],
        ...(genrePack ? genrePack.questions.map(question => [question.topic, label(project, question.topic)]) : []),
        ...(active(project, '胜负代价') ? [['胜负代价', label(project, '胜负代价')]] : []),
        ...(active(project, '失败后继续方式') ? [['失败后继续方式', label(project, '失败后继续方式')]] : []),
      ] : route === 'mod' ? [] : route === 'short' ? [
        ['首局目标', label(project, '首局目标')],
        ...(genrePack ? genrePack.questions.map(question => [question.topic, label(project, question.topic)]) : []),
        ['首个验证问题', label(project, '首个验证问题')],
      ] : [
        ['玩家承诺', label(project, '玩家承诺')],
        ['开场十分钟', label(project, '首十分钟行动')],
        ['一轮怎样推进', label(project, '核心循环组织')],
        ['赢与输', label(project, '胜负代价')],
        ['失败后继续', label(project, '失败后继续方式')],
        ['首版范围', label(project, '首版目标')],
        ['可玩边界', label(project, '可玩切片边界')],
      ]),
    ],
  };
}

export function chooseFirstTable(project, value) {
  const option = FIRST_TABLES.find(item => item.value === value);
  if (!option || !reviewSnapshot(project).needsFirstTable) throw new Error('当前项目无需选择首个赌桌。');
  const next = recordDesignDecision(project, '首个可玩赌桌', option.label,
    `先以${option.label}打通准备、对局、胜负结算与后续变化；首版四桌主线的决定不变。其余赌桌随后逐一接入。`, 'user');
  active(next, '首个可玩赌桌').reviewChoiceId = value;
  return next;
}

export function keepRetry(project) {
  if (!reviewIssues(project).some(item => item.id === 'loss-or-retry')) throw new Error('当前没有这项冲突。');
  return recordDesignDecision(project, '胜负代价', '正式输局可重试，本次不跨局扣资格',
    '撤回原“输局扣资格并带损失继续”的结算规定。重试前可显示失败原因，但资格和押注不进入后续故事；需要另设计长期压力来源。', 'user');
}

export function reviewDocument(project) {
  const view = reviewSnapshot(project);
  const list = rows => rows.map(item => `- ${item}`).join('\n') || '- 无。';
  const firstTableLine = view.needsFirstTable ? `\n- 首个可玩赌桌：${view.firstTable?.label ?? '待选'}` : '';
  const nextSteps = project.decisions.route?.value === 'improve'
    ? '1. 邀请首次接触的人独立玩一轮，不在中途解释。\n2. 记录第一次停住的位置、当时操作和他以为该做什么；用户描述只是待查线索。\n3. 据观察只改一处，再让另一位首次接触者试一次。'
    : view.needsFirstTable
    ? `1. 明确失败如何结算，保证规则说明与剧情后果一致。\n2. 以${view.firstTable?.label ?? '首个待选赌桌'}做出入场、准备、操作、胜负反馈与继续的闭环。\n3. 实际运行并观察新玩家能否独立完成；根据记录再扩展其他赌桌。`
    : project.decisions.route?.value === 'compare'
      ? `1. 让张翼以已选的“${project.decisions.focus?.label ?? '待选方向'}”写出具体规则、玩家行动、结果和制作代价。\n2. 做出能从头玩到尾的一轮，再与其他方向比较。\n3. 实际运行，并观察新玩家能否独立完成。`
      : project.decisions.route?.value === 'mod'
        ? '1. 核实目标游戏可修改的内容、工具与发布规则。\n2. 只做已选的第一项改动，在原游戏里运行检查。\n3. 观察玩家是否看见这项改动带来的新选择。'
        : project.decisions.route?.value === 'new_game'
          ? '1. 只读核查现有工程已能运行的链路，区分代码存在、编译通过和实际玩通。\n2. 写出新游戏第一局的具体操作、胜负条件和结束画面，交给张翼审查后再确认制作范围。\n3. 做出这一局，实际运行并观察新玩家能否独立完成。'
        : project.decisions.route?.value === 'short'
          ? '1. 把首局目标写成每回合能做的动作、胜负条件、结束画面与重开方式。\n2. 做出这一局并在目标环境实际玩完。\n3. 按已选验证问题观察首次接触者，再决定是否扩展。'
        : '1. 明确失败怎样结算，保证规则说明与后续变化一致。\n2. 以已选的第一份作品重点做出开始、操作、结果与重开的闭环。\n3. 实际运行，并观察新玩家能否独立完成；再决定是否扩展。';
  const statusText = view.ready
    ? project.decisions.route?.value === 'improve'
      ? '当前结构化缺口已处理，可以安排观察首次玩家；尚不能据此判断具体修法有效。'
      : '当前规则检查已处理，可以准备下一步；玩法质量仍待实做与真人试玩。'
    : '还有影响下一步的待处理项，先核对下列内容。';
  return `# 方案审查记录\n\n> 项目记录 v${project.version} · 页面内规则检查 · 不是张翼正式裁决书\n\n## 当前状态\n\n${statusText}\n\n## 已确认的方案骨架\n\n${view.facts.map(([topic, value]) => `- ${topic}：${value}`).join('\n')}${firstTableLine}\n\n## 待处理\n\n${list([
    ...view.issues.map(item => `${item.title}${/[？?]$/.test(item.title) ? ' ' : '：'}${item.detail}`),
    ...view.needsReview.map(item => `${item.topic}：旧决定需复核（${item.label}）`),
    ...view.missing.map(item => `${item.topic}：尚未确认`),
    ...view.routeGaps,
    ...(view.needsFirstTable && !view.firstTable ? ['首个可玩赌桌：四桌主线尚未指定先打通哪一桌。'] : []),
  ])}\n\n## 制作风险提示（推演，尚未实测）\n\n${list(view.advisories.map(item => `${item.title}。${item.detail} 依据：${item.source}。`))}\n\n## 开工顺序建议\n\n${nextSteps}\n\n## 证据边界\n\n- 本页只核对结构化问卷和已知冲突，没有运行游戏，也没有核查构建、平衡、模组支持或权利链。\n- 用户填写的“已有工程”是项目条件，不是本页重新运行得到的证据。\n- 没有真人试玩数据，不能断言规则好玩、节奏合适或玩家能看懂。\n\n—— 张翼 Spread the Pinions · 方案审查记录 v${project.version}\n`;
}
