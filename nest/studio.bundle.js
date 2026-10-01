/* 由 node tools/build_studio.mjs 生成；请编辑 .mjs 源文件。 */
(() => {
'use strict';

const ENTRY_POINTS = [
  { id: 'reference', label: '我喜欢一款游戏', detail: '想做一个类似的版本' },
  { id: 'mechanic', label: '我想到一种玩法', detail: '知道玩家能做什么' },
  { id: 'story', label: '我有故事或世界', detail: '先让它能被玩家参与' },
  { id: 'wish', label: '我只想做游戏', detail: '还没想好具体方向' },
  { id: 'existing', label: '我已有项目', detail: '从企划或原型继续' },
];

const GENRE_OPTIONS = [
  { id: 'auto', label: '先不定，让张翼从想法中推测' },
  { id: 'tactics', label: '战棋或战术策略' },
  { id: 'gambling', label: '棋牌、赌局或心理博弈' },
  { id: 'rogue', label: '肉鸽或牌组构筑' },
  { id: 'metroidvania', label: '银河恶魔城（能力门控探索）' },
  { id: 'visual-novel', label: '视觉小说或叙事冒险（阅读推进与分支）' },
  { id: 'puzzle', label: '解谜（理解与推导为核心的谜题）' },
  { id: 'party', label: '派对或聚会游戏' },
  { id: 'horror', label: '恐怖或微恐治愈' },
  { id: 'towerdefense', label: '塔防' },
  { id: 'survival', label: '生存建造（资源压力与失败代价）' },
  { id: 'simulation', label: '模拟器（扮演职业/系统角色、按流程作业）' },
  { id: 'idle', label: '增量挂机/放置（产能、自动化与重置）' },
  { id: 'management', label: '经营或养成' },
  { id: 'other', label: '其他或混合玩法' },
];

const STYLE_OPTIONS = [
  { id: 'none', label: '先不定风格，或不做特定文化风格' },
  { id: 'guofeng', label: '古风（武侠、仙侠、国潮）' },
  { id: 'anime', label: '日式幻想／二次元' },
  { id: 'western-fantasy', label: '西幻（中世纪奇幻、低魔与史诗）' },
  { id: 'cyberpunk', label: '赛博朋克（近未来、义体与巨型企业）' },
  { id: 'steampunk', label: '蒸汽朋克与柴油朋克（维多利亚机械、两战之间）' },
  { id: 'cozy', label: '治愈系／cozy（庇护感、日常仪式、低压力）' },
  { id: 'pixel', label: '像素／复古（呈现技术纪律、可叠加任一题材）' },
  { id: 'horror', label: '恐怖氛围（只管呈现与不安，不管玩法规则）' },
  { id: 'hard-scifi', label: '硬科幻／太空（只管呈现与技术可信，不管玩法规则）' },
];

const ROUTES = {
  new_game: { label: '沿用现有工程做新游戏', effect: '先核实现有工程可用的部分，再重新决定玩家目标与内容。' },
  mod: { label: '先做原游戏模组', effect: '沿用现成游戏的运行环境；先核实它支持怎样的模组。' },
  short: { label: '先做一局独立小样', effect: '只重现一段关键体验，尽快得到能玩的短局。' },
  compare: { label: '先比较几个方向', effect: '先看玩家会做什么，再决定要做哪一版。' },
  improve: { label: '先修现有项目', effect: '从已有材料和最大问题继续，不重新立项。' },
};

const FOCUS = {
  mod: [
    ['content', '先改一件可见内容', '例如一株作物、一个角色或一张卡；先核实原游戏是否允许替换或新增。'],
    ['rule', '先改一条互动规则', '让玩家在原游戏里做出一项不同的选择，再看后果是否可见。'],
    ['day', '先做一段完整体验', '把开始、行动和结果接成一小段；制作量较大，适合已熟悉模组工具时。'],
  ],
  reference: [
    ['moment', '先重现最喜欢的十分钟', '保留参考游戏抓住你的那段行动与反馈，先做一轮。'],
    ['change', '先试一处自己的变化', '只改一个设定或规则，检查它是否改变玩家的行动。'],
    ['small', '先做能从头玩到尾的短局', '把相似体验缩成开始、操作、结果与重开。'],
  ],
  mechanic: [
    ['first_turn', '先做第一个回合', '只验证这个玩法动作会带来什么后果。'],
    ['risk', '先做一次冒险选择', '让玩家在安全与收益之间真正取舍。'],
    ['failure', '先做一次失败', '检查输掉后玩家是否看懂原因。'],
  ],
  story: [
    ['choice', '先做一次人物抉择', '让玩家的决定改变一段关系或事件。'],
    ['explore', '先探索一个地点', '让世界规则通过行动被发现。'],
    ['conflict', '先处理一场冲突', '让故事压力直接影响玩家操作。'],
  ],
  existing: [
    ['observe', '先找出朋友卡在哪里', '看首次接触的人在哪里停住，记录实际行为再改规则。'],
    ['loop', '先检查一轮能否走完', '核对开始、行动、结果与重开有没有断点。'],
    ['scope', '先收紧接下来要做的事', '只有很少时间时，先保住最关键的一轮体验。'],
  ],
  new_game: [
    ['world', '先定玩家会进入的地方', '让已有工程中的一个场所承载玩家行动与反馈。'],
    ['loop', '先定一轮怎样结束', '明确行动、反馈和下一轮，不因代码已有就全部保留。'],
    ['systems', '先审现成系统', '看哪些模块服务新体验，哪些只会增加制作量。'],
  ],
  general: [
    ['first_turn', '先玩第一个回合', '从一件玩家能做的事开始。'],
    ['feeling', '先比较几种体验', '从最想让玩家感受到的变化开始。'],
    ['small', '先做最小版本', '用短局尽快看到想法能否运行。'],
  ],
};

const COMPARE_DIRECTIONS = {
  party: [
    ['party_misread', '合作闯关：互相描述，却不能说全', '朋友各拿一部分线索，限时拼出答案；第一版只做一关和一次揭晓。'],
    ['party_bluff', '欢乐诈唬：有人知道真相，有人装懂', '每轮一人编解释、其他人投票；第一版做三轮和一次结算。'],
    ['party_chaos', '手忙脚乱：分工总会出意外', '大家分头完成简单任务，突发限制迫使重新分工；第一版做一轮。'],
  ],
  general: [
    ['solo_discover', '发现秘密：边探索边改判断', '走进一个小场景，找到线索并用它改变一次结果；第一版只做一处地点。'],
    ['solo_master', '越玩越懂：一条规则有两种用法', '先学会一项操作，再遇到需要反过来用它的局面；第一版做两关。'],
    ['solo_choice', '做出选择：后果马上发生', '处理一件眼前难题，决定一个人或一项资源的去向；第一版做一次选择和反馈。'],
  ],
};

function intakeProfile(state) {
  const words = `${state.input.idea} ${state.input.constraints}`;
  const explicitGenre = state.input.genre ?? 'auto';
  const gameIdea = state.input.idea;
  const inferredGenre = inferGenreFromIdea(gameIdea);
  return {
    genre: explicitGenre === 'auto' ? inferredGenre : explicitGenre === 'other' ? 'unspecified' : explicitGenre,
    genreSource: explicitGenre === 'auto' ? '文字推测，待确认' : '用户选择',
    social: /朋友|多人|联机|一起玩|聚会|双人|合作/.test(words) ? 'party' : 'unspecified',
    symptom: /看不懂|不懂规则|不会玩|不理解/.test(words) ? 'clarity'
      : /没反馈|不知道结果|看不出变化/.test(words) ? 'feedback'
      : /做不完|时间不够|只有周末|范围太大/.test(words) ? 'scope' : null,
    basis: '仅从用户原话提取线索；未核查工程或观察玩家。',
  };
}

function intakeGuidance(state) {
  const profile = intakeProfile(state);
  const route = state.decisions.route?.value;
  if (route === 'improve') return {
    known: state.input.idea || '用户已带来一个项目，具体问题尚未描述。',
    suggestion: profile.symptom === 'clarity' ? '先观察第一次接触的人在哪里看不懂，记下停住前的操作，再决定改规则还是改说明。'
      : profile.symptom === 'feedback' ? '先找出操作后哪一步没有清楚反馈，再决定补提示还是修改结果。'
      : profile.symptom === 'scope' ? '先核对一轮从开始到结果能否走完，再决定缩短哪里。'
      : '先找一个最影响玩家完成第一轮的症状，从真实行为判断该改哪处。',
    boundary: '用户描述是线索；这里还没有读取工程或观察玩家。',
    basis: 'ur-001：先查玩家能否学会、是否愿意继续和是否知道目标。',
  };
  if (route === 'compare') return {
    known: state.input.idea || '用户还没有具体玩法。',
    suggestion: profile.social === 'party' ? '先看三种朋友同玩的短局草案，选一张最想试玩的，再补制作边界。'
      : '先看三种短局草案，选一个想试玩的玩家行动，再补制作边界。',
    boundary: '下方是离线预设方向；它们尚未针对你的项目通过模型评审。',
    basis: 'gd-002：从想要的感受和玩家行为倒推玩法。',
  };
  if (route === 'mod') return {
    known: state.input.idea || '用户想从一款喜欢的游戏出发。',
    suggestion: '先挑一个最想重现的游玩瞬间，再决定只改一件内容、改一条规则，还是做完整短段。',
    boundary: '目标游戏能否做模组，以及允许改什么，仍需核实。',
    basis: 'gd-001：新增内容要看它怎样改变玩家行为。',
  };
  if (route === 'new_game') return {
    known: state.input.idea || state.input.constraints || '用户有现成工程，但还没写下新游戏的具体想法。',
    suggestion: '先挑一场玩家能玩完的第一局，再选择打算借用工程中的哪层能力。工作台会给可修改的短局候选；其他通用设定以后按需补。',
    boundary: '已有源码、可编译、实际玩通是三种不同证据；这里还没有读取工程，也没有替新游戏完成专业评审。',
    basis: '用户提供的工程线索与首个可玩片段纪律；短局候选只是离线草案。',
  };
  return {
    known: state.input.idea || '用户还没有写下具体想法。',
    suggestion: '先定一件玩家能亲手做、立刻看见结果的事，再收紧第一份作品。',
    boundary: '这是离线起步建议，尚未运行游戏或观察玩家。',
    basis: 'gd-001：从玩家行为和反馈判断机制价值。',
  };
}

const timestamp = () => new Date().toISOString();
const clone = value => structuredClone(value);
const current = record => record?.status === 'accepted';

function createProject() {
  const now = timestamp();
  return {
    schemaVersion: 1,
    version: 1,
    createdAt: now,
    updatedAt: now,
    input: { idea: '', constraints: '', entries: [], genre: 'auto', style: 'none', updatedAt: now },
    decisions: { route: null, focus: null },
    designDecisions: [],
    judgments: [],
    evidence: [],
    artifacts: [],
    history: [],
  };
}

function routeOptions(state) {
  const entries = state.input.entries;
  const ids = [];
  if (entries.includes('existing')) ids.push('improve', 'new_game');
  if (entries.includes('reference')) ids.push('mod');
  if (entries.includes('wish') && !entries.includes('mechanic') && !entries.includes('story')) ids.push('compare', 'short');
  else ids.push('short', 'compare');
  const wantsNewGame = /新.{0,12}游戏|新作品|重新设计|从零设计|另做一款|沿用.{0,12}工程.{0,12}做/.test(state.input.idea);
  const recommended = state.decisions.route?.status === 'accepted' ? state.decisions.route.value
    : entries.includes('existing') ? (wantsNewGame ? 'new_game' : 'improve')
    : entries.includes('reference') ? 'mod'
      : entries.includes('wish') ? 'compare' : 'short';
  return ids.map(id => ({ id, ...ROUTES[id], recommended: id === recommended }));
}

function focusOptions(state) {
  const route = state.decisions.route?.value;
  const entries = state.input.entries;
  if (route === 'compare') {
    const kind = intakeProfile(state).social === 'party' ? 'party' : 'general';
    return COMPARE_DIRECTIONS[kind].map(([id, label, effect]) => ({ id, label, effect }));
  }
  const kind = route === 'new_game' ? 'new_game'
    : route === 'mod' ? 'mod'
    : route === 'improve' ? 'existing'
    : entries.includes('reference') ? 'reference'
    : entries.includes('story') ? 'story'
    : entries.includes('mechanic') ? 'mechanic' : 'general';
  return FOCUS[kind].map(([id, label, effect]) => ({ id, label, effect }));
}

function advance(state, event) {
  state.version += 1;
  state.updatedAt = timestamp();
  state.history.push({ id: `change-${state.version}`, at: state.updatedAt, ...event });
}

function setInput(project, idea, entries, constraints = '', genre = project.input.genre ?? 'auto', style = project.input.style ?? 'none') {
  const next = clone(project);
  if (!GENRE_OPTIONS.some(item => item.id === genre)) throw new Error('未知游戏品类。');
  if (!STYLE_OPTIONS.some(item => item.id === style)) throw new Error('未知表现风格。');
  const oldGenre = intakeProfile(next).genre;
  const cleanEntries = ENTRY_POINTS.map(item => item.id).filter(id => entries.includes(id));
  const cleanIdea = String(idea).trim();
  const cleanConstraints = String(constraints).trim();
  if (next.input.idea === cleanIdea && next.input.constraints === cleanConstraints
      && (next.input.genre ?? 'auto') === genre && (next.input.style ?? 'none') === style
      && JSON.stringify(next.input.entries) === JSON.stringify(cleanEntries)) return next;
  const materialsChanged = next.input.idea !== cleanIdea || next.input.constraints !== cleanConstraints
    || JSON.stringify(next.input.entries) !== JSON.stringify(cleanEntries);
  next.input = { idea: cleanIdea, constraints: cleanConstraints, entries: cleanEntries, genre, style, updatedAt: timestamp() };
  if (materialsChanged) for (const decision of Object.values(next.decisions)) {
    if (decision) decision.status = 'needs_review';
  }
  if (oldGenre !== intakeProfile(next).genre) for (const decision of next.designDecisions ?? []) {
    if (genrePackTopics().includes(decision.topic)
      && ['accepted', 'provisional'].includes(decision.status)) decision.status = 'needs_review';
  }
  if (materialsChanged || oldGenre !== intakeProfile(next).genre) {
    for (const review of next.judgments ?? []) {
      for (const item of review.interventions ?? []) if (item.status === 'proposed') item.status = 'needs_review';
    }
    for (const item of next.evidence ?? []) if (item.status === 'current') item.status = 'needs_review';
    for (const item of next.playtests ?? []) if (item.status === 'current') item.status = 'needs_review';
  }
  advance(next, { type: 'input_changed', summary: '修改了最初的想法或带来的材料；后续选择需要复核。' });
  return next;
}

function choose(project, topic, value) {
  if (!['route', 'focus'].includes(topic)) throw new Error('未知的选择类型。');
  if (topic === 'focus' && project.decisions.route?.status !== 'accepted') {
    throw new Error('先确认起步路线，再选第一份作品的重点。');
  }
  const options = topic === 'route' ? routeOptions(project) : focusOptions(project);
  const selected = options.find(item => item.id === value);
  if (!selected) throw new Error('这个选项与当前项目不匹配。');
  const next = clone(project);
  const old = next.decisions[topic];
  if (old?.status === 'accepted' && old.value === value) return next;
  const now = timestamp();
  next.decisions[topic] = {
    id: `decision-${topic}-${next.version + 1}`,
    topic,
    value,
    label: selected.label,
    effect: selected.effect,
    status: 'accepted',
    actor: 'user',
    at: now,
    dependsOn: topic === 'focus' ? next.decisions.route?.id ?? null : null,
  };
  if (topic === 'route' && next.decisions.focus) {
    next.decisions.focus.status = 'needs_review';
  }
  for (const review of next.judgments ?? []) {
    for (const item of review.interventions ?? []) if (item.status === 'proposed') item.status = 'needs_review';
  }
  if (topic === 'route' || topic === 'focus') for (const item of next.evidence ?? []) {
    if (item.status === 'current') item.status = 'needs_review';
  }
  if (topic === 'route' || topic === 'focus') for (const item of next.playtests ?? []) {
    if (item.status === 'current') item.status = 'needs_review';
  }
  advance(next, {
    type: 'decision_changed', topic,
    summary: `${topic === 'route' ? '起步路线' : '第一份作品重点'}：${old?.label ?? '未选'} → ${selected.label}`,
    previousId: old?.id ?? null,
  });
  return next;
}

function recordDesignDecision(project, topic, label, consequence, actor = 'user') {
  const next = clone(project);
  next.designDecisions ??= [];
  const cleanTopic = String(topic).trim();
  const cleanLabel = String(label).trim();
  const cleanConsequence = String(consequence).trim();
  if (!cleanTopic || !cleanLabel || !cleanConsequence) throw new Error('设计决定需要主题、结论和影响。');
  const previous = next.designDecisions.find(item => item.topic === cleanTopic
    && ['accepted', 'provisional', 'needs_review'].includes(item.status));
  if (previous?.status === 'accepted' && previous.label === cleanLabel
      && previous.consequence === cleanConsequence) return next;
  if (previous) previous.status = 'superseded';
  for (const review of next.judgments ?? []) {
    for (const item of review.interventions ?? []) {
      if (item.topic === cleanTopic && item.status === 'proposed') item.status = 'needs_review';
    }
  }
  const at = timestamp();
  // 设计决定是证据所依附的方案；决定变化后旧证据不再代表当前方案（与 02/03 页"需复核"声明一致）。
  // 仅修正影响说明（选择不变）不改选择，证据仍然有效。
  if (!(previous?.status === 'accepted' && previous.label === cleanLabel)) {
    for (const item of next.evidence ?? []) if (item.status === 'current') item.status = 'needs_review';
    for (const item of next.playtests ?? []) if (item.status === 'current') item.status = 'needs_review';
  }
  next.designDecisions.push({ id: `design-${next.version + 1}`, topic: cleanTopic,
    label: cleanLabel, consequence: cleanConsequence, status: 'accepted', actor, at,
    replaces: previous?.id ?? null });
  const wordingOnly = previous?.status === 'accepted' && previous.label === cleanLabel;
  advance(next, { type: wordingOnly ? 'decision_note_corrected' : 'design_decision', topic: cleanTopic,
    summary: wordingOnly ? `修正${cleanTopic}的影响说明（选择不变）`
      : `${cleanTopic}：${previous?.label ?? '未定'} → ${cleanLabel}`, previousId: previous?.id ?? null });
  return next;
}

function validateProject(value) {
  if (!value || value.schemaVersion !== 1 || !value.input || !Array.isArray(value.input.entries)
      || typeof value.input.idea !== 'string' || (value.input.constraints != null && typeof value.input.constraints !== 'string')
      || (value.input.genre != null && !GENRE_OPTIONS.some(item => item.id === value.input.genre))
      || (value.input.style != null && !STYLE_OPTIONS.some(item => item.id === value.input.style))
      || !value.decisions || !Array.isArray(value.history)
      || !Number.isInteger(value.version) || value.version < 1
      || !Array.isArray(value.judgments) || !Array.isArray(value.evidence) || !Array.isArray(value.artifacts)) {
    throw new Error('这不是工作台支持的项目记录。');
  }
  if (value.designDecisions != null && (!Array.isArray(value.designDecisions)
      || value.designDecisions.some(item => typeof item.topic !== 'string' || typeof item.label !== 'string'
        || typeof item.consequence !== 'string' || !['accepted', 'provisional', 'superseded', 'needs_review'].includes(item.status)))) {
    throw new Error('项目记录中的设计决定无效。');
  }
  if (value.judgments.some(review => review.kind !== 'ai_review' || typeof review.id !== 'string'
      || typeof review.summary !== 'string' || !Array.isArray(review.interventions)
      || review.interventions.some(item => typeof item.id !== 'string' || typeof item.topic !== 'string'
        || typeof item.proposal !== 'string' || !['proposed', 'accepted', 'deferred', 'needs_review'].includes(item.status)))) {
    throw new Error('项目记录中的张翼审查无效。');
  }
  if (value.evidence.some(item => typeof item.id !== 'string' || typeof item.note !== 'string'
      || typeof item.at !== 'string' || !['build', 'run', 'playthrough', 'playtest'].includes(item.type)
      || !['user', 'ai', 'log'].includes(item.source)
      || !['current', 'needs_review'].includes(item.status)
      || (item.degraded != null && typeof item.degraded !== 'boolean'))) {
    throw new Error('项目记录中的可玩证据无效。');
  }
  if (value.input.entries.some(id => !ENTRY_POINTS.some(item => item.id === id))) {
    throw new Error('项目记录含有未知入口。');
  }
  if (value.playtests != null && (!Array.isArray(value.playtests)
      || value.playtests.some(item => typeof item.id !== 'string' || typeof item.at !== 'string'
        || !item.sample || typeof item.sample.origin !== 'string' || typeof item.sample.caliber !== 'string'
        || typeof item.sample.size !== 'number'
        || !Array.isArray(item.facts) || !Array.isArray(item.conclusions) || !Array.isArray(item.suggestions)
        || item.facts.some(f => typeof f !== 'string') || item.conclusions.some(c => typeof c !== 'string')
        || item.suggestions.some(s => typeof s !== 'string')
        || !['current', 'needs_review'].includes(item.status)
        || (item.degraded != null && typeof item.degraded !== 'boolean')
        || (item.unsupported != null && typeof item.unsupported !== 'boolean')))) {
    throw new Error('项目记录中的试玩记录无效。');
  }
  for (const topic of ['route', 'focus']) {
    const decision = value.decisions[topic];
    if (decision && (typeof decision.id !== 'string' || typeof decision.label !== 'string'
        || !['accepted', 'needs_review'].includes(decision.status))) {
      throw new Error('项目记录中的选择状态无效。');
    }
  }
  const { route, focus } = value.decisions;
  if (route?.status === 'accepted' && !routeOptions(value).some(option => option.id === route.value)) {
    throw new Error('当前路线与项目入口不匹配。');
  }
  if (focus?.status === 'accepted' && (route?.status !== 'accepted' || focus.dependsOn !== route.id)) {
    throw new Error('第一份作品的重点与起步路线不一致。');
  }
  return clone(value);
}

const safe = text => String(text ?? '').replace(/\r/g, '').trim();
const quote = text => safe(text).split('\n').map(line => `> ${line || ' '}`).join('\n');
const shown = record => record ? `${record.label}（${record.status === 'accepted' ? '用户已选' : '需复核'}）` : '未定';
const designLines = state => (state.designDecisions ?? []).filter(item => item.status === 'accepted')
  .map(item => `- ${item.topic}：${item.label}。影响：${item.consequence}`).join('\n') || '- 尚无具体设计决定。';
const facts = state => {
  const lines = [];
  lines.push(`- 最初想法：${state.input.idea ? '见下方原话' : '未填写'}`);
  lines.push(`- 已有条件：${state.input.constraints ? '见下方条件' : '未记录'}`);
  lines.push(`- 带来的材料：${state.input.entries.map(id => ENTRY_POINTS.find(item => item.id === id)?.label).join('、') || '未标记'}`);
  lines.push(`- 游戏品类：${GENRE_OPTIONS.find(item => item.id === (state.input.genre ?? 'auto'))?.label ?? '待确认'}（独立于是否有现成工程）`);
  lines.push(`- 表现风格：${STYLE_OPTIONS.find(item => item.id === (state.input.style ?? 'none'))?.label ?? '未定'}（只影响表达，不决定胜负规则）`);
  lines.push(`- 起步路线：${shown(state.decisions.route)}`);
  lines.push(`- 第一份作品重点：${shown(state.decisions.focus)}`);
  return lines.join('\n');
};

function projectOverview(state) {
  const route = state.decisions.route;
  const focus = state.decisions.focus;
  return `# 项目总览\n\n> 项目记录 v${state.version} · 生成于 ${timestamp()} · 来源：zhangyi.project.json\n\n## 用户的原话\n\n${quote(state.input.idea || '尚未填写。')}\n\n## 已给出的条件\n\n${quote(state.input.constraints || '尚未单独记录。')}\n\n## 现在确定了什么\n\n${facts(state)}\n\n## 已确认的设计决定\n\n${designLines(state)}\n\n## 这会怎样影响第一份作品\n\n- 起步路线：${current(route) ? route.effect : '路线尚未确认，不能据此开工。'}\n- 第一份作品重点：${current(focus) ? focus.effect : '重点尚未确认；已有旧选择时需复核。'}\n\n## 证据与产物\n\n- 可玩小样：尚未生成或运行。\n- 真人试玩：尚无记录。\n- 正式裁决书：尚未形成。\n\n## 待决定\n\n${!current(route) ? '- 确认起步路线。\n' : ''}${!current(focus) ? '- 确认第一份作品重点。\n' : ''}- 制作前核实尚未明确的结束条件与目标环境；已给出的条件沿用。\n\n—— 张翼 Spread the Pinions · 项目总览 v${state.version}\n`;
}

function handoffDocument(state) {
  const route = state.decisions.route;
  const focus = state.decisions.focus;
  return `# 张翼开发交接\n\n> 项目记录 v${state.version} · 生成于 ${timestamp()} · 来源：zhangyi.project.json\n\n## 接手前先读\n\n${facts(state)}\n\n用户原话：\n\n${quote(state.input.idea || '尚未填写。')}\n\n用户已给出的条件：\n\n${quote(state.input.constraints || '尚未单独记录。')}\n\n## 可以依此推进的决定\n\n${current(route) ? `- ${route.id}：${route.label}。${route.effect}\n` : '- 起步路线尚未确认。\n'}${current(focus) ? `- ${focus.id}：${focus.label}。${focus.effect}\n` : '- 第一份作品重点尚未确认。\n'}${designLines(state)}\n\n## 不能擅自补成事实\n\n- “需复核”的旧选择不是当前指令；详见结构化项目记录的 history。\n- 已给出的引擎、目录和素材条件不得改写；未给出的胜负条件、数值、美术范围与发布时间仍需决定。\n- 尚无本次新游戏的运行证据或真人反馈，不要声称新游戏已经可玩或玩法已经好玩。\n\n## 下一步交付与验收\n\n${current(route) && current(focus) ? '- 围绕已选路线和重点，给一版能让用户反应的草案；只提下一道会改变玩家体验的选择题。' : '- 先让用户确认标为未定或需复核的方向，不要据旧选择开发。'}\n- 若用户要求可玩物，制作后实际检查输入、结果、结束与重开，并回写运行证据。\n- 每项新决定写回项目记录，更新版本，再生成文档。\n\n—— 张翼 Spread the Pinions · 开发交接 v${state.version}\n`;
}

function exportFiles(state) {
  const valid = validateProject(state);
  return [
    { name: 'zhangyi.project.json', type: 'application/json', content: `${JSON.stringify(valid, null, 2)}\n` },
    { name: '项目总览.md', type: 'text/markdown', content: projectOverview(valid) },
    { name: '开发交接.md', type: 'text/markdown', content: handoffDocument(valid) },
  ];
}

// 内容包只提供品类判断；项目路线、现成工程、风格是独立条件。
const choice = (value, label, effect) => ({ value, label, effect });

const TACTICS_PACK = {
  schemaVersion: 1,
  id: 'genre.tactics',
  axis: 'genre',
  value: 'tactics',
  title: '战棋或战术策略',
  shortTitle: '战棋',
  status: 'complete',
  boundary: '离线设计预设；不推断工程功能、实际平衡或玩家喜好。',
  review: {
    title: '战棋首局先证明位置与行动真的改变结果',
    detail: '按已选目标制作一局，检查玩家能否看懂敌方威胁、完成一次有后果的走位，并看到胜负原因。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('hold', '守住一处目标', '玩家在有限回合内调动单位，守住地图上的关键位置；目标坚持到倒计时结束算胜，目标失守算败。'),
      choice('escort', '护送目标抵达出口', '玩家开路并保护会移动的目标；目标抵达出口算胜，途中被击倒算败。'),
      choice('defeat', '击败指定对手', '玩家利用走位与行动次序处理关键敌人；目标敌人倒下算胜，己方失去继续行动能力算败。'),
    ],
  },
  questions: [
    {
      id: 'tactics_action', group: '战棋第一局', topic: '战棋回合抉择',
      prompt: '每回合让玩家最先纠结哪一件事？',
      why: '同样是走格子，真正值得玩的取舍可能完全不同。先定一种，地图和敌人再围绕它设计。',
      options: [
        choice('position', '站位：现在抢位置还是先避开危险', '让安全位置与关键位置无法同时占有；玩家移动后，敌人的威胁范围应立刻可见。'),
        choice('action', '行动次数：现在进攻还是留下机会应对', '每回合只能完成有限动作；用掉行动后，玩家要承担无法补救的风险。'),
        choice('team', '队友配合：谁先行动才能帮到另一个人', '两个单位的行动顺序会改变彼此机会；首版只需一组能看懂的配合。'),
      ],
      recommended: 'position', depth: 'deep', when: 'tactics', dependsOn: ['首局目标'],
    },
    {
      id: 'tactics_terrain', group: '战棋第一局', topic: '地形作用',
      prompt: '第一张地图里，地形主要改变什么？',
      why: '地形要迫使玩家改变走法，不能只是一张漂亮棋盘。',
      options: [
        choice('cover', '躲避：站在掩体后更安全', '掩体要有明显边界；敌人应能绕开或逼玩家离开。'),
        choice('route', '路线：绕远路更安全，近路更快', '玩家在回合压力下选择路线，地图不需要很大。'),
        choice('height', '高低差：占据高处更有利', '高低差要改变攻击或视野；需要额外说明和表现成本。'),
      ],
      recommended: 'route', depth: 'deep', when: 'tactics', dependsOn: ['首局目标', '战棋回合抉择'],
    },
    {
      id: 'tactics_opponent', group: '战棋第一局', topic: '敌方回应',
      prompt: '敌方第一局怎样逼玩家调整原计划？',
      why: '只会原地挨打的对手，无法检验站位或行动次序是否真的有意思。',
      options: [
        choice('telegraph', '先亮出下一步威胁，给玩家一回合应对', '玩家能看见危险，再决定移位、阻挡或抢先处理。'),
        choice('pressure', '朝关卡目标推进，迫使玩家分兵', '敌人威胁的是任务目标，不只是己方生命值。'),
        choice('counter', '针对玩家刚用过的战术改变站位', '应对更灵活，但敌方逻辑和可读性成本都更高。'),
      ],
      recommended: 'telegraph', depth: 'deep', when: 'tactics', dependsOn: ['首局目标', '战棋回合抉择'],
    },
  ],
  prototype: {
    loop: '玩家看见目标与威胁 → 给两名单位下指令 → 敌方按可见意图回应 → 显示局势变化 → 达成胜负并能重开。',
    missions: {
      hold: '占位场景：两名单位守住一处路口，敌人从两条路线逼近；玩家先决定谁占安全位置、谁去堵近路。每回合显示敌方下一步威胁，目标坚持到倒计时结束则胜，敌人占领路口则败。',
      escort: '占位场景：一名单位开路，另一名保护需要撤离的人；玩家在短而危险的路线与安全但耗时的路线之间选择。敌方威胁先亮出，目标抵达出口则胜，途中被击倒则败。',
      defeat: '占位场景：两名单位面对一名关键敌人与一名阻路者；玩家决定先清路还是绕行抢占攻击位置。敌方下一步攻击范围可见，关键敌人倒下则胜，己方无法继续行动则败。',
    },
    acceptance: [
      '首局只有一种明确胜利目标和一种明确失败条件。',
      '至少一次站位或行动顺序的选择能改变结果，并给出玩家看得见的反馈。',
      '敌方威胁在玩家行动前可读；失败后能指出是哪一步导致目标失守。',
      '在目标设备上从开局玩到胜或负，再完成重开。',
    ],
    defer: ['职业树、养成线和大量兵种', '多张地图或完整战役', '未改变玩家行动的复杂地形与随机词条'],
  },
};

const MANAGEMENT_PACK = {
  schemaVersion: 1,
  id: 'genre.management',
  axis: 'genre',
  value: 'management',
  title: '经营或养成',
  shortTitle: '模拟经营',
  status: 'complete',
  boundary: '离线设计预设；从公开经营品类拆解蒸馏，不代表已运行、已平衡或经玩家验证。',
  review: {
    title: '经营首局先证明正反馈够快、目标不靠任务清单搀扶',
    detail: '按已选目标制作一局，记录玩家每次行动后多久看见积累；引导结束后不打扰观察，玩家仍有自发行为才算目标感成立。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('order', '完成一份有条件的订单', '玩家安排有限资源满足需求；按时交付算胜，期限内未完成算败。'),
      choice('shortage', '撑过一次资源短缺', '玩家重新分配人手或物资；维持关键服务算胜，核心资源耗尽算败。'),
      choice('tradeoff', '在两位顾客之间做取舍', '玩家选择优先满足谁并看见后果；守住本轮目标算胜，失去必要条件算败。'),
    ],
  },
  questions: [
    {
      id: 'mgmt_control', group: '经营第一局', topic: '经营视角',
      prompt: '玩家直接下指令，还是改变条件看小人自己生活？',
      why: '指挥模拟好做、上帝观察耐玩但成本高；先定一种，小人的智能做到哪一步才有边界。',
      options: [
        choice('direct', '指挥模拟：玩家直接安排生产与人手', '每个行动很快兑现成积累；小人的自主表现第一版只做最轻量反应。'),
        choice('observe', '上帝观察：玩家改条件，小人自己过日子', '世界感和陪伴感更强，但需要自主行为库，第一版成本明显更高。'),
        choice('mix', '先指挥，把自主行为留作后续扩展', '首局按指挥模拟验收；结构上别把小人写死成纯图标。'),
      ],
      recommended: 'direct', depth: 'deep', when: 'management', dependsOn: ['首局目标'],
    },
    {
      id: 'mgmt_goal', group: '经营第一局', topic: '目标驱动',
      prompt: '引导期结束后，玩家靠什么知道自己接下来要做什么？',
      why: '任务清单一停玩家就失焦，是经营品类最典型的失败模式；目标系统要有生命周期。',
      options: [
        choice('staged', '分阶段：教学期任务引导，之后退为成长参照', '任务只承担引导、演示和奖励；驱动逐渐交给玩家自建的收集、装饰或成就目标。'),
        choice('tasks', '一直用任务清单推着走', '实现简单，但任务断档时玩家立刻失去方向，长线风险高。'),
        choice('self', '尽早交给玩家自建目标', '适合有耐心的小众玩家；对大盘新手过于苛刻，需要更强的目标提示设计。'),
      ],
      recommended: 'staged', depth: 'deep', when: 'management', dependsOn: ['首局目标', '经营视角'],
    },
    {
      id: 'mgmt_pressure', group: '经营第一局', topic: '失败与压力',
      prompt: '玩砸了的代价是什么？',
      why: '经营品类的主流定位是低压；惩罚过重会和玩家来这里的动机直接冲突。',
      options: [
        choice('soft', '软压力：时限和损耗制造取舍，但不一夜清零', '订单过期、原料腐坏让玩家权衡先后；失败是一局的结算，不是存档的毁灭。'),
        choice('none', '不设硬性失败：错了只是慢，不会亏', '最贴合休闲定位；但首局验收要另找明确的完成标志。'),
        choice('hard', '硬性失败：破产或流失直接清零重来', '压力清晰，但与经营玩家寻求的低压代偿冲突，首版慎用。'),
      ],
      recommended: 'soft', depth: 'deep', when: 'management', dependsOn: ['首局目标'],
    },
    {
      id: 'mgmt_pacing', group: '经营第一局', topic: '生产节奏',
      prompt: '生产要不要在玩家离线时也继续？',
      why: '离线生产是可移植的放置属性，改变整个节奏设计；若核心是重置型长线（prestige/转生/换蛋）＋产能成本跷跷板，属增量挂机品类包（genre.idle），不归本题。第一版先验证主循环，再决定是否引入。',
      options: [
        choice('realtime', '短局内实时：一局内完成从生产到交付', '反馈链最短，最适合验证主循环是否成立。'),
        choice('idle', '离线与在线都持续生产', '定位接近电子盆栽；需要离线收益、容量与回归节奏设计，属后续扩展。'),
        choice('hybrid', '局内实时为主，离线给少量保底收益', '折中；但两套节奏都要调，第一版工作量翻倍。'),
      ],
      recommended: 'realtime', depth: 'deep', when: 'management', dependsOn: ['首局目标'],
    },
  ],
  prototype: {
    loop: '玩家看见需求与现有资源 → 安排生产或人手 → 收获并交付 → 用收益扩张或解锁 → 出现新需求，直到达成首局目标或失败，可重开。',
    missions: {
      order: '占位场景：一块田、一台加工设备、一位带期限的订单顾客；玩家排产、收获、加工并按时交付，收益用来解锁第二块地。订单过期则本局失败，失败原因在结算画面可见。',
      shortage: '占位场景：关键原料突然减半，玩家在三项开支之间重新分配人手与库存，撑到下一批补给抵达；核心服务中断算败，撑过去算胜。',
      tradeoff: '占位场景：两位顾客同时提出互斥需求，资源只够满足一方；玩家选择优先谁，并立刻看见被放弃一方的具体后果，本轮目标达成算胜。',
    },
    acceptance: [
      '首局只有一个明确交付目标和一种明确失败条件，失败原因在结算时可见。',
      '玩家每个行动都很快看见积累或后果，没有大段无反馈的等待。',
      '引导结束后不打扰观察，玩家仍有自发行为，而不是停着等任务。',
      '首局内的副系统（如有）产出必须回到主循环，不存在数值脱钩的摆设系统。',
      '在目标设备上从开局玩到胜或负，再完成重开。',
    ],
    defer: ['仓库容量等付费点与回归激励', '复杂养成线（装备、天赋、英雄）', '社交系统与多玩法缝合', 'NPC 完整自主行为库与追踪系统', 'UGC 与交易市场'],
  },
};

const GAMBLING_PACK = {
  schemaVersion: 1,
  id: 'genre.gambling',
  axis: 'genre',
  value: 'gambling',
  title: '棋牌、赌局或心理博弈',
  shortTitle: '棋牌博弈',
  status: 'complete',
  boundary: '离线设计预设；从公开牌局与构筑品类拆解蒸馏，不代表已运行、已平衡或经玩家验证。',
  review: {
    title: '牌局先证明博弈链成立，而不是数值面板',
    detail: '按已选目标制作一局，让玩家在不执行的情况下说出这一步的结果与赌注；检查随机是否抢走掌控感、新手是否存在易学的获胜路径。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('read', '识破一次对手的破绽', '玩家观察、下注并验证判断；识破破绽算胜，误判导致本局失利。'),
      choice('risk', '押上一件重要资源', '玩家在继续与止损之间取舍；守住资源或赢得目标算胜，押注失败算败。'),
      choice('rule', '利用一条公开规则反制对手', '玩家先学规则再找到反制时机；反制成功算胜，机会用尽算败。'),
    ],
  },
  questions: [
    {
      id: 'gam_axis', group: '牌局第一局', topic: '博弈主轴',
      prompt: '这局牌主要考玩家哪一种本事？',
      why: '信息博弈、资源构筑和心理博弈是三套不同的设计肌肉；先定主轴，规则深度才有投放方向。',
      options: [
        choice('info', '信息博弈：看清破绽和场面再行动', '把博弈设计成可识别的“操作点→信息点→收益点”链条；先验博弈（看到信号再动）最适合首局。'),
        choice('build', '资源构筑：管理手牌与资源求长期优势', '每回合给有限且可算清的选择；体系数量由单局选择次数反推，不要做宽。'),
        choice('mind', '心理博弈：读人、诈唬与反诈唬', '张力最强但素材与设计经验最薄；首版若要碰，先做单条诈唬线索而非整套心理战。'),
      ],
      recommended: 'info', depth: 'deep', when: 'gambling_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'gam_random', group: '牌局第一局', topic: '随机性位置',
      prompt: '随机出现在玩家决策之前还是之后？',
      why: '随机先于决策，玩家拿信息做判断；随机后于决策，玩家被结果牵着走。位置放错，掌控感就没了。',
      options: [
        choice('front', '前置随机：先亮关键信息再让玩家决策', '开局展示本局的关键变量（对手风格、地图、备选牌），玩家据此制定计划。'),
        choice('back', '后置随机：决策之后揭晓，丰富过程', '悬念更强，但玩家容易把输赢归因于运气而非判断，首版用量要克制。'),
        choice('minimal', '极少随机：接近纯计算的牌局', '策略深度最高，但容错低；要防两个互为最优的选择把博弈退化成死循环。'),
      ],
      recommended: 'front', depth: 'deep', when: 'gambling_genre', dependsOn: ['首局目标', '博弈主轴'],
    },
    {
      id: 'gam_opponent', group: '牌局第一局', topic: '对手与赛制',
      prompt: '第一版玩家和谁打、打几局？',
      why: '真人匹配、天梯和 META 治理是另一个量级的工程；先用可控对手验证博弈链本身。',
      options: [
        choice('ai_single', 'AI 对手单局：一局地打完整场胜负', '最快验证博弈链；对手行为规律要可被玩家观察和利用。'),
        choice('ai_series', '固定对手系列局：短程积分赛制', '能承载“放弃一局也是决策”这类取舍；内容与平衡成本随之增加。'),
        choice('pvp', '真人匹配对战', '首版不做：匹配、反作弊和 META 治理的成本会淹没玩法验证。'),
      ],
      recommended: 'ai_single', depth: 'deep', when: 'gambling_genre', dependsOn: ['首局目标', '博弈主轴'],
    },
    {
      id: 'gam_ai', group: '牌局第一局', topic: '对手智能',
      prompt: 'AI 对手“聪明”到什么程度？',
      why: '对手智能是最容易被高估制作量的部分；先选最浅的一档把博弈链验证成立，再加深。',
      options: [
        choice('plain', '纯规则出牌：按固定规则行动', '最省；博弈链成立前不投智能。'),
        choice('cheat', '作弊庄家加补偿规则', '庄家规则倾斜（只赢不停），配一条明规则补偿玩家；轻量但个性强，真实项目实证可行。'),
        choice('memory', '跨手记忆与标签反制', '记住玩家近期行为并调整应对；张力最强，制作与测试量最大。'),
      ],
      recommended: 'plain', depth: 'deep', when: 'gambling_genre', dependsOn: ['首局目标', '博弈主轴'],
    },
  ],
  prototype: {
    loop: '玩家看见公开信息、手牌与赌注 → 在有限选项中做一步决策 → 对手按可见规则回应 → 结算并显示胜负原因 → 可重开。',
    missions: {
      read: '占位场景：对手有一套可观察的行为规律（下注习惯、出牌顺序）；玩家先观察两轮拿到线索，再在关键局用线索识破一次破绽获胜；误判则付出本局赌注。',
      risk: '占位场景：玩家带一件重要资源入场，连续三局每局选择加码、保守或放弃本轮；放弃是合法决策且有明确代价，资源耗尽算败，达成约定目标算胜。',
      rule: '占位场景：一条公开规则对双方生效（如特定牌型的克制关系）；玩家前两局先吃一次亏学会它，第三局抓住反制时机获胜；机会用尽算败。',
    },
    acceptance: [
      '首局一种明确胜利条件与一种明确失败条件，胜负原因在结算画面可见。',
      '玩家不执行就能说出本次行动的结果与赌注；暗牌或心理博弈类至少要知道自己在赌什么、赌注多大。',
      '关键决策前玩家已拿到该得的信息，随机不剥夺掌控感。',
      '新手存在易学的获胜路径（基础打法），不靠暗调发牌或对手放水。',
      '在目标设备上从开局玩到胜或负，再完成重开。',
    ],
    defer: ['真人匹配、天梯与 META 治理', '暗调随机与隐蔽动态难度', '抽卡与付费决策点', '多体系扩张与跨版本内容管线', '皮肤商业化与赛事运营'],
  },
};

const ROGUE_PACK = {
  schemaVersion: 1,
  id: 'genre.rogue',
  axis: 'genre',
  value: 'rogue',
  title: '肉鸽或牌组构筑',
  shortTitle: '肉鸽构筑',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。牌组构筑归本包，牌局对战胜负归棋牌包。',
  review: {
    title: '肉鸽首局先证明失败可归因、死局有出路',
    detail: '按已选目标制作一局，检查玩家能否在看懂威胁后做一次构建取舍、失败后能否说出是哪一步输了，且始终有一条缓解死局的路径；制作时对照暂缓项，别先铺体系与局外成长。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('climb', '推进到本层终点并击败关底', '玩家在一条分层路线上选择节点、逐步强化牌组；击败本层 BOSS 算胜，牌组或生命耗尽算败。'),
      choice('threshold', '在有限出牌次数内达到分数门槛', '玩家用抽到的牌凑出尽可能高的牌型得分；达到当轮门槛算胜，用尽次数未达标算败。'),
      choice('survive', '在越来越强的波次里坚持若干回合', '玩家每轮用有限资源应对成批敌人；撑满约定波次算胜，被压垮算败。'),
    ],
  },
  questions: [
    {
      id: 'rogue_growth', group: '肉鸽第一局', topic: '成长动力',
      prompt: '玩家变强主要靠什么？',
      why: '加法靠稳定积累、乘法靠组合爆发；两者要求的数值空间与挑战抬升方式完全不同，先定一种再设计卡池和敌人。',
      options: [
        choice('additive', '加法：每张牌稳定加量，成长看得见', '曲线平稳、易读、易平衡；但后期数字天花板低，需要靠机制而非数值制造爽点。'),
        choice('multiplicative', '乘法：靠倍率叠乘把收益推高', '爆发爽点强、上限夸张；代价是数值通胀，挑战必须同步抬升，否则中期就失控。'),
        choice('mechanic', '机制驱动：变强来自牌之间的联动而非数值', '最耐玩也最难做；需要玩家能看懂联动，首版只做少量能连起来的核心件。'),
      ],
      recommended: 'additive', depth: 'deep', when: 'rogue_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'rogue_deck', group: '肉鸽第一局', topic: '牌组走向',
      prompt: '牌组做得精简还是做厚？',
      why: '这决定要不要给玩家删牌、拒牌这类控制手牌质量的手段；给不给，直接决定玩家能否避免死局。',
      options: [
        choice('thin', '精简：奖励删牌，追求稳定开出核心牌', '手牌质量可控，玩家有明确优化目标；需要提供删牌或跳过奖励的通道。'),
        choice('thick', '厚实：牌自然变多，鼓励临场即兴', '每局手牌都不同、变化更多；但要防牌组被稀释成靠运气，且玩家会要求拒牌权。'),
        choice('hybrid', '先精简，后期再放宽', '首版先让玩家尝到优化手牌的甜头，牌池扩张留到后续。'),
      ],
      recommended: 'thin', depth: 'deep', when: 'rogue_genre', dependsOn: ['首局目标', '成长动力'],
    },
    {
      id: 'rogue_random', group: '肉鸽第一局', topic: '随机与缓解',
      prompt: '随机出现的坏运气，玩家能用什么办法缓解？',
      why: '真随机与保证的能动性不可兼得，品类就活在这个缝隙里；玩家在「不知道怎么输的」时候最容易流失，缓解手段是首版必须给的。',
      options: [
        choice('draft', '抽牌三选一：每次都有得挑', '最省事的缓解法；但三选一本身会成为新的平衡点，选项差异要真实。'),
        choice('shop', '商店与重掷：花钱换掉不想要的', '给玩家明确的止损通道；需要一套货币与定价，工作量随之增加。'),
        choice('skip', '允许跳过奖励、主动删牌', '直接回应「牌组被稀释」的抱怨；实现最轻，但要防玩家把牌组删到太空洞。'),
      ],
      recommended: 'skip', depth: 'deep', when: 'rogue_genre', dependsOn: ['首局目标', '牌组走向'],
    },
    {
      id: 'rogue_meta', group: '肉鸽第一局', topic: '局外成长',
      prompt: '每局之间，玩家是否越玩越强？',
      why: '局外成长能让失败有事做，但也可能让玩家不确定赢是因为变强还是数值变高；首版先验证局内循环是否成立。',
      options: [
        choice('sideways', '只解锁更多花样，不加数值强度', '失败也有进展，又不模糊「玩得好不好」的判断；是本包的低证据推荐方向。'),
        choice('power', '每局攒资源永久变强', '拉长动力，但争议大：玩家可能觉得通关靠数值而非技术，还会让首局变得不公平。'),
        choice('none', '首版不做局外成长', '先验证单局是否好玩，避免用数值弥补设计问题；代价是失败的正反馈较弱。'),
      ],
      recommended: null, depth: 'deep', when: 'rogue_genre', dependsOn: ['首局目标'],
    },
  ],
  prototype: {
    loop: '玩家看见路线与敌人意图 → 用有限出牌次数打出一手牌 → 结算伤害或分数并显示实时数值变化 → 从奖励里挑牌、删牌或跳过 → 带着更强的牌组进入下一节点，直到达成首局目标或失败，可重开。',
    missions: {
      climb: '占位场景：一条分叉路线（战斗／精英／商店／休息），玩家在节点间选路并逐步改牌；敌人下一步意图在行动前可见。击败本层 BOSS 算胜，生命或牌组耗尽算败，结算画面指出是哪一战拖垮了牌组。',
      threshold: '占位场景：一副基础牌、一个当轮分数门槛、有限次出牌与弃牌；每次出牌的牌型与倍率实时显示，玩家可在商店里升级单张牌。达标算胜，次数用尽未达标算败。',
      survive: '占位场景：敌人按波次逼近，玩家每波前可调整牌组与站位，资源（费用／生命）有限；被压垮算败，撑满约定波次算胜，失败时能看见最先崩掉的是哪一环。',
    },
    acceptance: [
      '首局只有一种明确胜利目标和一种明确失败条件，失败原因在结算时可见。',
      '敌人下一步意图在玩家行动前可读；没有战前不可见的随机惩罚直接决定生死。',
      '玩家至少做出一次构建取舍（挑牌、删牌、跳过或升级），且能看到它对下一局手牌的影响。',
      '玩家不执行也能说出这一步大概打出多少、为什么要这样打；数值变化实时可见。',
      '每次失败后玩家能说出是哪一步输的，且始终存在一条缓解不顺的路径。',
      '在目标设备上从开局玩到胜或负，再完成重开。',
    ],
    defer: ['数值成长型局外成长（晋升、天梯、永久加数值）', '多角色与多体系铺量（体系数由单局选择次数反推，首版先做 1 个角色、2–3 个体系）', '大量遗物、复合状态与随机词条', '高难挑战层、日常模式与排行榜'],
  },
};

const GUOFENG_PACK = {
  schemaVersion: 1,
  id: 'style.guofeng',
  axis: 'style',
  value: 'guofeng',
  title: '古风（武侠、仙侠、国潮）',
  shortTitle: '古风',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。只改呈现、文本与反馈，不定义胜负与回合规则。',
  presentation: {
    visual: '古风的第一顺位不是精致，是辨识度：先让玩家一眼认出「这是什么文化调性」，再谈考究。联想链条是「看到元素→常识性关键词→归因文化根源」，所以验收的是联想指向，不是用了多少传统元素——唤不起联想的元素等于没做。首屏就要打出最独特的文化符号（皮影、园林、祭祀一类），把最独特的视觉留在第一屏而非后期：新玩家对异域新鲜感的兴趣在第一屏处于峰值，慢热等于让多数人在被吸引前流失。流派先定一条再铺：写实考据（可信度优先、门槛与成本双高）、唯美写意（意境优先、易辨识度不足）、水墨留白（辨识度强、成本相对可控，独卖日常烟火也能立业）、国潮混搭（现代载体＋传统元素，最易两头不靠）。文化符号保持纯度，混入他国元素会稀释调性。角色与世界的调性冲突杀伤最大——角色是情感投射的锚点，商业化往里加卖点时要最先划角色侧的边界。',
    text: '文本要背负世界观表达，但每一处都要能读通：随机默认名不是填充物，是玩家遇到的第一场世界观考试——分水岭不在词汇雅不雅，而在语义连贯与题材一致，连词硬拼的名字会让玩家当场出戏。生僻字堆砌是伪逼格，只产生朗读障碍，不产生质感。验收可以很直接：连按十次随机，每个名字都像「属于这个世界的人或物」才算过关。有文化质感的随机名池靠管线量产不靠灵感：按题材选时代文献做语料库（诗词集出意象词与地名、史传出官职称谓），分词抽词后人工筛「百搭」词，定义少数几种组合模式当语法护栏，再按性别与气质分库。系统文案给每个新系统配一句剧情来历（修炼法是师父所授、秘境是上古修士所封），成本只是每个系统几句话，但世界沉浸感差一个档位。高门槛文化形式的说明要降门槛而不是加解说：保留文化的身份标识、把承载体换成大众形式，并先用普通剧情带玩家亲历，文化展演只承担情绪爆点。',
    feedback: '操作与状态反馈要「带文化味」，而不是套一层古风皮肤就完事：同样的点击、开箱、结算，用文化情境重构它（把点击开箱重构成连续敲门讨糖那样），低频冗余操作配上音效与动效反而做出情境感。反馈文案与文化语境要一致，避免现代网络语混入古风叙事造成调性违和。这条槽位证据偏薄（公开检索里缺同一玩法两种文化化反馈的对照），以下为外推的低证据方向：优先把资源和音效的反馈做进文化语境，纯数值飘字的可读性优先于文化修辞。',
  },
  verification: [
    '自由联想测试：把成品画面交给代表性用户看，收集第一反应关键词，检查联想是否稳定指向预期调性；唤不起联想或指向别处文化圈的元素，要么强化辨识度要么撤掉。同一元素在不同人群联想不同，联想测试要在目标市场分别做。',
    '维度化评分：把调性拆成可独立打分的感知维度（国风感、潮流感、异国风格联想、自豪感、故事性），让非玩家只看美术、逐维打分，用象限定位病灶——国而不潮（元素堆砌缺现代化改造）、潮而不国（辨识度不足或被异国联想污染）、双低带负面联想（土气、廉价），三种病灶处方不同不能互相顶替。',
    '移除法质检：拿掉这个文化元素，看体验是否塌了一块；若不塌，说明文化只是贴在表面上，文化没有被传达。',
    '随机名池质检：连按十次随机，逐个确认名字能读通成一个词组且意象统一；出一个废品就回炉词库。',
    '上述四条都必须交给目标市场的人实际看过、评过，不能只由设计者自评「我觉得传达到了」。评测结果与自评分开记录。',
  ],
};

const ANIME_PACK = {
  schemaVersion: 1,
  id: 'style.anime',
  axis: 'style',
  value: 'anime',
  title: '日式幻想／二次元',
  shortTitle: '二次元',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。只改呈现、文本与反馈，不定义胜负与回合规则。',
  presentation: {
    visual: '二次元的第一顺位不是「好看」，是「记得住」：好看取决于观者审美方向与呈现形式是否匹配，量化不了也争不出结论；记忆点却可以做成一道评审动作。玩家侧最集中的抱怨是堆料式设计——元素、标签繁多却毫无特点，所以宁愿只有一个突出的记忆点，其他元素都往低调收，把视觉重心留给那一个点。人设不是单张立绘，要能「跨语境存活」：游戏镜头、缩略图、二创、周边里都要认得出来。四个流派先定一条再铺：角色驱动（角色是唯一能抵系统债的资产，玩家会为一流人设容忍糟糕关卡）、演出驱动（靠镜头与景别管理视线）、立绘换装驱动（验收规格是「情景剧照」而非「单人艺术照」，服装要承载身份、历史与世界观）、萌属性驱动（每条属性必须二选一地对原型起作用——强化或反差，不能是装饰）。角色与世界调性冲突的杀伤力最大，角色是情感投射的锚点，商业化往里加卖点时要最先划角色侧的边界。',
    text: '文本要服务人设，而不是辞藻：人设按三层施工——人物原型定内核（少数几个人格维度的极端值组合）、萌属性定外在辨识度、原动力定内在动机（角色想要什么、这个欲求来自哪段经历），三层缺一角色就会塌成套路模板。命名是可被玩家解码的压缩信息包，一个名字可以同时编码出身阶层、性格、主题与人物原型；随机默认名是世界观考试，语义要连贯、意象要统一。角色的记忆点来自背景里的冲突性转变——顺当可预料的一生看一遍就忘，传记要按冲突密度分配篇幅，只详写改写本质的那个转折点。角色内心的剧烈波动最好交给无台词的身体细节，而不是写成台词。多角色要当一组来设计（先按队伍人数领一个已验证的职能模板），不要一个个捏完再回头查同质化。人设的最终验收在机制层：每条性格特征都要能被翻译成一条玩家可操作的玩法能力，翻译不出来就说明它停在文本里。',
    feedback: '反馈要让人设「活」起来，而不是让立绘随说话人频闪——那是玩家侧真实抱怨过的「像舞厅频闪」。用镜头与景别变化管理视线与心理距离：变焦制造秘密感、甩镜在多人对话里让玩家跟得住说话人、插入物（道具特写）打断长对话，这些比加 CG 便宜；固定镜位是传统做法，但角色间距离本身可以暗示关系。角色内心的波动交给身体细节承载，不写成台词。这条槽位证据偏薄（缺同一玩法两种二次元化反馈的对照），以下为外推的低证据方向：优先把镜头、音效与表情反馈做进人设语境，纯数值飘字的可读性优先于演出修辞。',
  },
  verification: [
    '剪影测试：把角色填成纯黑、缩到缩略图大小，还能认出是谁、什么情绪吗？认不出就简化并夸张轮廓。',
    '记忆点移除测试：遮住那个记忆点，角色是否立刻变得普通？若遮不遮都一样，说明记忆点还没找到；反过来若拿掉某特征毫无违和，说明该特征多余。',
    '五秒描述测试：让人看五秒后描述这个角色，看不出角色定位说明只做了好看、没做记忆点。',
    '跨语境存活：在游戏镜头、缩略图、二创、周边等不同语境下都要认得出来。',
    '风格统一与色准：cel shading 的平涂色在实机光照下不被冲淡；UI 与场景调性不割裂；不被读成别的文化圈的刻板印象。',
    '上述五条都必须交给目标用户实际看过、评过，不能只由设计者自评「我觉得画得挺好」。评测结果与自评分开记录。',
  ],
};

const WESTERN_FANTASY_PACK = {
  schemaVersion: 1,
  id: 'style.western-fantasy',
  axis: 'style',
  value: 'western-fantasy',
  title: '西幻（中世纪奇幻、低魔与史诗）',
  shortTitle: '西幻',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。只改呈现、文本与反馈，不定义胜负与回合规则。与古风、赛博朋克、二次元的判据落在呈现语法上：自然主义与材质可信度归本包，程式化与记忆点夸张归二次元，文化根源指向东亚归古风。',
  presentation: {
    visual: '西幻的第一顺位不是「考据得准不准」，是「这个世界是不是自己的」：骑士、城堡、修道院、龙与魔法已经是全世界玩家的共同默认值，所以「像西幻」不构成卖点，「是哪一个西幻」才是。默认值不是偶然——它源于可预期性，玩家以为知道自己将要面对什么，熟悉感降低了理解成本；代价是这层熟悉会同时压掉辨识度，且它包裹的不只是建筑与地貌，还有技术水平、封建结构、宗教比重乃至魔法的形式，要走出去就得成体系地换一整套，不是改几个地名。第一动作是先定身份：找出项目的主题与灵感来源、什么让它独一无二，再让每件资产看起来都属于同一套语法，并用收窄的色板（一份主色板加一份辅助色板）建立视觉层级——目标不是色彩丰富，是「看三个不同场景能认出同一个世界」。优先连贯，不优先单件精彩：一件资产再美，若不属于既定语法，就是在减分；拼装感（各件单看不错、合起来不像一个世界）是这条路最典型的塌法。可读性优先于繁复：剪影要承担功能性辨认（职业、体型、威胁等级），把敌人填成纯黑缩到实机尺寸仍要读得出；调性统一不能压过可读性，为了统一色调整把敌人、NPC 与可交互物糊进环境，是功能性失败而非审美分歧。四条路线先定一条再铺：写实低魔（材质可信优先，但写实会被拿去和 3A 比，也最吃管线）、史诗高魔（超自然规模与有来源的魔法体系建身份，色彩最张扬也最易符号泛滥）、黑暗哥特（衰败与压迫建身份，灰暗必须绑在叙事节拍上，当默认底色就会单调到劝退）、精致插画／蚀刻版画（独特手绘语法建身份，资产少但风格强，天然规避 3A 通用感，小团队最可控）。氛围手段要有节奏：同一种压抑若不作叙事绑定而笼罩一切，玩家的判词会是「泛泛的中世纪奇幻」并因此弃坑；反之把压迫做进地理与政治的具体关系里（村庄、运输、城堡都排在某个权威之下），世界才会被读成「一个地方」而不是无限扩张的奇幻大陆。',
    text: '文本要背负世界观，但每一处都要能读得通：命名服从「在动态中被使用」这一事实——玩家会念它、记它、在速记里缩写它，所以先读得懂、再有诗意。两条硬纪律：玩家可见的头衔与背景名若需要一段脚注才解释得清其社会职能，它属于设定笔记、不属于玩家可见的界面；别让一个种族标签独自背负全部文化身份，种族定音系、地域文化给质感、个人背景交代个体如何在此社会中行走。给每个文化两三个可识别的词尾，让玩家见过几个例子后能感到同源，并给混血、流亡、外域收养这类例子留出合法例外，别把命名系统做成不许动的博物馆展柜。随机默认名是世界观的第一场考试，与古风包同构：验收很直接，连按十次随机，每个名字都要像一个能读通、且意象属于这个世界的人或物。最大的文本风险不是词汇不够雅，是 lore 倾倒与术语过载：把设定当说明书写给玩家背，玩家会「像在备考」，正确的姿态是只揭示当下相关或足够费解的内容，让世界的重量从水面下透出来而不是一次摊开。最后，世界观设定是玩法结构的解释书而非氛围装饰清单：给每条设定写一行「它解释了什么」，答不出功能问题的条目要么删掉，要么明确降级为装饰与彩蛋；设定集里逻辑自洽只是及格线，规则要在物体、环境、人物三类交互里产生看得见的后果才产生代入感。',
    feedback: '反馈层证据偏薄：公开检索里没拿到「同一玩法两种西幻化反馈」的对照，以下为外推的低证据方向，只给方向不给默认推荐。方向一，界面与反馈的关键不是极简、是规则一致——若信息存在，它就必须在虚构里有处安身（血条长在角色身上、地图是实体物件），当世界能干扰界面时沉浸才成立；可用的自检来自界面设计方法论（非厂商实测）：做一个「打破 UI」测试，问世界能否影响这个界面，若答案是「不能」（护甲上的血条不会受损、全息地图不会被遮住），它就不是系统性的、只是装饰。方向二，反馈要贴在实体上或用世界内的光与声表达，而不是飘在屏幕中央，信息映射到可信的世界成因、并用冗余覆盖色盲与遮挡风险。方向三，无论走哪条路，反馈文案的语域要与世界观一致（避免现代网络语混入），且纯数值飘字的可读性优先于修辞——可读性是硬线，文化修辞是软线。这条槽位如实标注为低证据，不得用常识冒充来源。',
  },
  verification: [
    '身份测试：把三个不同场景并排给人看，能否认出它们属于同一个世界？认不出说明资产在拼装，而不是在构建一个世界。',
    '联想指向测试：把成品画面交给代表性用户看，收集第一反应关键词，检查是否稳定指向「本作自己的那个西幻」而非「泛泛的中世纪奇幻」；若稳定指向后者，等于这个风格没做。同一元素在不同人群联想不同，测试要在目标市场分别做。',
    '色板收窄检查：项目存在写明的主色板与辅助色板，且三屏随机抽查都在色板内；跑出色板即视为语法失守。',
    '剪影可读性检查：把角色与敌人填成纯黑、缩到实机尺寸，仍能读出职业与威胁等级；读不出就简化并夸张轮廓。',
    '对比度可读性测试：在目标光照与典型移动速度下（不是静止截图）能分辨敌人、NPC 与可交互物；把敌人、NPC 糊进环境属于功能性失败。',
    '命名质检：连按十次随机名，逐个确认能读通成一个词组且意象统一；玩家可见的头衔若需要脚注才明白其社会职能，即判不合格。',
    '上述六条都必须交给目标市场的人实际看过、评过，不能只由设计者自评「我觉得很有史诗感」。评测结果与自评分开记录。',
  ],
};

const CYBERPUNK_PACK = {
  schemaVersion: 1,
  id: 'style.cyberpunk',
  axis: 'style',
  value: 'cyberpunk',
  title: '赛博朋克（近未来、义体与巨型企业）',
  shortTitle: '赛博朋克',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。只改呈现、文本与反馈，不定义胜负与回合规则。与相邻风格包的划界落在呈现语法与技术底座上：自然主义与材质可信度归西幻，程式化记忆点夸张归二次元，文化联想指向东亚传统归古风；数字/网络/义体底座归本包，蒸汽机械或黄铜维多利亚归朋克旁支。',
  presentation: {
    visual: '赛博朋克的字面配方（霓虹、雨夜、义体、巨型企业）已经被用烂到构成品类惯性的程度，所以「做得很赛博朋克」不是加分项、是入门门槛。真正的分界线只有一条，出自一手准则：一个塞满「看起来很未来之物」的环境不是赛博朋克，那只是科幻——判据是未来技术与旧日日常的并置（破败建筑装着老旧木门，门上却嵌着 LED 门禁；老式餐馆用现代设备点单）。第二顺位是反差必须被叙述出来，而不是只被布景：赛博朋克本身就建立在熟悉感与社会恐惧之间的对比上，世界要能让人读出「谁在这里、谁建了这里、谁进不来」。可复制的做法是把城市写成一条可辨认的编年史——按紧缩、媚俗、企业军事化、新媚俗这几个时代层分配建筑与物件，让玩家不用对白就能从一栋楼的形状读出一个时期的钱与权；只要各区域风格真的不同，玩家就永远认得出自己在哪，反之如果到处都是同一种建筑，城市很快就无聊了。第三顺位是留白与落点：这是被一手承认过的翻车点——广告、霓虹、垃圾、建筑颜色堆得过密、缺少留白时，玩家的视线反而更难找到重点，后续内容正是靠新订的颜色与形状组合规则和留白方式才做到「更细却更不乱」；所以场景评审该问的是「这是什么地方、干什么用的、眼睛第一落点在哪、落点把人带去哪」，不是「够不够精细」。雷同自检同样不可省：把本作截图与最常被拿来比较的两三部作品并排，必须能说出刻意保留的差异点，说不出的就不算过关——这个类型最典型的塌法就是变成又一员「同一套红紫霓虹、同样棱角线条」的静态复刻。四条路线先定一条再铺：经典霓虹都市（纵向压迫建身份，但最易撞进雷同区）、日光／非典型配色（用「本该阴暗的题材偏要晴天」反刻板印象，代价是失去默认氛围的免费加成）、时代分层编年史（用可辨认的年代层建身份，代价是先写死一条时间线）、刻意跳开标准图像（用不像赛博朋克的赛博朋克建身份，需要更强的作者意图）。',
    text: '文本的第一道关是语域可信，不是黑话数量：玩家侧最集中的原话差评是「像让一个十四岁小孩写硬汉台词」，症结在语域而不在有没有黑话——把台词读出来，要像「这个人会说的话」，而不是「作者想让他显得酷」，这是最省钱的验收动作。黑话可以做，而且做得好是分层工具：让出身与阶层对应不同的说话方式（街头人懂街头黑话、企业人用精确术语与委婉语、边缘人说话直白），并让语言本身携带权力关系——用被动语态与中性化措辞掩盖责任，是比任何设定文本都省的解释。术语要服从「在动态中被使用」这一事实：核心词在正常对白里要能被反复使用而不显笨重；任一关键术语若需要一段解释才明白其社会职能，就应改掉或降级为设定笔记。世界观信息优先交给空间与物件，而不是对白：能靠一栋楼的年代、一段街区的贫富读出来的事，就不要用一段台词讲，这与古风包、二次元包同构——能靠场景说的，别塞进文本。最后一层是防 lore 倾倒：技术设定、企业编年史、义体原理都是耐用品，但一次摊开会让玩家像在备考；只揭示当下相关或足够费解的部分，让世界的重量从水面下透出来。语言学层面还有一条可借的手法（单条分析来源、非一手访谈，属外推方向）：故意保留一部分不翻译的语言，用「语言不对称」复现局外人的疏离感，并顺带把「只有买得起接入权的人才能全懂」做成一件事——若采用，须先在自家文本上验证玩家读得下去。',
    feedback: '反馈层证据偏薄：公开检索里没拿到「同一玩法两种赛博朋克化反馈」的对照，以下为外推的低证据方向，只给方向不给默认推荐。方向一，界面要么藏、要么长在世界里、要么风格化到成为记忆点——判据是「玩家操作界面的动作本身是否在扮演角色」，且风格必须与主题同源才成立，否则只是一层贴皮滤镜（这是「美学成为王」这一类型通病最直接的可操作反面）。方向二，信息密度由操作负担决定，不存在统一的「简洁信仰」：低操作密度的沉浸向作品可以减少 HUD，高操作密度的作品必须给足信息；赛博朋克默认以为该做极简，但那是沉浸向的做法，硬套会把可读性削掉。出海还要多叠一个维度：界面「简洁」的标准是分市场的，不能用本国审美当基准线。方向三，反馈文案的语域要与世界观一致，不混入现代网络语，且纯数值反馈的可读性优先于题材修辞——可读性是硬线，题材修辞是软线。这条槽位如实标注为低证据，不得用常识冒充来源；检索中多篇博客提到的「声音是半个战场」因无可核查作者与方法，一律未采信。',
  },
  verification: [
    '并置测试：截图里必须能指出至少一处「未来技术与旧日日常同框」的具体实例（旧物上装着新东西）。若全屏都是未来感物件、一件旧日日常都找不到，判为「只是科幻」，不是赛博朋克。',
    '反差测试：能否从场景本身读出「谁在这里、谁建了这里、谁进不来」？只靠标签或说明文字才能读出阶层关系的，判不合格。',
    '空间辨认测试：把两个不同区域的截图并排给人看，能否立刻说出它们不是同一个地方？认不出说明区域之间只剩配色差别，城市很快就会无聊。',
    '留白与落点测试：对场景逐个回答「这是什么地方、干什么用的、眼睛第一落点在哪、落点把人带去哪」四问；答不出即视觉噪音过量，回炉重新分配霓虹与细节。',
    '雷同自检：把本作截图与最常被拿来比较的两三部作品并排，能否说出刻意保留的差异点？若只能说得出配色不同，或完全说不出，即判为又一员静态复刻。',
    '语域回读测试：把关键台词读出来，是否像「这个角色会说的话」而不是「作者想让他显得酷」？出现「十几岁小孩写硬汉台词」的手感即判不合格；同时逐个确认关键术语不需要脚注就能读懂其社会职能。',
    '上述六条都必须交给目标市场的人实际看过、评过，不能只由设计者自评「我觉得很赛博」。评测结果与自评分开记录。',
  ],
};

const STEAMPUNK_PACK = {
  schemaVersion: 1,
  id: 'style.steampunk',
  axis: 'style',
  value: 'steampunk',
  title: '蒸汽朋克与柴油朋克（维多利亚机械、两战之间）',
  shortTitle: '蒸汽朋克',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。只改呈现、文本与反馈，不定义胜负与回合规则。与技术底座划界：蒸汽／黄铜／维多利亚与柴油／钢铁／两战之间同属本包（柴油是包内时代分叉）；数字／网络／义体归赛博朋克，不属本包。与相邻风格包按年代与材质分：自然主义中世纪的石材与织物质感归西幻，东亚文化联想归古风，程式化记忆点夸张归二次元。',
  presentation: {
    visual: '蒸汽朋克的语法是「看得见的机械」，不是「黄铜齿轮贴图」：一台机器必须能让人看出它怎么运作——齿轮在明处啮合、活塞在透明壳里推、蒸汽从阀门喷出来，机械原理本身就是装饰。所以第一条硬规则是齿轮必须正确啮合、齿要对齐、速比要合理，与任何东西都不相连的纯装饰齿轮是被点名的「懒人蒸汽朋克」标志；每处机构都该是带输入与输出的机械链条的一环。第二条是材质诚实：黄铜就得像黄铜、木头就得像木头，没有任何东西是塑料覆面的，而金属的处理方式直接编码社会阶层——镜面抛光黄铜是贵族与装饰、拉丝黄铜是专业与实用、带铜绿是做旧与失修、黑铁是工业与军用、发蓝钢是精密器械、铜是管路与导电件。第三条是先定功能再叠装饰：先确定这件东西用前电子技术怎么完成它的任务（通信靠机械信号旗、气动管道或声学放大，计算靠发条齿轮与打孔卡），功能逻辑立住之后再加维多利亚装饰层，装饰的繁复程度对应物品的社会语境（军用克制、贵族繁复）。第四条是尺度要夸张并拥抱它：蒸汽与机械系统比电子件占地方得多，蒸汽朋克「电脑」可以塞满一间屋子、随身通讯器有手提箱大，这种超大是魅力的一部分、不要缩小。第五条是环境要先有真实维多利亚参考再叠加机械层（用真实的伦敦、巴黎、布拉格与工业城市照片作底，再加烟囱、管道、高架铁路、飞艇设施），并警惕最典型的两种塌法：一是「一切皆棕」——棕色是背景不是主题，墙、地、道具全是棕色会让整个房间变成视觉沼泽，必须引入至少一个刻意重复的强调色并用它承载含义（深绿=安全、绯红=危险、亮蓝=实验科技）；二是「元素散落但从未成整体」——飞艇、齿轮、机器人、管道样样都有却彼此不相干，那是拼贴不是世界。四条路线先定一条再铺：忠厚维多利亚（真实工业史打底、机械可信优先，门槛与考据成本最高）、浮空奇观（飞艇与浮空城建身份，最张扬也最易滑向主题乐园）、做旧工业（蒸汽、煤烟、锈蚀与昏暗建身份，代价是极易糊成棕色沼泽、最吃光照分层）、跨文化替代工业史（把维多利亚换成另一种文化的工业革命、用它自己的材料与形状建身份，最独特也最缺现成参考）。柴油朋克是同包内的时代分叉而非另一个包：分水岭不是配色而是时代与情绪——蒸汽朋克取材工业革命，底色是怀旧、企盼与对革新的乐观；柴油朋克取材两次大战之间，底色是极权、机械化战争与虚无，美术基调从黄铜齿轮换成钢铁、防毒面具、油污、坦克与无畏舰，主美学从维多利亚折衷主义换成 Art Deco（冲压金属、镀金薄壳遮着油腻机器——字面与隐喻都是）。柴油朋克在游戏中的实践证据显著少于蒸汽朋克，此路线的证据强度低于主干，如实标注。',
    text: '文本要背负「这个世界如何运转」，且每一处都要能读得通。命名服从「在动态中被使用」这一事实——玩家会念、会记、会在速记里缩写，所以先读得懂、再有时代腔。两条纪律：一是**别把年份当风格**——「题材≠美术／风格」，梦幻之星与质量效应同属太空科幻而美术天差地别，同理一个项目写「1890 年代」并不会自动产生蒸汽朋克，时代只是起点、机械语法才是卖点。二是维度的命名要落在**人们会怎么称呼这台机器**上，而不是物件的工程型号：玩家看到的是「那台会喘气的锅炉」而不是「Mark IV 型蒸汽增压器」，能给每个阶层配一套称呼方式（工人怎么叫、工程师怎么叫、贵族怎么叫）就比堆术语划算。界面上若出现铭牌、仪表标注、蓝图注记，它们是在世界内被阅读的文本，要与世界观同源（排版规范提示维多利亚常见做法是雕版铜版体、木活字显示体、黄铜铭牌字，但这是网页排版领域的通行做法外推，**本包标为低证据方向**，不作为默认推荐）。最后的边界与相邻风格包同构：能靠场景读出来的事就不要用文本讲——一台机器怎么运作，让玩家看出来比写一段说明书更有效；lore 倾倒会把玩家推进「像在备考」的状态，只揭示当下相关或足够费解的部分。',
    feedback: '反馈层证据单薄，且**本次检索中两条来源对同一问题给出了相反答案，本包不预设任何密度策略**。方向一（来源间有矛盾，故只提问题不定论）：界面该密还是该疏存在真实分歧——一派主张「保持高密度、刻意极繁，用尺寸、框住、光照与材质对比建立层级」，另一派主张「面板过密加小字在游玩中就是苦役，要限制每块面板可读元素的数量」；两派都不是厂商一手实测，所以本包只把它交回验证动作：让「眼睛第一落点在哪」成为评审问题，而不是替项目选一个答案。方向二（本包内采信度最高的一条）：界面要能在世界内安身，判据是「世界能否干扰它」——仪表可作进度指示、仪表盘可作输入、铆接板可作容器，前提是风格与主题同源；纯装饰性的仪表与开关（点亮却永远不变的「死控件」）会让玩家白费时间去试探然后受挫，要么删掉、要么给它一点真实作用、要么在视觉上退到背景。方向三：反馈要有机械因果的重量感，控制件的动作应让人感到阻力与后果（重按钮要压下去、拉杆要卡一下再回弹、指针要扫、阀门要按顺序亮起），而不是无重量地瞬间切换。方向四：可读性是硬线、时代腔是软线——无论走哪条路，关键数值与状态在目标光照下都要能分辨，深棕与黑如果不分层就会糊成一片（这条有独立的玩家侧原话佐证）。此槽位如实标注为低证据，不得用常识冒充来源。',
  },
  verification: [
    '齿轮啮合测试：把所有可见齿轮逐个检查——齿是否对齐、速比是否合理、是否处于一条有输入与输出的机械链条上？与任何东西都不相连的装饰齿轮，即判为「懒人蒸汽朋克」。',
    '机械可读性测试：给一个没看过设定的人看这台机器，他能否说出它大致是怎么运作、动力从哪来到哪去？说不出的说明机械只是贴图而非语法。',
    '强调色测试：把画面转灰阶或大幅降低饱和度后，安全区／危险区／特殊科技是否仍可区分？若整个画面在去色后糊成一片棕色，即判「一切皆棕」，需要引入并刻意重复至少一个强调色。',
    '整体性测试（对标失败案例）：把场景里所有蒸汽朋克元素列出来，逐条问「它和别的元素属于同一个世界吗」？飞艇、齿轮、机器人、管道样样齐全却彼此不相干的，即判为拼贴而非世界。',
    '社会阶层可读性测试：不看文字，能否从材质与金属处理方式（抛光黄铜／拉丝／铜绿／黑铁／发蓝钢）判断这件东西属于哪个阶层或用途？判断不出说明金属处理分级没建立。',
    '死控件排查：把所有可见的仪表、阀门、开关过一遍——点亮却永远不变、按了毫无反应的是什么？逐个决定删掉、给真实作用、或视觉退到背景；保留一批无反馈的控制件即判不合格。',
    '密度落点测试：对主要界面逐个回答「眼睛第一落点在哪、这个落点把人带去哪」；答不出即视为密度分配失败。本包不预设高密度或低密度，只要求能回答这个问题。',
    '回读测试（文本）：把关键术语与台词读出来，确认不需要脚注就能明白这台机器或这个物件在社会里是干什么用的；出现「像在备考」的术语过载即判不合格。',
    '上述各条都必须交给目标市场的人实际看过、评过，不能只由设计者自评「我觉得很蒸汽朋克」。评测结果与自评分开记录。柴油朋克方向另需确认：若走该路线，时代与情绪是否真的是「两次大战之间」（钢铁、油污、Art Deco、极权阴影），而非只是把蒸汽朋克换了配色。',
  ],
};

const COZY_PACK = {
  schemaVersion: 1,
  id: 'style.cozy',
  axis: 'style',
  value: 'cozy',
  title: '治愈系／cozy（庇护感、日常仪式、低压力）',
  shortTitle: '治愈系',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。只改呈现、文本与反馈，不定义胜负与回合规则。本包两条元原则：cozy 是形容词不是品类，可叠加到任意玩法；cozy 是玩家依赖的，只能鼓励、不能强加。与相邻风格包划界：本包管「庇护感如何成立」，不管「不适如何成为主体」——一旦危险开始侵入安全区或玩家失去节奏掌控，那条线归恐怖氛围包；像素／复古是呈现技术层纪律（色数预算、格点对齐、缩放滤波），可叠加于本包之上，届时技术纪律以像素包为准；古风、西幻、二次元、赛博朋克、蒸汽朋克的文化联想与技术底座均不在本包，本包可被其中任一叠加。',
  presentation: {
    visual: 'cozy 的可操作内核不是「把一切做暖」，而是「用对比生成庇护感」：一手框架给出一句可以直接当判据用的话——冷雨打在窗上强化了阅读角的温暖、且不威胁打断它，同一场冷雨从破窗灌进来、这个场景就不再 cozy。所以第一条纪律是把不适安排在一个看得见但进不来的地方：安静咖啡馆之所以舒适，是因为门外有闹市（环境光、轻音乐、小空间 对 噪音、开阔），两者要并置出现，只做其中一半就只剩「整体变暖」。第二条纪律是安全区必须有明确边界且可随时退回：门、窗、篱笆、林间空地、瀑布后的洞穴都算，而从不适区跨进安全区的门槛应该比内部过渡更鲜明（顶着暴风雪推开木屋的门），因为「松一口气」的时刻正是 cozy 兑现的时刻。第三条是庇护感的三根支柱要同时成立，缺一根就会塌：安全（风险与危险——物理的、情绪的、社会的——被最小化，且安全来自自愿与自主选择，玩家永不感到被胁迫）、丰盛（低层需求已被满足，没有匮乏、紧迫与迫近之事，于是有空间去处理关系、审美、归属这类更高层的需求）、柔软（刺激温和、低唤起但仍高度投入，伴随空间与情感上的亲密、更慢的节奏、可掌控的尺度）。第四条是人本尺度：房间与物件按人的舒适尺度来，过大或过小都破坏 cozy，室外空间还应部分遮挡远景地平线，因为广阔空间会因不可知而消除安全感——但可以在广阔背景中用很细微自然的边界建立庇护所，例如林间空地上的一堆篝火。第五条是「平凡优于异域」：熟悉可认知的场景天然比陌生奇特的场景更 cozy，吊床、茶室、储藏间比宫殿、动物园、顶层公寓更有效，随手的家常物件（信箱、门廊秋千、一双靴子、雨衣）比华丽陈设更有效；奢华、做作与「高级感」是被点名的削弱项，它会制造社会比较压力或显得不真诚，而多数奢华恰恰缺乏那份有助于安全感的熟悉感。第六条是季节与仪式：季节更替本身携带社群与丰盛的联想（尤其秋收与冬储），重复而有意义的动作带来熟悉感与满足感——但仪式系统必须同时满足安全（已知无压力）、已知（不会突然消耗超预期的时间、劳动或资源）、放松（低心理成本）三个条件，任何一条不满足就会从「治愈」翻成「家务」。最后是四条可先定一条再铺的路线：田园与生活模拟（庇护载体是土地与季节循环，风险是被现成的农场模板吞掉）、修复与整理（庇护载体是把破碎的东西放回去，风险是把放松的仪式做成每日家务）、小店与经营（庇护载体是待客与手续的仪式，风险是点击劳动取代意义）、无压力探索（庇护载体是身体与环境的关系，此路线在 cozy 侧的独立证据最薄，如实标注）。',
    text: '文本层证据有限，以下方向均可操作，但缺「同一玩法两种 cozy 化文本」的对照，如实标注。第一条是把语气放在信息前面：一手开发者给出的反面示范可以直接当纪律用——角色不能在你给他一杯茶之后说「太好了你治好了我，这是谢礼」然后走开，这种「完成任务即结算」的写法正是被一手判为「完成清单不等于治愈」的那个错误在文本上的样子。第二条是让语言保持可读而不可裹挟：匿名共处（可感知他人情绪却不必被卷入）是被点出的平衡动作，文本上对应「路人无关痛痒的关注」「温顺宠物的陪伴」这类低需求社交，而不是要求玩家表态、选边或承担关系责任的对话。第三条是命名与场景用词偏熟悉可认知而非异域生僻——这一条属从视觉层的「平凡优于异域」外推到文本，标为低证据方向。第四条是能靠场景说出来的事就别用文本讲（与古风、西幻、二次元、赛博朋克、蒸汽朋克各包同构）：一处空间是否安全、是否有丰盛感、是否有欢迎感，应由画面与声音直接给出，而不是靠一段说明文字告诉玩家「这里很温馨」。第五条是世界观信息要克制：cozy 的语境下，lore 倾倒的代价不只是「像在备考」，还会引入紧迫感与责任暗示——恰好是本包要排除的两项，所以只揭示当下相关、且不会让玩家觉得「我必须记住这些」的部分。',
    feedback: '反馈层证据单薄：公开检索只拿到一条一手框架（音频方向）与一条负向判据（不该惩罚），没有「同一操作两种 cozy 化反馈」的对照实验，以下为低证据方向，只给方向不给默认推荐。方向一（本槽位唯一的一手框架）：cozy 音频是连续、柔和、不侵入、并带熟悉感的，音乐与音效最好都有叙事内的、可辨识的具体来源（瀑布、河流、雨、温和的炉火、猫的呼噜、模糊的交谈声），因为具体声源能让玩家与它建立确切乃至亲密的连接；同时一切暗示外部威胁或危险的声音都应被弱化并置于远处——这正好与画面层「不适要看得见但进不来」同构，声音上做反了就前功尽弃。方向二（负向判据，来自一手开发事故）：反馈不该惩罚「做太多」或「走太远」，被点名的具体案例是体力值系统——开发者亲手实现后又整个砍掉，理由是「感觉太有压力」，原话批判的是「用『你走太远了』『你做太多了』来惩罚玩家」。所以任何带惩罚或匮乏暗示的反馈（资源见底警告、倒计时紧迫音、疲劳状态提示）在本包里都是默认要审查的项。方向三（从一手框架外推，标低证据）：反馈的「量」应当是够用即停——过多、过密的即时反馈会落入「强烈刺激」与「外在奖励」两类削弱项，而这两项恰好是被点名的：几乎任何形式的外在奖励都会产生紧迫的、交易性的短期需求，从而把内在愉悦的活动变成外在化的任务。本槽位如实标注为低证据，不得用常识冒充来源；检索中多篇商用博客提到的「按键音要软」「音效要有实物质地」「圆角传递安全」一类说法因无可核查作者与方法，一律未采信。',
  },
  verification: [
    '对比测试：把安全区画面与紧邻的不适区画面并置给目标用户看，先问「哪一个是你能放松待着的地方」，再问「不适在哪里」。若对方指不出不适的位置，说明对比没建立、画面只是整体变暖，判不合格。',
    '跨门槛测试：模拟或播放「从不适区进入安全区」的过程（顶着暴风雪进木屋、穿过瀑布进洞穴、推开喧嚣的街门进小店），问对方有没有感觉到一个明确的「松一口气」的时刻。感觉不到说明门槛不够鲜明。',
    '节奏权测试：让目标用户自由玩一段时间，事后问「有没有某一刻觉得『我必须现在做这个』」。任何一个被点出的时刻都算责任泄漏，逐条对照削弱 cozy 的因素清单（外在奖励、危险威胁、责任、不快干扰、强烈刺激、距离、恐惧源、非自愿社交、幽闭、欺骗背叛、奢华做作）核查成因。',
    '仪式三条件测试：把游戏里的全部重复性日常逐个过一遍，逐条回答三问——它是安全的吗（已知无压力）？它是已知的吗（不会突然消耗超预期的时间、劳动或资源）？它是放松的吗（低心理成本）？三条中任一条不满足即从「治愈」翻成「家务」，判不合格；特别检查是否存在「不做就损失已得之物」的设计（连续登录、会枯死的作物、会离去的角色）。',
    '差异化自述：要求开发者自己写出一句「与最常被比较的那款作品相比，我刻意保留的差异是什么」。说不出来即判定为同质化——这是本包唯一一条从市场侧得出的硬动作，依据是供给量数据与行业媒体对「同样化」的直接判断。本包不规定差异的方向（可以更黑暗、可以更古怪、可以更专注），只要求说得出来。',
    '玩家依赖确认：确认交付时是否如实告知「cozy 是玩家依赖的，只能鼓励、不能强加」——同一个空间对带着紧迫外部需求进入的玩家不会生效。若对外承诺「照做就一定 cozy」或「所有人都会觉得放松」，判为过度承诺，需要改口径。',
    '上述各条都必须交给目标用户实际看过、玩过、评过，不能只由设计者自评「我觉得很温馨」。评测结果与自评分开记录。另外，本包已如实登记两处来源分歧（cozy 是否该挑战边界、日常仪式系统是否正当），评审时不得把任何一派当成唯一正确答案。',
  ],
};

const PIXEL_PACK = {
  schemaVersion: 1,
  id: 'style.pixel',
  axis: 'style',
  value: 'pixel',
  title: '像素／复古（呈现技术纪律、可叠加任一题材）',
  shortTitle: '像素复古',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。只改呈现、文本与反馈，不定义胜负与回合规则。本包是四个风格包里唯一「呈现技术层」包：它管的是受限栅格下的可读性纪律（像素尺寸与世界尺度的一致性、色数预算、格点对齐、缩放滤波、抖动用量），不管题材。与相邻风格包划界：第一刀，复古不等于像素——CRT 扫描线、磷光辉光、色偏、模拟信号模糊属于「年代感」的另一条线，本包以数字栅格的硬边为正身，CRT 与年代滤镜只作可选叠加层，且无论叠加与否都不影响本包的技术纪律；第二刀，本包只管呈现技术纪律、不管题材，可被古风、西幻、二次元、赛博朋克、蒸汽朋克、治愈系任一题材包叠加，叠加时技术纪律以本包为准。本包也不解决「用不用像素」这个取舍，只解决「一旦用像素，什么算做对」。',
  presentation: {
    visual: '像素的可操作内核不是「方格贴图」，而是「受限栅格下的可读性纪律」。第一条也是最硬的一条：全画面只允许一种像素尺寸，且缩放只用整数倍。一从业者技术长文给了两个症状对应两个解法——边缘发糊说明你在用双线性滤波（bilinear 会把每条硬边抹成渐变），改用最近邻；像素大小不均或滚动时抖动（shimmer/jitter）说明你在做分数缩放，一像素源要占一个半屏幕像素而无法平分，直线就会坑洼，改用整数倍并把摄影机吸附到整数像素，或者先渲到低分辨率缓冲再对整屏做整数放大。取整一律向下（32 像素的精灵想显示到约 200 像素，200/32=6.25，就用 6 倍=192 像素）。并要记住一句从业者提醒：在编辑器里做对不等于在游戏里做对——滤波设置活在引擎里、不在 PNG 里。第二条是像素尺寸必须同世界尺度绑定。这一条有玩家侧的自发抱怨作独立佐证，原话点名的正是「像素尺寸各不相同」的游戏：不做真正的低分辨率画布，而是做成高分辨率画布再让各处像素大小不一。环境层的配套判据是：瓦片尺寸要一致（它提供网格框架，让角色能顺畅移动而不产生意料之外的碰撞）、角色与物件要有统一的尺寸比例（一个十六像素的角色不该被像素数大得多的环境物件比下去）、细节等级要一致（角色若只有几个像素的差异特征，环境就该配合这种简洁而不是塞满细节）。第三条是剪影先行、细节在目标尺寸下会消失。零成本的剪影测试是：在加颜色、明暗与细节之前，先把它填成纯黑剪影——只看轮廓认不出是什么，多少细节都救不回来；同时要定期把缩放切回百分百或两倍，看它实际在游戏分辨率下读起来怎样，因为放大时很棒的细节在目标尺寸下经常消失或变成噪点。第四条是色数与明暗都是预算，不是审美偏好。受限调色板之所以是纪律：它更统一、更好管理、逼你取舍，且贴合复古观感；常见预算是美术 4 到 16 色，单个物件先用三色规则（基色、阴影色、高光色）。两条可直接执行的硬规则是——永远不要靠加黑来加深颜色，要用色相偏移，阴影往蓝紫偏、高光往黄橙偏；光源方向全局只用一个（游戏里惯用左上），混用光源方向看起来就是不对，哪怕玩家说不上为什么。反过来，枕头打光（把高光放正中、阴影描一圈）是头号新手错误，会让东西又软又鼓、失去方向感。第五条是风格化改的是质感、不是因果：仓库内一张镜头卡明确写「卡通渲染、像素风同样要求释放源、作用对象、特效三者在镜头里可读」，所以色数预算与格点约束不得吃掉「谁放的、打到了谁、发生了什么」这类功能信息。第六条是抽象留白降本优于堆细节：有产业复盘点名了一批正面例——用像素风渲染三维世界在短时间内做出低成本又好看的小型开放世界、用一位元抖动算法降低三维模型的精细度需求、把三维动画转为逐帧动画以降低手绘成本，并直言像素的抽象属性让三维模型制作可以简单糊弄。第七条是本包把「复古」处理为可选叠加层：一份分析长文指出当年开发者是「为模糊而设计」的，抖动在阴极射线管上才化成透明与深度，并追问「真正的像素艺术是原始瓦片数据还是当年玩家在普通电视上看到的图像」；但同一议题的讨论中有大量从业者反驳，模糊主要来自廉价的射频与复合视频连接而非显像管本身，接好信号的显像管其实相当锐利，且不同人的怀旧锚点不同（家用主机配模糊电视、电脑配锐利显示器、掌机配液晶），这削弱了任何单一「正宗复古外观」的说法。本包因此不定义正宗复古长相，只定义数字栅格的技术纪律，年代滤镜采用与否交给项目自决。',
    text: '文本层证据单薄，本包是呈现技术层包，文本层天然薄，以下均为方向、不给默认推荐，如实标注。第一条是把可读性纪律从画面延伸到排版：像素画布上的文字也受同一套格点约束——字号必须落在像素网格的整数倍上、不要用抗锯齿或半透明描边（那会让像素字发糊），并且界面文字的像素尺度要与世界物件的像素尺度一致，否则会出现「字比角色还精细」或反之的割裂。第二条是命名与用词不要复读像素梗：能靠画面说出来的事就别用文本讲（与各风格包同构）——一个物件是像素画还是写实画面是否精致，应由画面直接给出，而不是靠道具名或说明文字点题「像素风」。这一条属从视觉层外推，标为低证据方向。第三条是不要用字体堆年代感：检索中反复出现的一条玩家侧疲劳是「像素被用滥了、曾经是例外如今是常态」，所以用复古字体、终端字、点阵字去营造年代表情，本身不构成说服力，只会加强「这是个便宜复古皮」的读感；年代感若要有，应来自画面结构而非字体装饰。第四条是文案的省字纪律：受限分辨率下手写文字的资源与注意力都更贵（对照画面层的抽象留白），能用图标、剪影、场景交代的信息就不要写成一行字，这在像素语境下不是风格偏好而是产能约束。本槽位如实标低证据，不冒充来源。',
    feedback: '反馈层证据有限，缺乏像素游戏专属的反馈实测，以下为方向加可迁移判据，不给默认推荐。第一条（本槽位可迁移的硬证据，来自一条产业复盘）：像素可以不只是视觉装饰，而成为玩法与技术载体，玩家的操作反馈正是靠「观察画面」来闭环的——被点名的正面例是一部每个像素点都拥有独立物理属性（燃烧、流动、导电）的作品，玩家需要靠视觉观察来判断连锁反应；另一部用一位元抖动算法降低三维模型的精细度需求，创造出独特的推理体验。这两例说明像素语境下「反馈」的一大部分是画面本身在说话，而不是靠特效与音效叠加。第二条（帧数与手感纪律，来自一份像素美术规范）：像素动画的帧数纪律本身就是反馈的一部分——多数游戏动画就是二到四帧，走路三到四帧、攻击六到八帧，帧数少不等于手感差，但每一帧的剪影与比例必须靠洋葱皮逐帧对齐，否则动作会帧间漂移，读起来就是「飘」。第三条（负向判据，来自产业复盘的失败清单）：像素美术存在边际效用递减——当玩家感官长时间暴露在同一刺激下，大脑对该刺激的反应会减弱，游戏美术会随时间推移变成背景信息，此时玩法提供的反馈会占据主导；所以不能指望「像素好看」本身撑住长期操作反馈，若一款动作类像素游戏没有该有的手感、或一款叙事类像素游戏没有叙事驱动力，这些短板会在美术滤镜被消磨殆尽后变成砸向游戏的锤子。第四条是抖动与粒子要克制：抖动是创作纹理、透明与深度的工具，但用量失当会在现代锐利屏上变成一团噪点——一份分析长文明确写「在锐利的液晶屏上它们看起来像一团噪点，在显像管上它们看起来像魔法」，所以在不做年代滤镜叠加时，抖动只能小剂量使用。第五条如实提示：本包与「美术边际效用递减」这条存在张力（像素既被期待承担反馈，又不该被指望承担反馈），评审时不得把任一侧当成唯一答案。',
  },
  verification: [
    '像素尺寸一致性核验：把同一帧画面截出来，逐个统计可见的像素方块尺寸，若出现两种及以上尺寸，或滚动时像素宽度时粗时细，判不合格（这就是玩家会自发抱怨的那一条）。',
    '缩放与滤波核验：确认目标引擎的采样已切到最近邻（各引擎开关名：经从业者技术长文整理——戈多 Texture Filter 设为 Nearest、Unity Filter Mode 设为 Point、Phaser 在配置里开 pixelArt、网页端用 image-rendering: pixelated），并把缩放倍率调成整数；文档里必须写清「在编辑器里做对不等于在游戏里做对」，核验必须在目标引擎与目标分辨率下实看，而不是在看图工具里看。',
    '整数取整核验：给出画布尺寸与目标窗口尺寸，按其规则算出倍率并确认取整向下（例：32 像素精灵想显示到约 200 像素，200/32=6.25，取 6 倍）。若最终采用分数缩放，必须记录理由与替代方案（整数放大留黑边是常见默认）。',
    '剪影测试：把主角、主要敌人、关键道具各自填成纯黑剪影，拿给没看过设定的人辨认「这是什么」，认不出即判不合格；同批核验瓦片尺寸是否一致、角色与物件尺寸比例是否统一、细节等级是否统一。',
    '目标尺寸回看测试：设计者必须把画面缩放切回百分百与两倍，实看一遍；若发现放大时好看的细节在目标尺寸下消失或变成噪点，按可读性重排，而不是加大分辨率。',
    '色数与明暗核验：统计实际用色是否落在既定预算内（常见为美术四到十六色、单物件三色规则）；逐项检查是否存在靠加黑来加深颜色（应改为色相偏移：阴影偏蓝紫、高光偏黄橙）、是否全局混用了多个光源方向、是否出现枕头打光。',
    '因果可读性核验（承接仓库内既有卡片）：色数预算与格点约束不得吃掉功能信息——画面必须仍能读出「谁放的、打到了谁、发生了什么」；风格化改的是质感，不是因果。',
    '降本路径确认：交付前必须写出「本作用抽象留白省在哪」——是哪几处用剪影、图标或场景替代了精细绘制（对照产业复盘里的正面例：像素风渲染三维世界、一位元抖动降精度需求、三维动画转逐帧动画降手绘成本）。写不出来说明美术预算没有落在像素的优势上，只是在用像素的样子做写实例子的活。',
    '差异化自述：要求开发者自己写出一句「与最常被比较的那款像素作品相比，我刻意保留的差异是什么」。说不出来即判定为同质化风险高——依据是市场侧盘点（近两年数千款像素游戏里仅约百分之五越过五百条评测）与发行量数据（二〇二〇年后激增并在近两年加速、质量停滞），像素本身不构成卖点。本包不规定差异方向，只要求说得出来。',
    '成本警戒核验：若第一版计划内包含实时动态光影、二维与三维混合的电影化运镜、或全角色逐帧手绘动画，必须单独列出一份成本与风险说明再决定——产业复盘给了完整因果链：有工作室以为像素「既快又便宜」，随后工作量雪崩，为之牺牲了众筹承诺的玩法与叙事完整度，最终停止运营；另一部作品主角一人就有六百到八百多个动画片段；还有一部从首曝至今超过九年进度未知。本包不禁止这些手法，但要求它们是被知情选择的，而不是被默认塞进第一版的。',
    '复古处理核验：确认交付时已如实区分「数字栅格纪律」（本包正身）与「年代滤镜」（可选叠加层，且模仿的是哪一种显示条件要说清）；同时登记本包已如实报告的一处来源分歧（显像管模糊究竟是复古本体还是廉价连接的副产物），评审时不得把任一派当成唯一正确答案。',
    '以上各条中凡涉及观感判断的（剪影识别、目标尺寸读感、因果是否可读），都必须交给目标用户实际看过、玩过，不能只由设计者自评——依据是仓库内既有卡片：开发者长期在放大倍率下作画，对低水平用户敏感的细微差异天然无感，「我觉得没变」不能推翻用户说变了。评测结果与自评分开记录。',
  ],
};

const HORROR_PACK = {
  schemaVersion: 1,
  id: 'style.horror',
  axis: 'style',
  value: 'horror',
  title: '恐怖氛围（只管呈现与不安，不管玩法规则）',
  shortTitle: '恐怖氛围',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。只改呈现、文本与反馈，不定义胜负与回合规则。本包只管「怎么让玩家不安」，不管「恐怖品类怎么玩」——资源、追逐、解谜、失败判定与回合结算一律属品类包与引擎包，不在本包职责内。与相邻风格包划界：第一刀，只管呈现与氛围，不管玩法规则，本包不规定玩家有几发子弹、能不能跑赢、输了怎么办，只回答「同样的机制上怎么打光、怎么摆声、怎么控制玩家知道多少」。第二刀，与治愈系（style.cozy）的「creepy-cozy（温暖日常加一丝不对劲）」交集区要讲清：情绪主干由治愈系承担（庇护感、日常循环、可负担的失败），本包只提供其中「不对劲」的那一层（一个变了样的细节、一句被藏起来的话、一处不该在那里的痕迹）；若项目要做 creepy-cozy，默认以治愈系为主包、本包作叠加层，且叠加时必须遵守本包「不确定感优先于惊吓」的纪律；若项目要做纯恐怖，则以本包为主、治愈系不参与。本包不声称 creepy-cozy 归自己。像素／复古是呈现技术层纪律，可叠加于本包之上，届时技术纪律以像素包为准；古风、西幻、二次元、赛博朋克、蒸汽朋克的文化联想与技术底座均不在本包，本包可被其中任一叠加。',
  presentation: {
    visual: '恐怖氛围的可操作内核不是「加怪物、加血、加跳吓」，而是「让玩家自己吓自己」的条件设计：预期管理、视野剥夺、安全与危险区对比、信息不可靠。第一条也是最硬的一条：恐怖的语法是预期，不是跳吓——跳吓只是兑现不是产品。一篇从业者分析长文给出可以直接当判据用的话：跳吓不是游戏里恐怖的部分，它是收据；预期才是整个产品，结尾那一下只是兑现的方式。同一篇给的量化经验值是十条空走廊配一条有东西的走廊，理由是玩家的大脑会替你把恐怖做完；并点名《P.T.》的重复走廊是这条的证明——同一段 L 形走廊反复走，前几圈几乎什么都不做，只挪一下相框、裂开一条门缝，玩家的大脑就认定场景里每个物件都可能是伤害源，等东西真的出现时反而像解脱。第二条是权力是恐惧的敌人，玩家能可靠取胜，恐惧立刻终止。三条独立证据同向：一手开发者访谈记录了一款只放一只异形的作品，其异形反应基于动物捕猎行为环（先潜行、探测动作或声音、直接反应、调查、最后攻击），路径不是预先定好的而是系统性生成、可瞬间转向；同一场访谈的实测是「百分之百的测试者都没有向异形开枪」，开发者原话是想要玩家的反应是本能的、让他们知道在这东西面前没有胜算；另一款作品的开发者原话更直白——如果玩家手里有武器，他们就会试图杀掉敌人，要么找到办法滥用系统让敌人变得不那么可怕，要么当成普通射击游戏来玩然后死很多次、认为系统有缺陷；另一篇创作者分析把这条总结为「给你一盏灯就这些，灯笼不伤害怪物，灯笼让你更容易看见那些即将伤害你的怪物」。本包在呈现层可执行的部分是不给玩家可靠的视觉反制手段（光只能照见、不能驱散，暗只能躲、不能清），玩法层的胜负仍归品类包。第三条是受限视野要「受限但可读」，全黑是挫败不是恐惧。一手亲笔给出原理：好的恐怖常常来自幽闭空间，并靠低可见度繁荣；但一位在制项目的开发者日志给了边界——恐怖游戏里一个常见的错误是把一切弄得太黑，完全黑暗往往制造挫败而不是恐惧，玩家需要刚好够的信息去想象阴影里可能藏着什么；一份学术论文给出实证：参与者在手电筒存在时感到安全，即使是在光线充足的区域也愿意开着手电，有手电辅助的区域绝不该暗到玩家看不见，否则会破坏沉浸感并造成普遍的不良体验，而玩家在手电筒电池耗尽时会感到挫败。所以本包的口径是留白要留在「看不清是什么」，不能留在「看不清往哪走」。第四条是安全与危险必须成对比，且安全区要真的安全。创作者分析原话给出的是威胁会被夺走的可能性比它真的被夺走更强，所以不该让每个安全屋在你离开前都进过怪物，否则安全屋就不再安全、玩家到达时也不再松一口气；同篇补充说恐怖需要观众只有一个人，有同伴、有闲聊的 NPC、甚至一个令人安心的无线电声音，都会部分解除玩家的紧张。第五条是不可靠信息是恐怖设计里最被低估的工具。创作者分析原话：走廊看起来比上次更长、地图上多出一个原本不在的房间、NPC 的脸微妙地不对而游戏从不点破、声音从上方来然后又变成从下方来、敌人原本在门后而打开门什么也没有——这种「什么也没有」反而更糟。分析侧把这条落实为一个可直接执行的手法，即假阳性：训练玩家把某些线索与危险关联，然后偶尔颠覆它——一扇门吱呀响了九次都是敌人，第十次只是风，这种不确定性让玩家在安全时刻也保持紧张。第六条是环境叙事优先于过场动画，且低精度反而给想象留出投射空间。创作者分析原话：吓人的故事一旦切成过场就不再吓人，因为玩家被告知他们不再在玩了，他们在观看，而观看比游玩安全，恐怖立刻降级；替代方案是用空间本身做叙事，门内侧的抓痕、面朝墙壁的椅子、孩子画的、你一直在听的那个东西的图画。同篇还点名低多边形、稍微不对劲的审美能免费替开发者做很多这类工作，因为玩家的大脑已经在每个物件上跑解释循环，而干净、高保真的美术给玩家的投射余地更少。第七条给出一条有年代设定的恐怖的具体做法：一款作品逐帧解构了原版电影、不只是设计语言还有它在实景布景上如何实现，并定下任何一九七九年之后的技术一律忽略，界面基于录像带系统，游戏内的录影是把磁铁贴到旧电视机上扭曲图像后录下来的；同一项目的主美还给出光照与音频协同制造失衡的案例——滚动灯光与频闪的异步图案，加上音频，制造出真正令人失衡的混乱感，让玩家晕头转向并加剧紧张。',
    text: '文本层证据有限，恐怖是氛围包、文本天然不是主干，以下均为方向、不给默认推荐，如实标注。第一条也是最硬的一条：能靠场景说出来的事就别用文本讲，而且宁可少讲。三方证据同向——创作者分析说回答每个问题就移除了神秘感，更愿意给玩家信息的碎片、鼓励他们形成自己的理论；开发者一侧说吓人的故事一旦切成过场就不再吓人；一份失败案例盘点把这一条的反面点名，即一款作品的失败之一正是「游戏告诉你什么该害怕，而不是让你自己发现」。第二条是文本要承担「不对劲」的传达而不是「危险」的宣告：因为本包的核心是预期而非惊吓，文字上最有用的形态是记录、笔记、留言、电台讯息、墙上涂鸦这类「没有在对你说话」的痕迹，而不是任何直接对玩家喊「危险」的提示；《P.T.》被反复提到的正是「不同圈次的电台讯息不同」「墙上涂鸦在你转身后变了」这类文本行为。第三条是解释要留缺口：本包的呈现判据要求玩家自己补全看不见的东西，文本上对应的纪律是把因果链讲一半——谁做了什么可以给全，为什么这样做的动机要留给玩家自己推断，因为一旦动机被讲明白，未知就闭合了。这一条属从视觉与气氛层外推到文本，标为低证据方向。第四条是命名与场景用词不要点题：不要用场景名、道具名或说明文字直接宣告「这里很恐怖」「此处闹鬼」，恐怖若要靠文字标注，说明画面与声音没有把活干完；这一条与各风格包「能靠画面说出来的事就别用文本讲」同构。第五条是界面文字要克制到几乎没有：一份学术论文与多篇分析都指向同一方向——恐怖依赖玩家对当前状况的不确定，而任何持续的、精确的状态读数（血量、弹药、威胁等级、距离）都在把不确定换成确定、把恐惧换成算术，所以本包建议界面文本默认极简，只在玩家主动查询时给出，且给出的信息本身可以是不精确的（模糊的表述优于数字）。这一条有开发者一侧的原理支持（一手开发者把「专注体验、不推挑战」当作恐怖成立的代价），但缺恐怖专属的「同一界面两种写法」对照，标为有限证据方向。',
    feedback: '反馈层证据充分，本包少见地在这一层拿到了可执行的硬规则，来源是一名恐怖声音设计者在一场开发者大会上的演讲，且被三家独立媒体分别记录、互相印证。规则一是声音先于画面等于焦虑、声音晚于画面等于安心：演讲原话是如果把声音提前大约三帧来触发，会诱发紧张或焦虑，反过来当音频跟在视觉提示之后，提供的则是安全与舒适，并明确说在一款作品里用了这一手法；另一家媒体的记录同向，并补充即使同步差几帧也能感觉到（以脚步声为例）。这条可执行的反馈纪律是：需要玩家不安的时刻，让声音略微领先画面；需要玩家放松的时刻，让声音略微落后画面。规则二是静音是最重要的一种声音，也是最强的一种：演讲原话是没有声音时大脑会填补空白，他现场用一首钢琴曲注入周期性静音缝隙、再用噪波替换静音做对照，在灯火通明、挤满人的讲厅里仍令人不适；另一家媒体的记录是声音的缺席比美丽的音乐更打动人，还有一条补充是当大脑听到一个声音、随后是静音，声音在它被切断后仍然残留、给听者留下强烈冲击；创作者分析侧同向并把代价讲得更重——如果你的游戏有持续的音乐床和环境音轨，你就放弃了制造恐惧的最佳工具，因为当一切安静下来、玩家就知道出事了，他们的大脑开始用想象出来的威胁填补空白，而那些威胁总是比真的更糟。所以本包的第一条反馈纪律是系统性地使用静音，而不是把静音当成「没安排音效」。规则三是反常识的动态对冲，演讲原话是想让声音不可预测——也许在一场大惊吓时把一切都切掉，而在什么都没发生的时候反而有很多声音，即动态范围与强度不必与剧情的紧张同步，甚至可以故意反着来。规则四是分层环境音而不是单层循环：在制项目的开发者日志给出一条可迁移的分工——走廊是风与远处吱呀声、地下室是低频持续音、阁楼是偶发撞击与抓挠、威胁区叠加更强的紧张层，且各区域的音景要平滑过渡，好让玩家在没意识到的情况下感到有什么在变；同方向的一条实证是手电筒的存在本身就让玩家感到安全，说明「伴随安全物件的持续声」也能承担安抚功能。规则五来自玩家侧的自发归因，用于划出本包的边界：玩家抱怨最集中的是廉价跳吓在第二十次之后不再有趣、以及当游戏告诉你什么该害怕时你很难害怕；所以本包的反馈不追求「每次都给玩家一下」，而是把「让玩家提高警觉、要求他们凑近听」当作目标。以上各条都是可执行的硬规则，但仍需在目标引擎与目标音频环境下实听，因为演讲者也提示声音与画面的同步误差只有几帧就会被感知。',
  },
  verification: [
    '十比一走廊检验：统计全部「有东西」的场面（出现威胁、异动或惊吓）与「什么都没有」的过渡段（空走廊、空房间、纯探索、读记录），比值不应高于一比十。任何一段连续内容里「有东西」的密度明显高于这个比值，判为过度填充，逐处删减或改写成空段。依据是从业者给出的比例经验值，属从业者经验而非实测，标注为一比十。',
    '跳吓之外有交代检验：把每个跳吓逐个过一遍，逐个回答「如果把这个跳吓整个删掉，它前面那段走廊还吓人吗」。若答案是否，说明该处只有跳吓、没有预期，判不合格——本包要的是删掉跳吓后走廊依然成立。',
    '权力回收检验：列出玩家在呈现层能做的全部动作，逐条问「这个动作能不能让玩家觉得自己占了上风」，尤其是光照与视野类动作。凡是能「驱散、清除、照亮并确认安全」从而让玩家获得可靠掌控的手段，都要标记为削弱恐惧的项（如：把光做成只能照见前方窄锥、不能扫清整间屋子；把照明做成资源而非权限）。玩法层的胜负仍归品类包，本包只审「呈现层是否偷偷把权力还给了玩家」。',
    '纯黑检验：在每一个黑暗段落里问「玩家还看得见往哪走吗」。若玩家无法读出可通行的路径或目标所在，判为「挫败而不是恐惧」，需要补回刚好够的信息（一盏远处的小灯、一段可辨的轮廓、一处可跟随的地标）。同时检查照明资源耗尽时的体验：若照明耗尽只带来挫败而不带来更深的恐惧（即玩家不再能继续、只能重来），需要改设计而不是调暗。',
    '静音检验：逐段检查音轨，找出「从头到尾都有音乐床或环境音铺底」的段落。任何零静音的连续段落都要标出来——因为持续音床等于放弃了最强的一种工具。至少要确认存在若干处「由声音设计主动安排的绝对安静」，且这些安静发生过、不是被遗漏。',
    '安全区检验：找出全部安全区（存档点、基地、白昼、庇护所、明确无威胁的房间），逐条回答两问——玩家到达时是否真的能松一口气（而不是带着「等下一定有东西」的预期）？安全区被威胁侵入的频率是否低于玩家能学会的程度（即威胁可能来、但不是每次都来）？若安全区从不安全，或安全区必然不安全，都判不合格。',
    '假阳性检验：确认存在若干「线索响起但什么都没发生」的段落，且这些段落不是偶然、是被安排过的。同时确认存在若干「线索安静但确实有东西」的段落。若全部线索都精确对应威胁（无假阳性、也无假阴性），说明不确定性没有建立，判不合格。',
    '视野语法检验：检查画面是否建立了明确的「安全区与危险区」视觉对比（光照范围、门框、雾、走廊尽头、阴影方向）。把任意一帧给目标用户看，问「你觉得自己站在哪一侧、往哪边是危险」，若对方说不出，说明对比没建立。同时确认全画面只有一个主要光源方向（或明确解释了多光源的物理来源），避免光照逻辑自相矛盾。',
    '过场降级检验：清点全部过场动画与不可操作的叙事段落，逐个回答「这一段的信息能不能改用空间与可交互物件传达」。若某个过场承担了关键的恐怖信息，标出来——过场一开始恐怖就降级，因为玩家被告知他们不再在玩了。',
    '事后记忆检验：测试结束后不要当面问「好不好看、恐不恐怖」，而是等一段时间后问「你现在还能想起来的是什么」。能留下来的若是画面、声音或某个空间细节，说明条件设计成立；若想起来的是「剧情解释」或「跳吓次数」，说明恐怖被换成了信息与刺激。依据是仓库内既有卡片对「当场评价用感知层、事后记住的是情绪层」的区分。',
    '叠加冲突检验：若本包与治愈系（creepy-cozy）叠加，逐处确认「安全」由治愈系定义、「不对劲」由本包定义，且本包只提供细节级的不对劲（一处变了样的物件、一句被藏起来的话、一处不对的痕迹），不接管庇护感本身；若本包与像素／复古叠加，确认技术纪律（像素尺寸、色数、缩放）以像素包为准、本包只负责「留多少看不见」。',
    '上述各条中凡涉及观感与不安程度的判断（走廊是否吓人、安全区是否让人松口气、静音是否被感知），都必须交给目标用户实际玩过、评过，不能只由设计者自评——依据是仓库内既有卡片：开发者长期浸在自己的设计里，对玩家的实际反应天然无感，「我觉得很吓人」不能推翻用户说没感觉。评测结果与自评分开记录。另外，本包已如实登记三处来源分歧（声音究竟占恐惧多大比重、画面该干净还是该模糊、某款作品是范本还是「待得太久」），评审时不得把任何一派当成唯一正确答案。',
  ],
};

const HARD_SCIFI_PACK = {
  schemaVersion: 1,
  id: 'style.hard-scifi',
  axis: 'style',
  value: 'hard-scifi',
  title: '硬科幻／太空（只管呈现与技术可信，不管玩法规则）',
  shortTitle: '硬科幻',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。本包证据整体显单薄（见下），采信时按「方向」而非「已验证结论」使用。只改呈现、文本与反馈，不定义胜负与回合规则。本包只管「技术怎么显得可推演、尺度怎么显得可信、界面怎么像航天仪表」，不管「太空题材怎么玩」——航行规则、资源管理、战斗数值、模拟深度一律属品类包与引擎包，不在本包职责内。与相邻风格包划界：第一刀，与蒸汽朋克／赛博朋克在「材质与年代」上分清——真空、金属、仪表、功能主义工业件归本包；蒸汽黄铜、齿轮、维多利亚工程浪漫归蒸汽朋克；霓虹、义体、数字网络、巨型企业归赛博朋克。第二刀，与「太空歌剧／软科幻」划界：本包管「从当下技术可外推」的那条线，星战式浪漫化的奇幻太空（原力、宇宙魔法、无物理理由的巨构）不属本包；若项目要的是太空歌剧观感，本包不适用，不得把本包判据套上去。第三刀，本包不裁定「模拟深度」——真实到什么程度由项目与品类包决定，本包只要求「一旦让步，必须显式记录」。像素／复古是呈现技术层纪律，可叠加于本包之上，届时技术纪律以像素包为准；恐怖氛围可与本包叠加（密闭／真空／孤立本就同源），叠加时「不安」由恐怖氛围包负责，本包只管技术可信与尺度可读。本包不声称覆盖「硬科幻是否好玩」这个品类问题。',
  presentation: {
    visual: '硬科幻的可操作内核不是「造型更未来」，而是「从当下技术可外推」。第一条也是最硬的一条：先画一条从今天的航天技术到未来的线，再沿这条线向外推，而不是先想「未来该长什么样」。一手原话给的面子很直白——「你可以从当下的航天技术画一条线，然后沿这条线向外推演到未来，这样它才可信、才能让人共鸣」；同一开发者给的反面示范同样可用：「这不是《星球大战》，也不是《星际迷航》，这个风格自成一体」，并自问「三百年后你明明可以设计一艘漂亮得多的飞船，对吧？但评判的标准是当下的航天计划，这样你就在脑中划了一条分界线」。第二条是技术必须可读、可关联：一手原话「飞船上的按钮不是神秘的——上面有标明功能的标签」，核心理由是「这是人们能看懂、能与之产生关联的技术」。所以装饰性的、说不出功能的面板与图标在本包里是被点名的塌法，与蒸汽朋克包的「装饰齿轮」同构，只是换成「无功能仪表」。第三条是功能主义不等于无菌，这是本包最容易做错的一条：一手原话明确要求「避开那种冷冰冰、临床感、不像有人住过的科幻环境」很重要，因为「人们墙上还是会有乐队海报、会有提醒自己家在哪的小玩具」，并补一句「不要假设人性因为换了个时代就剧变」。所以「有人住过」的痕迹（贴纸、便条、用旧了的接口、手写的标签）不是反风格，而是硬科幻可信度的一部分；把功能主义做成无菌舱，是把这条判据做反了。第四条是尺度必须被「设计」，而不是「做大」：本包的第一失败模式（三条独立来源同向）是大而空——一部以海量程序生成行星为卖点的作品被评为「有史以来最庞大的探索游戏，但最终感觉是空洞的」，一篇分析直陈「浩瀚与多变不可避免地让它有时显得平庸；当可能性近乎无限时，它们不可能都有意思」，另一款真实尺度作品被记录为「即使在约 1800 倍光速下飞行，这段旅程也花了我一小时十五分钟」，论坛甚至留下「如果你非要去，带上午餐和一瓶茶」的 53 页警告贴。反面之外有正面做法：让玩家学会读「自然力量」（行星运动、时间窗口、真空危险），并让环境事件承担理解，原话是「有些故事是通过被发现的文本讲述的，但那些时刻并不提供最大的初始钩子……那不如被卷进一场龙卷风有意思」。可执行口径是：尺度存在，且玩家能被教会读它；若玩家只是在等计数器归零，那就是苦役而不是尺度。第五条是取舍要显式：一手开发者承认「严格说，我们在物理上本该把很多东西做得不一样——比如东西怎么飘、角色怎么移动。但我们没法百分之百实现，因为那对玩家会非常怪，像一直在水下移动」，并承认做零重力段落时「团队里一部分人晕了，我们不得不多次修改镜头运动才把问题控制住」；另一项目用磁力靴替代真实宇航员的系绳。本包因此要求：**任何为了体感而放弃的物理真实性都要写进文档**，而不是假装做到了。第六条是资源要投对地方：评测点名一部作品「内饰里铺张的细节」与「行星表面却乏善可陈」的落差，以及「地面没有载具、星球探索全靠腿，兴趣点动辄几百米，赶路纯坐牢」。所以本包不鼓励把预算平均撒在尺度上，而要求先保证「玩家真会走的那段路」不是空的。',
    text: '文本层证据单薄，硬科幻是呈现包、文本天然不是主干，以下均为方向、不给默认推荐，如实标注。第一条是最有依据的一条（来自开发者一手与 GDC 记录）：能靠环境与物理事件说出来的事，就别用文本讲——原话是环境里「这些物理过程与地点抓住玩家的注意力，引导他们进一步调查」，而「那些（文本）时刻并不提供最大的初始钩子」，作者据此把「被卷进一场龙卷风」排在「读一条说明」之前。硬科幻的对应做法是让玩家读出机械与宇宙的运作规则（这台机器靠什么工作、这个窗口为什么只有现在），而不是靠一段设定文字解释自己有多硬。第二条是术语要与可推演的技术同源，不要复读科幻梗：来源侧给出的是一致性要求而非命名清单，故这条属从画面层外推，标低证据——但有一条仓库纪律可直接沿用：能靠画出来的别写成一行字，界面上的标签要写功能（见画面层第一条），而不是写「未来感」。第三条是一次来源明确的界面文本纪律：一部作品的评测点名「字号糟透了」、「菜单文字可以调大小，但对话与字幕没法调」，以及「开锁用的撬锁器被放在杂项垃圾堆里」这类归类错误——所以硬科幻的界面文本第一条硬规则是**字号可调、归类讲得通**，仪表标签必须让人不查术语表就明白这台设备是干什么的（与蒸汽朋克包的「回读测试」同构）。第四条是数字与单位的可读性：既然本包要求技术可推演，读数就应当带单位、且在同一个量级体系里（速度、质量、压力、温度），不能出现「修复(2)」这种没有宾语的提示；这条来自界面批评的具名反例，标为有限证据方向。第五条是世界观信息要克制：与各风格包同构，lore 倾倒的代价在这里不只是「像在备考」，还会把「可推演」变成「要背课文」——只给当下相关、且能支撑玩家做出判断的部分。本槽位整体如实标低证据，不冒充来源。',
    feedback: '反馈层证据单薄，本包在声画反馈与界面反馈上各拿到若干可执行方向，但**缺「同一操作两种硬科幻化反馈」的对照实验**，且部分来源的独立性不足，以下为方向、不给默认推荐。方向一（本槽位唯一拿到两条独立一手的方向，可作默认）：真空中声音的「静」不是不播，而是换通道——一手开发者日志写明「真空中本应几乎无声，但由于音效与武器反馈是让战斗手感成立的重要元素，团队必须折中。游戏里的声音是闷住的，但玩家仍能通过振动、呼吸和无线电声获得反馈」；另一条独立的音频设计记录同向，并给出更细的做法：进入零重力太空时「所有外部音都被静音，只留下艾萨克舱服内的声音——他的呼吸声、靴跟敲击船体的金属声」，被记录为「游戏里最安静的时刻之一」，而回到舱内后「引擎室的轰鸣——游戏里最响的房间」迎面袭来，**对比在此发挥到极致**。所以本包的口径是：真空段落的反馈改走舱内声（呼吸、心跳、靴声、无线电），且「静」是用来做大对比的手段而不是终点。方向二（界面作为反馈，来源较厚但作者群重叠）：硬科幻界面的原理性判据是一手从业者写下的「生死攸关的可用性」——「你不能让一个正处在极端紧急情况中的受训宇航员感到困惑」；可执行做法来自另一份座舱界面案例：「先分层级（区分主要与次要信息、按玩家情境导航／战斗／闲置组织 UI 元素、确保关键数据始终可达可读）」，并明确「功能与清晰度必须永远胜过视觉复杂度」。具名反模式（来自对一部作品的逐条拆解）——无标签的图标、视觉层级的焦点放在最没用的信息上、各菜单像不同团队做的、整体缺乏一致性；作者判词是「界面每一次用起来都像在干活」。反面还有一条来自模拟派的失败：一部极端写实的作品被评为「同样的写实既让它迷人，也造成了它最大的弱点」，其中一条是「战斗有时很难在视觉上解读，因为太多复杂性发生在表层之下、通过计算与不可见的系统」——所以**可见性是本包界面必须偿还的债**，不能把关键状态藏在仪表深处。方向三（让步显式，来自一手）：凡为了体感放弃的物理真实性都要写下来，一手原话是「严格说本该做得不一样……但没法百分之百实现，因为那对玩家会非常怪」；这条在验收里表现为一份「让步清单」。方向四如实提示张力：一侧来源主张用**过场演出**替代漫长的真实航行时间尺度（「焦点坚定地留在故事与角色上，确保玩家不被乏味的玩法要素拖住」），而通行纪律里过场会降低可玩性——本包不预设哪一侧正确，只要求把选择与代价写清。本槽位整体标单薄：多条界面来源出自相近的作者群，独立性不足，不得当成已证实的默认推荐。',
  },
  verification: [
    '可外推检验：对场景里每一件关键技术物件，逐个回答「从今天已有的哪项技术出发、沿哪条线推演得到它」。答不出的物件要么补上推演链、要么明确标为「本作的软科幻成分」（如无物理理由的超光速、人工重力），不得含糊地混在硬科幻里当既成事实。依据是开发者一手原话给出的方法（从当下航天技术画一条线向外推）。',
    '功能可读检验：把画面里的全部按钮、面板、仪表逐个过一遍，逐个回答「它是干什么用的、玩家能不能不查术语表就知道」。无功能、说不出用途的装饰性面板与图标一律标记为塌法（与蒸汽朋克包的「装饰齿轮」同构）。依据是开发者一手原话「飞船上的按钮不是神秘的，上面有标明功能的标签」。',
    '有人住过检验（反无菌）：检查「冷冰冰、临床感、不像有人住过」的连续画面占比。若主要活动区域完全没有「有人住过」的痕迹（贴纸、便条、用旧了的接口、手写标签、私人物件），判为把功能主义做反。依据是开发者一手原话明确要求避开无菌环境、并给出「人们墙上还是会有乐队海报」这类具体痕迹。',
    '尺度是否被设计检验：对每一段「大而空」的连续内容（长距离航行、空旷星球、只有资源的中转段），逐个回答「玩家在这里要读的是什么」——是可计算的窗口／相对速度／危险源，还是只是在等计数器归零？答不出前者的段落判为苦役而非尺度，逐处删减或补上「可读的自然力量」。依据是三条独立来源同向的失败模式（大而空、一小时十五分钟看计数、赶路纯坐牢）与一条正面做法（让玩家学会读自然力量）。',
    '真空声音通道检验：逐个检查每一段真空／舱外段落，确认「外部音的处理」与「替代反馈通道」都被显式安排过——是否有舱内声（呼吸、心跳、靴声）、振动、无线电？若真空段落只是把音量调低、或直接沿用普通环境音，判为未处理。依据是两条独立一手来源给出的同构做法（外部音静音或闷住，反馈改走舱内声与振动）。同时检查「静」是否被用于做大对比（最静之后有最响），而不是全片一律安静。',
    '界面功能优先检验（生死攸关的可用性）：把每一个界面逐屏过一遍，逐个回答——关键数据（我还有多少氧／燃料、我在往哪飘、船还差什么）是否始终可达可读？是否按情境（航行／战斗／闲置）重排？视觉层级的焦点是否落在做决策时最有用的信息上？若出现「无标签图标」「焦点是最没用的信息」「各菜单风格不一」任一项，判不合格。依据是一手从业者给出的原理性判据与具名反模式清单。',
    '字号与归类检验：确认界面字号与字幕都**可调**（不止菜单可调、对话与字幕也可调），且物品与功能的归类讲得通（玩家不会把关键物品当垃圾顺手卖掉）。依据是媒体与玩家点名的两条具名反例（字号过小／字幕不可调、撬锁器被归入杂项）。',
    '可见性偿还检验：确认关键状态不是「发生在表层之下、通过计算与不可见系统」——把模拟里真正决定胜负的隐藏变量（热、delta-v、探测距离、耗材）逐个检查：玩家能不能在画面上读到它？读不到的就补一个可视读数或可视后果。依据是模拟派失败案例里被点名的弱点（太多复杂性不可见，玩家与正在发生的事失去连接）。',
    '让步清单检验：交付前必须写出「本作为了体感放弃或简化的物理真实性清单」，至少覆盖重力／零重力、真空声音、比例与距离、时间尺度四类中的实际涉及项，并写明每项让步付出了什么、换来什么。写不出来说明要么真的全做对了（罕见，需举证）、要么把让步藏起来了。依据是开发者一手承认的让步（按物理本该不同但会让玩家感觉像在水下）与团队自身被零重力镜头搞晕的记录。',
    '资源投放检验：检查美术预算是否投在「玩家真会走的那段路」上。若出现「内饰细节铺张、但玩家长时间所在的行走／航行段却乏善可陈」的落差，判为资源投错地方。依据是评测对一部作品点名的落差（内饰惊艳 vs 行星表面乏善可陈）与「没有载具、兴趣点动辄几百米、赶路纯坐牢」的玩家结论。',
    '叠加冲突检验：若与恐怖氛围叠加，逐处确认「不安」由恐怖氛围包定义（预期、留白、静音）、本包只负责技术可信与尺度可读，不得用本包的「可读」判据去覆盖恐怖包的「留白」判据；若与像素／复古叠加，确认技术纪律（像素尺寸、色数、缩放）以像素包为准、本包只负责「外推链与功能可读」。若项目实际要的是太空歌剧／软科幻观感，确认本包判据未被误用。',
    '上述各条中凡涉及观感与技术可信度的判断（物件是否可外推、尺度是否被读、真空段落是否成立、界面是否可读），都必须交给目标用户实际看过、玩过、评过，不能只由设计者自评「我觉得很硬科幻」——依据是仓库内既有卡片：开发者长期浸在自己的设计里，对玩家的实际反应天然无感，「我觉得没变」不能推翻用户说变了。评测结果与自评分开记录。另外，本包已如实登记三处来源分歧（「大而空」究竟是缺陷还是设计意图、某部作品算不算硬科幻范本、真实感该服务体验还是服务模拟），评审时不得把任何一派当成唯一正确答案。特别提示：本包整体证据显单薄（画面／文本／反馈三层均偏薄，缺「同一场景两种处理」的对照），使用时应把它当作方向与反模式清单，而不是已验证的默认推荐。',
  ],
};

const METROIDVANIA_PACK = {
  schemaVersion: 1,
  id: 'genre.metroidvania',
  axis: 'genre',
  value: 'metroidvania',
  title: '银河恶魔城',
  shortTitle: '银河城',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。能力门控的固定地图探索归本包，随机生成地图与局内构筑归肉鸽包。',
  review: {
    title: '银河城首局先证明「看见的锁」真的会被能力打开',
    detail: '按已选目标制作一小块地图，检查玩家能否在拿到第一个能力后主动回到先前见过的某处、亲手开掉至少一处当时过不去的门，并说出世界因此变大；制作时先在一张图上画完房间与能力，再动手做内容。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('unlock', '用第一个能力打开先前见过却过不去的门', '玩家的一块小地图上散布着看得见、进不去的门与缝隙；拿到第一个能力后回溯开锁、世界扩张算达成，始终找不到一处已见门算失败。'),
      choice('traverse', '从入口穿过多段新能力、抵达深处的出口', '玩家沿一条能力门控的路线向深处推进，沿途的门依次吃不同的新能力；抵达出口算胜，被卡在无路可走处算败。'),
      choice('map', '把一小块地图的探索度补满并取下核心奖励', '玩家在同一块小区域里反复往返、用新能力补齐先前够不到的分支；探索度达标并取走区域钥匙算胜，遗漏关键分支无法推进算败。'),
    ],
  },
  questions: [
    {
      id: 'mv_gate_ratio', group: '银河城第一局', topic: '能力门配比',
      prompt: '一个能力拿到手，应该马上打开几处「已经见过但进不去」的门？',
      why: '这是决定「像银河城还是像带快速旅行的平台游戏」的那一条。给少了，世界不觉得在扩张；给多了，回跑变成苦差事。',
      options: [
        choice('two_plus', '每个能力至少打开 2 处已见过的门', '世界明显扩张、回溯有回报；代价是每加一个能力都要回头检查地图，房间图必须先画完。'),
        choice('one', '每个能力只对应一处门', '结构简单、好控制；但玩家的推进更像换钥匙，扩张感薄，容易做成线性关卡加回溯。'),
        choice('dense', '密集铺门，每个能力对应 3 处以上', '扩张感最强；但回跑量会放大，需要快速旅行或捷径兜底，否则玩家会抱怨拖沓。'),
      ],
      recommended: 'two_plus', depth: 'deep', when: 'metroidvania_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'mv_gate_style', group: '银河城第一局', topic: '门控形态',
      prompt: '第一块地图的门，主要用软门控还是硬门控？',
      why: '能力型门天然软（能力不到就走不过去），但门本身要是世界里的对象；无理由的空气墙会把沉浸感打穿。',
      options: [
        choice('soft', '软门控：能力不到就走不过去，但门是世界内的对象', '玩家把限制体验成探索而非禁止；实现最轻，也最符合品类的默认手感。'),
        choice('explained', '硬门控：明确的墙或闸，但配世界观内的解释', '适合当「大章节分界」；需要一段世界观交代，否则玩家会读成空气墙。'),
        choice('mixed', '先软后硬：前期靠能力，后期用明确闸门切章节', '节奏分层清楚；但两套门都要各自可见、可读，表现成本更高。'),
      ],
      recommended: 'soft', depth: 'deep', when: 'metroidvania_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'mv_backtrack', group: '银河城第一局', topic: '回跑与捷径',
      prompt: '玩家怎么减少「原路走回去」的烦躁？',
      why: '回跑是这个品类的骨架，但长距离、没捷径的回跑是玩家差评最集中的一条；首版就要定下缓冲手段。',
      options: [
        choice('shortcuts', '开单向捷径与近道，把世界连成一圈', '用少量新通路把来回距离压短；最贴品类手感，实现成本可控。'),
        choice('fast_travel', '快速旅行：存档点之间直接传送', '最省事地消掉长回跑；但传送一多，世界的空间记忆会被稀释。'),
        choice('upgrade_route', '给旧区域换新走法：新能力让老路更快', '同一个地方用新能力走出不同路线，回跑变成展示成长；设计成本最高。'),
      ],
      recommended: 'shortcuts', depth: 'deep', when: 'metroidvania_genre', dependsOn: ['首局目标', '能力门配比'],
    },
    {
      id: 'mv_scope', group: '银河城第一局', topic: '首版规模',
      prompt: '第一块可玩地图做多大？',
      why: '这个品类最容易死在「做得太大」；先把一小块地图的门控闭环跑通，再谈扩张。',
      options: [
        choice('tiny', '极小一块：约 12 个房间、3–5 个能力', '闭环最快跑通、最好改；代价是内容看上去不多。低证据方向：规模数字来自单篇教程，仅作起点参考。'),
        choice('medium', '中等：一张能看出群系差异的地图', '卖相更好；但在门控闭环被验证前就投入，返工风险高。'),
        choice('expand_later', '先极小、把结构做活，之后再横纵向加区域', '前期风险最低；要求房间图从一开始就留出可插接的接口。'),
      ],
      recommended: 'expand_later', depth: 'deep', when: 'metroidvania_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'mv_combat', group: '银河城第一局', topic: '战斗占比',
      prompt: '第一块地图里，战斗要承担多大的分量？',
      why: '战斗能撑探索的密度，但战斗一重，玩家的第一关注点就从「开锁看世界」偏移到「打赢这场」。',
      options: [
        choice('light', '轻战斗：敌人主要是障碍与节奏，重点在探索', '最贴合「探索为主」的首版；实现轻，也最容易先验证门控闭环。'),
        choice('even', '战斗与探索并重', '耐玩度更高；但敌人种类、AI 和数值都要同步铺开，成本翻倍。'),
        choice('heavy', '重战斗：战斗本身就是主要乐趣', '接近「类魂横版」；会与肉鸽、动作包的判据重叠，且首版风险最高。'),
      ],
      recommended: 'light', depth: 'deep', when: 'metroidvania_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'mv_save', group: '银河城第一局', topic: '存档与失败代价',
      prompt: '玩家死一次，要付出多少重走代价？',
      why: '长回跑 + 低容错是这个品类玩家流失的主因之一；失败代价直接决定「探索」体验成不成立。',
      options: [
        choice('near', '存档点靠近危险，死亡后很快能重来', '探索压力低、适合先验证闭环；代价是紧张感弱。'),
        choice('defined_cap', '回跑距离有明确上限，靠捷径控制单程时长', '给紧张感但不惩罚过头；需要先把地图连通性做扎实。'),
        choice('harsh', '长回跑 + 尸体回收，强调惩罚', '紧张感最强；但已被玩家大量抱怨为「无意义的难度填充」，最不推荐首版采用。'),
      ],
      recommended: 'defined_cap', depth: 'deep', when: 'metroidvania_genre', dependsOn: ['首局目标', '回跑与捷径'],
    },
  ],
  prototype: {
    loop: '玩家在房间图里探索 → 撞见看得见却过不去的门 → 去别处找到并拿到新能力 → 主动折返用能力开掉那处门 → 世界变大、出现新路线 → 到达深处的目标处完成或失败，可重开。',
    missions: {
      unlock: '占位场景：一块约十来个房间的小地图，入口附近先摆两处「看得见、进不去」的门。玩家在可达区域内探索、拿到第一个能力后，其中至少两处门应立刻可开；玩家自己折返开锁、世界出现新通路算达成。始终找不到已见门、或第二个能力也不能打开任何先前见过的门，都判失败。',
      traverse: '占位场景：一条从入口通往深处出口的能力门控路线，沿途三到四道门各吃一种新能力。每拿到一个能力，都应有至少一处已在路上见过的门随之可过。玩家抵达出口算胜；被卡在一处无路可走的死点算败，并显示是哪一道门卡住了。',
      map: '占位场景：一小块可反复往返的区域，分布着需要不同能力才能拿到的分支与一处核心奖励。玩家用新能力逐步补齐先前够不到的分支，探索度达标并取走钥匙算胜；存在关键分支因缺能力而无法推进、且当前再无新能力可得，判失败。',
    },
    acceptance: [
      '首局只有一种明确达成条件和一种明确失败条件，卡住时光标能指出卡在哪一处门。',
      '首局能力数以 3–5 个为起点参考（低证据，仅作起点而非硬性门槛）；每个能力都解锁至少 2 处玩家在拿到它之前已经见过的门（拿到前要能看见，拿到后要能开）。',
      '从入口（零能力）出发的可达区域能触及第一个能力所在房间；否则开局即卡死。',
      '每个门按能力类型有可区分的视觉形态（例：裂缝墙对应轰炸、水面拱门对应下潜、高平台对应二段跳），玩家能不靠文字就大致映射。',
      '从存档点到最近目标处的单程路程有明确上限；超限处必须有捷径或快速旅行兜底。',
      '有存档或读取时，恢复的不只是位置，还有已获得的能力标志。',
      '在目标设备上从开局玩到达成或失败，再完成重开。',
    ],
    defer: ['程序化／随机生成地图（多位开发者尝试后废弃，风险最高）', '多结局与多路线分支', '数值／装备／等级 RPG 系统', '全量美术与配乐（先用灰盒房间与手感验证结构）', '大地图与多群系铺量', 'meta 局外成长与永久解锁', '无先例的新移动机制'],
  },
};

const VISUAL_NOVEL_PACK = {
  schemaVersion: 1,
  id: 'genre.visual-novel',
  axis: 'genre',
  value: 'visual-novel',
  title: '视觉小说或叙事冒险',
  shortTitle: '视觉小说',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。以阅读推进与作者设计的分支为主归本包；谜题本身是核心挑战归解谜包，能力门控探索归银河城包。',
  review: {
    title: '叙事首局先证明「读得下去、选得有感、结得住」',
    detail: '按已选目标制作一段可读内容，检查读者能否读完一个完整章节、说出至少一个人物的具体特质、在做出选择后说得出游戏记住了什么，并走到一个有收束感的结局；制作前先写完整结构文档，别一边写一边加分支。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('read_through', '读完一个完整短篇并抵达唯一结局', '玩家从开场一路读到结局，全程零分支或仅有无后果的表态选择；读完并看到收束算达成，中途放弃算失败。'),
      choice('branch_once', '在一处关键选择上走出自己的一条路', '玩家在主干上遇到一个会改变后续内容的选择，并在若干章后看见它的即时反馈与角色反应；抵达该线的结局算达成，选择被无视而被察觉算失败。'),
      choice('reach_ending', '把主干读完并解锁一个「真结局」所需的前置', '玩家先走完一条最直接的线，再因记住/积累的信息打开通往另一条结局的路；两个结局都能读到算达成，真结局需要的信息无法在已读内容里取得判失败。'),
    ],
  },
  questions: [
    {
      id: 'vn_shape', group: '叙事第一局', topic: '结构形态',
      prompt: '第一版的故事用哪种结构？',
      why: '这是动笔前最重要的一个决定：形态直接决定词数成本与测试成本，后面所有选择点都在这个形状里排。',
      options: [
        choice('kinetic', '单线：一个故事一个结局，零分支', '词数与测试成本最低，全部心力放在文本质量与演出节奏；对首次做叙事的人通常最稳妥。代价是重玩动机弱。'),
        choice('trunk_branch', '主干＋短枝：一条必读主干，少量会汇流的选择', '最常见的折中：选择主要靠即时反馈与角色反应兑现意义，而不是靠分叉；实现与产能都可控。'),
        choice('hub_spoke', '多线：共通线加各角色线，通往不同结局', '角色挖掘最深、重玩动机最强；但共通线、各线、分支点都要写足与测到，成本成倍上升。'),
        choice('mystery', '多线解谜：各线各给一块拼图，集齐才开真结局', '结构张力最强、也最复杂；必须先写完整结构图，否则写到一半必崩。首版一般不做。'),
      ],
      recommended: 'trunk_branch', depth: 'deep', when: 'visual_novel_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'vn_choice_type', group: '叙事第一局', topic: '选择形态',
      prompt: '第一版的选择主要用哪一种？',
      why: '选择有三种性价比截然不同的做法：换路最贵、开门条件便宜、角色后续提及最便宜也印象最深。新手最常见的死在「换路给太多、记住给太少」。',
      options: [
        choice('remember', '记住：故事照旧，但人物会提起你做过什么', '最便宜、印象最深；玩家感到「被记住」，且不增加分支量。首版最推荐先做这一种。'),
        choice('restrict', '开门：某条路只有在之前发生过某事时才打开', '成本低、让结局显得是挣来的；但要保证玩家在选择当刻知道它重要，不能变成不归路。'),
        choice('branch', '换路：选择后剧情走向另一条路', '最有分量也最贵——它会复制其后的一切，且大量分支玩家一次看不到；首版只做极少量。'),
      ],
      recommended: 'remember', depth: 'deep', when: 'visual_novel_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'vn_feedback', group: '叙事第一局', topic: '选择反馈',
      prompt: '玩家做完选择后，多久、以什么方式看见反馈？',
      why: '玩家会察觉自己在「假装玩」，不是因为分支不够多，而是因为选择之后世界毫无反应；反馈层是意义感的真正来源。',
      options: [
        choice('immediate', '立刻：一句话、一个表情或一段后续马上不同', '意义感最直接、实现最轻；首版优先做这一层。'),
        choice('character', '角色反应：NPC 对玩家的态度与台词随之前的选择改变', '最有沉浸感；需要为角色维护少量状态，成本中等，是 Remember 的升级形态。'),
        choice('delayed', '延迟：几章之后才揭晓这个选择的后果', '悬念强、戏剧性高；但玩家容易把「没反应」读成「选择没用」，首版要克制使用。'),
      ],
      recommended: 'immediate', depth: 'deep', when: 'visual_novel_genre', dependsOn: ['首局目标', '选择形态'],
    },
    {
      id: 'vn_scope', group: '叙事第一局', topic: '首版规模',
      prompt: '第一段可读内容做多长？',
      why: '叙事最容易死在「写不完」；先定一个能写完的字数上限，再谈加线加量。规模数字口径不一，只作起点参考。',
      options: [
        choice('short_kinetic', '极短：约五千词、十五到二十五分钟、一个结局', '闭环最快跑通、最容易改完；代价是内容单薄。低证据方向：规模数字出自引擎官方教程，仅作起点参考。'),
        choice('short_multi', '短篇：一到两万字、两三个小时，含一个可感选择', '体量适中、能撑起一个完整的小故事；是多数首作的合理目标。低证据方向：数字出自中文开发指南，仅作起点参考。'),
        choice('expand_later', '先极短、把结构与反馈做活，之后再纵向加章', '前期风险最低；要求结构文档从一开始就留出可插接的接口。'),
      ],
      recommended: 'expand_later', depth: 'deep', when: 'visual_novel_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'vn_protagonist', group: '叙事第一局', topic: '主角与视角',
      prompt: '玩家的主角是什么样的人？',
      why: '在叙事作品里「故事就是玩法」；空白主角会把全部戏剧张力推给配角，读者也就失去了可投射的立场。',
      options: [
        choice('voiced', '有明确声音与立场的主角', '读者有一个具体的人可以代入与其选择；最低要求，也是本包的默认。'),
        choice('anchored', '半定：核心立场固定，细节留给玩家填补', '兼顾代入与作者控制；需要在关键处明确「这是主角的选择，不是玩家的选择」。'),
        choice('blank', '空白主角，由玩家决定一切', '看似自由，实则让读者无法投射；是被大量批评的做法，首版不推荐。'),
      ],
      recommended: 'voiced', depth: 'deep', when: 'visual_novel_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'vn_ending', group: '叙事第一局', topic: '结局与失败',
      prompt: '第一版怎么处理「坏结局」与失败？',
      why: '坏结局写成戛然而止的 Game Over，会让读者读了几小时却毫无收束感；但坏结局太密又会把阅读变成反复重来。',
      options: [
        choice('closure', '坏结局也是完整结局：有交代、有收束', '读者即使走到坏结局也读完了一个故事；最符合阅读体验，实现上只是把结局写完整。'),
        choice('sparse', '只做极少结局，坏结局也清晰少见', '读者不容易因反复重来出戏；重玩动机相应偏弱，适合单线偏主干的形态。'),
        choice('many', '多而密的结局与 Game Over', '悬念强、重玩空间大；但已被大量读者抱怨「像 Game Over」「半小时撞两个结局」，首版慎用。'),
      ],
      recommended: 'closure', depth: 'deep', when: 'visual_novel_genre', dependsOn: ['首局目标'],
    },
  ],
  prototype: {
    loop: '读者读到一个具体场景与人物 → 在关键处做出一次选择 → 立刻或不久后看见这句话/这个态度因之不同 → 继续读完一个完整章节 → 抵达一个有收束感的结局，可重开读另一条路。',
    missions: {
      read_through: '占位场景：一个单线短篇，开场几分钟内先立住主角声音与一个人物关系，中间有几处无后果的表态选择（选完立刻有一句不同的回应）；读者读完一个完整章节并抵达唯一结局算达成，中途读不下去算失败。全程记录读者在哪一句、哪一段停下的。',
      branch_once: '占位场景：一条主干上摆一个明确的关键选择，选完当刻就有一句可感的即时反馈，往后数章里至少有一处角色会提起它；读者走到这条线的结局算达成。若读者读完却说不出「游戏记住了什么」，判失败。',
      reach_ending: '占位场景：一条最直接的线先读完，途中埋下的信息（一次对话、一件被记住的事）成为打开另一条结局的前置；读者能读到两个不同结局算达成。若真结局需要的信息在已读内容里根本拿不到、只能靠重读盲试，判失败。',
    },
    acceptance: [
      '首局只有一种明确达成条件和一种明确失败条件；失败（读不下去）时的停读位置被记录下来。',
      '首局每个选择点都写明「它改变了什么」，并标注类型：换路 / 开门条件 / 角色后续提及。角色提及与开门条件的数量应不少于换路。',
      '不存在不归路：任何会锁定路线或导致坏结局的选择，玩家在选择当刻或紧随其后都能知道它重要。',
      '坏结局含有收束内容，不是戛然而止的 Game Over。',
      '读者读完一个完整章节后能说出至少一个人物的具体特质，并说出「这一个决定是我的」。',
      '动笔前存在一份完整结构文档，写明每条线、每个主选择点、每条线的词数目标与线之间的关系。',
      '在目标设备上从头读到一个结局，再完成重开。',
    ],
    defer: ['全量配音（关键场景选择性配音即可，非首版前提）', '多线解谜（multi-route mystery）结构', '全量美术与大量立绘表情（先用占位素材验证文本与结构）', '自由行动找触发点式的叙事冒险', '主线分叉超过三处的多路结构', '局外长线与多周目解锁系统', '让玩家从头到尾扮演无立场的空白主角'],
  },
};

const PUZZLE_PACK = {
  schemaVersion: 1,
  id: 'genre.puzzle',
  axis: 'genre',
  value: 'puzzle',
  title: '解谜',
  shortTitle: '解谜',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。以理解与推导为核心挑战、解开即推进归本包；阅读推进与作者设计的分支归视觉小说包，能力门控探索归银河城包，靠手速与精度解开的归动作包。',
  review: {
    title: '解谜首局先证明「讲得清、想得通、说得明」',
    detail: '按已选目标制作一组可玩谜题，检查玩家能否在自己形成的错误假设上撞到矛盾、靠游戏教过的规则而非尝试次数解开，并在解完后说得出为什么这样解；制作前先把每关「考验什么、错误框架是什么、矛盾点是什么、确认线索是什么」写成表，别一边做一边加机制。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('mechanic_ladder', '一条规则加五到八关阶梯，证明规则本身立得住', '玩家从最简形态学会一条规则，再在逐关变化里把它用到底；全部关卡都用同一套规则解开算达成，靠新增机制或猜出题人意图过关算失败。'),
      choice('insight_room', '一组各自独立的洞察关，每关一个「原来是这样」', '玩家在每关撞上一个几乎成功、最后一步失败的错误思路，随后自己换框架解开；解完后能说出为什么算达成，靠反复试错撞对算失败。'),
      choice('deduce_chain', '一条可演绎的推理链，答案唯一且可从已给信息推出', '玩家靠排除与逻辑一步步收窄，最终结论可由线索唯一确定；玩家能复述推理链算达成，需要外部知识或猜测算失败。'),
    ],
  },
  questions: [
    {
      id: 'pz_axis', group: '解谜第一局', topic: '关卡形态',
      prompt: '第一版主要做哪一种谜题？',
      why: '三种谜题的成本和验收完全不同：机制阶梯考「一条规则能挖多深」、洞察关考「误解能不能被设计出来」、演绎链考「唯一解与推理链能不能立住」。混做会让首局既证不了任何一条。',
      options: [
        choice('ladder', '机制阶梯：一条规则的由易到难若干关', '成本最低、最可控；先把一条规则的深度挖出来，再谈加第二条。对首次做解谜的人最稳妥。'),
        choice('insight', '洞察关：每关一个独立顿悟，不求长链推理', '单关爆发力最强、最容易出「啊哈」；但每关都要单独设计误解与矛盾，内容不可复用，成本随关数线性上涨。'),
        choice('deduction', '演绎链：有明确规则、靠排除收窄、答案唯一', '最能给「想通了」的确定感；但要求规则完备、答案可判定，规格没写死就会出现多解或不公平。'),
      ],
      recommended: 'ladder', depth: 'deep', when: 'puzzle_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'pz_teach', group: '解谜第一局', topic: '教学方式',
      prompt: '第一版怎么让玩家学会规则？',
      why: '解谜设计脱不开教育：最好的教学是让玩家自己发现规则，而不是读一段说明。但「完全不教」在首局风险极高，可能让玩家一直不知道在考什么。',
      options: [
        choice('discover', '完全不讲，用最初几关让玩家自己发现规则', '顿悟质量最高、最贴合品类精神；但首局若前几关没被读懂，玩家会直接流失。需要把关卡做得极简可读。'),
        choice('demo_then_use', '先用一两关演示这条规则，再用后面的关卡考它', '成本与风险最平衡；演示关必须让规则成为「唯一可能成立的事」，否则会退化成教程。首版推荐。'),
        choice('explain_first', '先给文字说明，再进关卡', '最不容易卡住；但会把「发现」变成「应用」，顿悟质量明显下降，也更容易让玩家按步骤执行而非思考。'),
      ],
      recommended: 'demo_then_use', depth: 'deep', when: 'puzzle_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'pz_fairness', group: '解谜第一局', topic: '公平性口径',
      prompt: '第一版允许玩家卡多久、怎么保证公平？',
      why: '品类的差评几乎都来自「不公平」：moon logic、像素狩猎、猜设计者的心、靠游戏里没教过的规则。公平不是在谜题外补一句提示，而是在设计谜题时就把「玩家凭什么想得到」写清楚。',
      options: [
        choice('all_in_game', '所有必要信息都在游戏里，且都在玩家能观察到的地方', '最贴合品类；要求每关都过一遍「玩家在揭示前能否掌握所有必要事实」的检验。首版推荐。'),
        choice('breadcrumb', '允许留级，但控制线索直接度：远的线索可稍间接', '能做出深度与张力；但如果玩家分不清「间接线索」和「装饰」，就会退化成试错，须给确认线索兜底。'),
        choice('hint_escape', '默认难，靠提示系统与攻略逃生', '看起来最省事；但玩家需要查攻略的地方就是设计失败的地方，且默认难会显著拉高流失。首版不建议。'),
      ],
      recommended: 'all_in_game', depth: 'deep', when: 'puzzle_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'pz_hint', group: '解谜第一局', topic: '提示设计',
      prompt: '如果玩家卡住，第一版给什么层次的帮助？',
      why: '提示的目的是让玩家回到有效推理，而不是替玩家完成顿悟。给答案等于用几个月的设计换几秒的解卡；完全不给又会让玩家去搜攻略。',
      options: [
        choice('assumption', '只点出值得怀疑的那个假设', '性价比最高：既不告诉答案，又把卡住玩家的那个误解指出来，顿悟仍然是玩家自己完成的。首版推荐。'),
        choice('ladder', '分级：先重述目标、再指向元素、最后才逐步给解法', '覆盖不同卡度的玩家；但要做五级内容并调好触发时机，成本较高，且末级仍等于给答案。'),
        choice('none', '不给提示，让玩家自己憋', '保住顿悟纯度；但会在首局把轻度玩家直接筛掉，且他们多半会去搜答案而不是继续想。'),
      ],
      recommended: 'assumption', depth: 'deep', when: 'puzzle_genre', dependsOn: ['首局目标', '公平性口径'],
    },
    {
      id: 'pz_difficulty', group: '解谜第一局', topic: '难度曲线',
      prompt: '第一版的难度怎么排？',
      why: '解谜的难度不该是一条平滑的坡道；每引入一个新东西，都要先把难度降下来让玩家站稳，再把这一个想法挖到穷尽。做成坡道会让玩家在某一关撞墙，做成锯齿才有节奏。',
      options: [
        choice('sawtooth', '锯齿：每个新规则先降难度，再逐关加深', '最贴合品类手感；要求每一关只考一个「新面貌」，复杂度不突增。首版推荐。'),
        choice('ramp', '平滑上升：每关比上一关难一点点', '容易理解、便于排序；但对玩家是持续的隐性压力，一旦某一关高出一截就变成断崖。'),
        choice('spike', '放置少数明显的高难关作为招牌', '能做出记忆点与传播素材；但首版就放高难关，会把还没建立信任的玩家直接筛掉。'),
      ],
      recommended: 'sawtooth', depth: 'deep', when: 'puzzle_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'pz_scope', group: '解谜第一局', topic: '首版规模',
      prompt: '第一版做多少关？',
      why: '解谜最容易死在「关卡数堆太多」与「机制堆太多」；先定一个能做完并由自己逐关通关的关卡数上限，再谈加量。',
      options: [
        choice('tiny', '极小：一条规则、五到八关、可在一次坐玩完', '闭环最快跑通、最容易逐关改完；代价是内容单薄，几乎不能承载剧情。低证据方向：关卡数量出自开发者访谈的零散口径，仅作起点参考。'),
        choice('small_set', '小套：一条规则、十余关，含一关明显的高难收尾', '体量适中、能让人感到「这套规则被挖过」；是多数首作的合理目标。低证据方向：数字出自开发者访谈，仅作起点参考。'),
        choice('expand_later', '先极小、把规则与可读性做活，之后再纵向加关', '前期风险最低；要求每关四要素（考验什么/错误框架/矛盾点/确认线索）从第一关就写成表。'),
      ],
      recommended: 'expand_later', depth: 'deep', when: 'puzzle_genre', dependsOn: ['首局目标'],
    },
  ],
  prototype: {
    loop: '玩家进入一关 → 形成一个合理但错误的假设 → 用这个假设几乎走通、在最后一步失败 → 撞上某个拒绝合作的事实 → 在同一批事实里换一个框架、整套线索同时变简单 → 解开并继续下一关（或卡住后按提示阶梯退回有效推理）。',
    missions: {
      mechanic_ladder: '占位场景：一条规则（例如「同色相斥」这类一句话能说清的规则）配五到八关，第一关让规则成为「唯一可能成立的事」、其后每关只考这条规则的一个新面貌；玩家能把全部关卡用同一套规则解开算达成。若玩家靠猜出题人意图或靠新增未教过的机制过关，判失败。逐关记录玩家在哪一关的哪一步停顿。',
      insight_room: '占位场景：一组各自独立的洞察关，每关设计一个「几乎成功、最后一步失败」的错误思路，以及一个能推翻它的矛盾点；玩家解完后能说出「为什么这样解」算达成。若玩家靠反复乱试撞对、或说出「我就是一直试」，判失败。',
      deduce_chain: '占位场景：一条可演绎的推理链，规则完备、答案唯一、所有必要线索都在玩家可观察处，并配确认线索告诉玩家走在对的路上；玩家能复述推理链算达成。若答案需要外部知识、或存在两条都能成立的解法而设计者未作处理，判失败。',
    },
    acceptance: [
      '首局只有一种明确达成条件和一种明确失败条件；失败（卡住）的停顿位置被记录下来。',
      '每关都写明三件事：考验什么（观察/逻辑/模式识别/协作/耐心）、错误框架是什么、矛盾点是什么；写不出这三件的关卡不进首版。',
      '每关过一遍公平性检验：玩家在揭示之前有可能掌握所有必要的事实；所有必要规则都在游戏内教过。',
      '每关至少有一条确认线索，让玩家知道自己走在对的路上；若所有元素看起来同样重要，判失败。',
      '错误框架必须是玩家凭游戏教过的东西自己形成的，且从所见通向答案是一条推理链而不是一次跳跃。',
      '归纳检验：玩家解完后能解释「为什么这样解」；说「我就是一直乱试」判失败。',
      '提示只点出值得怀疑的假设，不直接给答案；提示由玩家主动索取，不自动弹出。',
      '关键交互物能从背景中清楚区分，不依赖像素级寻找。',
      '同一套规则贯穿全部关卡，不存在用两种不一致的方式解释同一事实的关卡。',
      '重置与撤销要快而无痛，玩家做错不会被长时间惩罚到畏缩、停止实验。',
      '难度是锯齿：每引入一个新东西先把难度降下来，再逐关加深；不出现复杂度突增的断崖。',
      '在目标设备上从头逐关通关，并自行找出非预期解后作出处理（封掉或当特性）。',
    ],
    defer: ['程序生成与求解器（没有求解器的生成器只会产出 bug）', '非线性大地图与开放式关卡选择', '第二条游戏机制（先证一条规则能被挖到穷尽）', '全量剧情、演出与配音', '全量美术与定制动画（先用最简单可读的图形验证规则能不能被读懂）', '关卡编辑器与 UGC 关卡分享', '局外长线系统（成就、每日挑战、多层解锁）', '考验手速与精度的关卡', '需要真实世界或冷门外部知识的谜题', '一次不诚实的谜题（信任是全局资产，第一版就要用统一规则贯穿全部关卡）'],
  },
};

const PARTY_PACK = {
  schemaVersion: 1,
  id: 'genre.party',
  axis: 'genre',
  value: 'party',
  title: '派对或聚会游戏',
  shortTitle: '派对',
  status: 'complete',
  boundary: '离线设计预设；依据公开复盘与玩家一手差评蒸馏（2026-09-29），未运行、未平衡、未试玩。',
  review: {
    title: '派对首局先证明一桌零认知玩家两分钟内笑出来',
    detail: '找一桌没玩过的人，不解释直接开：两分钟内要有第一次全员互动，一局结束 30 秒内有人主动说再来。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('laugh', '让全场笑出来一次', '每位玩家至少贡献一次被全场看到或投票的产出；票数最高者胜，不设淘汰，得票最少者拿一个安慰头衔，人人有参与感。'),
      choice('cooperate', '一起扛过混乱', '限时内全队完成多于人数的任务；达标即全队胜并按超额给星，未达标把差值记成下一局可追的债，不做失败惩罚。'),
      choice('sus', '找出那个不对劲的人', '一轮信息暴露加一次公投票决；多数方指认正确则胜，被冤者下轮获得信息特权作补偿，防止被首刀即旁观。'),
    ],
  },
  questions: [
    {
      id: 'party_group', group: '派对第一局', topic: '同桌玩家',
      prompt: '这桌人是什么关系？',
      why: '语言风格、操作基线和能不能用诈唬机制，全看这桌人混不混龄、熟不熟。',
      options: [
        choice('friends', '全是熟人朋友', '可以用内部梗和互相坑；操作基线仍要按最菜的一个人设。'),
        choice('family', '家庭混龄，含不玩游戏的长辈', '用电视语言不用游戏语言；任何时刻只让玩家做一件事。'),
        choice('mixed', '半熟社交局（同事、网友面基）', '避免过度暴露隐私的题；破冰机制比竞争机制重要。'),
        choice('online', '线上熟人语音局', '依赖语音承载反应；画面要容忍有人只看不说。'),
      ],
      recommended: 'friends', depth: 'deep', when: 'party_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'party_joy', group: '派对第一局', topic: '核心快乐',
      prompt: '这局的核心快乐押在哪一条上？',
      why: '创意、默契、互坑、诈唬是四套不同的设计肌肉；选错流派的成品机械又不好笑。',
      options: [
        choice('creative', '创意表达：写或画给别人看', '笑点由玩家亲手产出；题库是后续内容成本，机制先行。'),
        choice('chaos', '默契考验：沟通注定崩溃', '给玩家不可能优雅完成的处境，失败本身即是演出。'),
        choice('versus', '互相坑：对抗加翻盘', '必须配负反馈防滚雪球，但不能让玩家觉得胜负与己无关。'),
        choice('bluff', '诈唬推理：有人知道真相有人装', '只对熟人局成立；私密信息需要人手一机的形态。'),
      ],
      recommended: 'creative', depth: 'deep', when: 'party_genre', dependsOn: ['首局目标', '同桌玩家'],
    },
    {
      id: 'party_device', group: '派对第一局', topic: '设备形态',
      prompt: '第一版玩家们围着什么玩？',
      why: '设备形态决定能不能用私密信息机制，也决定制作量；联机是另一个量级的工程。',
      options: [
        choice('shared', '围着同一块屏幕', '成本最低，适合默契与反应类；信息全员公开。'),
        choice('phones', '一屏加人手一机（房间码）', '能做私密信息和文字输入；要处理连接与掉线。'),
        choice('pass', '轮流拿同一台设备', '零连接成本；要设计交接和防偷看。'),
        choice('online', '各自设备联机', '首版不做：同步、匹配和反作弊会淹没玩法验证。'),
      ],
      recommended: 'shared', depth: 'deep', when: 'party_genre', dependsOn: ['首局目标', '核心快乐'],
    },
    {
      id: 'party_length', group: '派对第一局', topic: '单局时长',
      prompt: '一局承诺玩多久？',
      why: '时长是派对游戏对玩家的承诺；又臭又长是差评最集中的死因。',
      options: [
        choice('short', '不超过 5 分钟', '下酒类快节奏；规则必须少到一句话。'),
        choice('standard', '10 到 15 分钟', '标准单局；能容纳一轮完整的铺垫加揭晓。'),
        choice('long', '20 到 30 分钟', '垃圾时间风险高；需要中段变化点撑着，首版慎选。'),
      ],
      recommended: 'standard', depth: 'deep', when: 'party_genre', dependsOn: ['首局目标'],
    },
  ],
  prototype: {
    loop: '玩家轮流做一个简单动作（写、画、选、喊）→ 产出公开或被投票 → 全场反应（笑、喊、指认）→ 结算并立刻可以重开。',
    missions: {
      laugh: '占位场景：每轮一个简单题目，所有人写一句蠢答案，匿名公示后投票；票数最高得分，得票最少拿"最惨奖"头衔。三轮后结算，立即重开。',
      cooperate: '占位场景：三分钟倒计时，全队要完成刻意多于人手的任务单，任务互相卡位；没人能优雅完成，混乱本身就是演出。达标给星，差值记成下局的债。',
      sus: '占位场景：人手一机各收一条私密信息，其中一人的信息与其他人不同；轮流发言后公投票决。被冤者下轮拿到额外信息特权作补偿。',
    },
    acceptance: [
      '零讲解开局：一桌零认知玩家从启动到首次全员互动不超过两分钟，无人卡住问"我该干嘛"。',
      '首局时长落在承诺值上下两成内，有明确的终点画面。',
      '一局内出现至少三次可指认的笑声或喊话时刻；试玩后每桌能复述出至少一个具体瞬间。',
      '一局结束 30 秒内有人主动提议再来一局或换人试。',
      '让没玩的人围观五分钟，他能讲出刚才哪好笑了。',
      '最少与最多人数各测一桌，两端都没有挂机或围观的垃圾时间。',
    ],
    defer: ['联机、匹配与账号系统', '大型题库与内容包', '多地图多模式与排位', '回放、分享与直播工具链'],
  },
};

const HORROR_GENRE_PACK = {
  schemaVersion: 1,
  id: 'genre.horror',
  axis: 'genre',
  value: 'horror',
  title: '恐怖或微恐治愈',
  shortTitle: '恐怖',
  status: 'complete',
  boundary: '离线设计预设；依据开发者访谈与玩家一手差评蒸馏（2026-09-29），未运行、未平衡、未试玩。',
  review: {
    title: '恐怖首局先证明恐惧来自节奏而不是跳吓数量',
    detail: '数一遍首局：真威胁只允许一两次，其余都是铺垫与喘息；同一遭遇第三次还有张力才算立住。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('shift', '撑过这一班', '玩家完成一晚例行工作清单；熬到交班且完成大部分清单算胜，状态触顶或被它抓住一次算败。'),
      choice('return', '活着回港', '白天采集资源、入夜风险与回报同步上升，玩家自选何时收手；带够货物回到存档点算胜，损失过半算败。'),
      choice('escape', '离开这层楼', '在连通房间内找齐钥匙并管理紧张的物品栏，敌人打不死只能驱退或绕开；开主门离开算胜，资源耗尽或被抓算败。'),
    ],
  },
  questions: [
    {
      id: 'horror_lever', group: '恐怖第一局', topic: '恐惧杠杆',
      prompt: '恐惧主要靠什么压到玩家身上？',
      why: '资源、追逐、信息、日常侵蚀是四套不同的恐惧引擎；先定一种，敌人和场景再围着它设计。',
      options: [
        choice('resource', '资源永远不够', '每次分配都是博弈；稀缺要卡在"心疼但不绝望"的窗口。'),
        choice('chase', '有东西在追我，而我打不了', '无力感是核心；失败后威胁要会降级，不然恐惧变烦躁。'),
        choice('info', '所见所闻不可信', '雾、黑暗与假情报；恐怖来自无法规划，要留可归因的线索。'),
        choice('creep', '不对劲慢慢渗进日常', '教学伪装成日常劳动；微恐治愈走这条，剂量权交给玩家。'),
      ],
      recommended: 'creep', depth: 'deep', when: 'horror_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'horror_power', group: '恐怖第一局', topic: '反制手段',
      prompt: '玩家手里有没有反制威胁的手段？',
      why: '给玩家可靠权力是把动作游戏错当恐怖游戏的第一死因；但完全无力又容易变成看播片。',
      options: [
        choice('none', '完全没有：只能跑和躲', '无力感最纯；要用场景和节奏补偿玩家的无力。'),
        choice('unreliable', '有但不可靠或有代价', '延缓而不是消灭威胁；每次使用都要付出可见代价。'),
        choice('deter', '有且能赢，但赢了掉资源', '威慑型；必须答出"赢的代价有多疼"，否则变动作游戏。'),
      ],
      recommended: 'unreliable', depth: 'deep', when: 'horror_genre', dependsOn: ['首局目标', '恐惧杠杆'],
    },
    {
      id: 'horror_death', group: '恐怖第一局', topic: '失败处理',
      prompt: '玩家失败一次后发生什么？',
      why: '重复尝试是恐惧的头号杀手——同一遭遇死十次，玩家就从害怕变成烦躁。',
      options: [
        choice('wake', '醒来或退回安全区，威胁降级', '保住恐惧记忆；怪物在玩家失败数次后自行降级或消失。'),
        choice('retry', '原样重来', '最传统；必须把单次流程控制在很短，否则挫败压过恐惧。'),
        choice('lose', '永久损失资源但继续', 'rogue 化；损失要具体可见，不能变成隐形数值惩罚。'),
      ],
      recommended: 'wake', depth: 'deep', when: 'horror_genre', dependsOn: ['首局目标', '恐惧杠杆'],
    },
    {
      id: 'horror_safe', group: '恐怖第一局', topic: '喘息形式',
      prompt: '安全以什么形式存在？',
      why: '恐怖在对比里才成立：没有可信的喘息，玩家只会脱敏，不会害怕。',
      options: [
        choice('room', '安全空间：存档房，怪物不进', '经典结构；安全区本身也是张力源——想推进就必须离开。'),
        choice('time', '安全时间：昼夜循环', '微恐治愈的解法；玩家自选何时冒险，剂量权在他手里。'),
        choice('item', '安全物件：灯、相机、符咒', '安全感绑在会耗损的东西上；耗损节奏就是恐惧节奏。'),
        choice('scarce', '几乎没有（纯恐）', '对比全靠短爆发；需要自证节奏掌控，首版慎选。'),
      ],
      recommended: 'room', depth: 'deep', when: 'horror_genre', dependsOn: ['首局目标', '恐惧杠杆'],
    },
  ],
  prototype: {
    loop: '玩家在日常或探索中积累不安 → 第一次环境级异常 → 第一次真威胁 → 喘息（安全区或安全时间）→ 压力升级直到胜负结算，可重开。',
    missions: {
      shift: '占位场景：一晚便利店值班，收银、补货、倒垃圾的完整班表；全夜只允许一次真威胁和三次环境级不安（自动门开了又关、相框歪了）。熬到交班算胜。',
      return: '占位场景：白天在近海打捞，资源密度随入夜上升、雾里开始有东西跟着船；玩家自选何时返航，带回约定货物算胜，货舱损失过半算败。',
      escape: '占位场景：一层连通的旧楼，六格物品栏，敌人打不死只能驱退或绕开；每个房间教一条规则（锁、匙、驱退、取舍），找齐钥匙开主门算胜。',
    },
    acceptance: [
      '首次真威胁出现前，已有至少三次环境级不安；此前没有生物级惊吓。',
      '每 20 到 30 分钟有一个可退出节点（安全区、存档点或昼夜切换）。',
      '高强度段之后必有喘息，且玩家真的会停下来整理，而不是冲过去。',
      '同一遭遇第三次出现时仍有张力，玩家没说"又来了，烦"。',
      '试玩者自报害怕程度与乐趣同落中段，而不是一头拉满一头贴地。',
      '记录玩家弃玩位置并归类：挫败或无聊导致的弃玩不超过一半。',
    ],
    defer: ['大世界与三小时以上流程', '导演级追逐 AI', '多结局与分支', '写实画面与理智值可视化', 'VR 与强沉浸外设'],
  },
};

const TOWERDEFENSE_PACK = {
  schemaVersion: 1,
  id: 'genre.towerdefense',
  axis: 'genre',
  value: 'towerdefense',
  title: '塔防',
  shortTitle: '塔防',
  status: 'complete',
  boundary: '离线设计预设；依据开发者数值拆解、官方复盘与玩家一手差评蒸馏（2026-09-29），未运行、未平衡、未试玩。',
  review: {
    title: '塔防首局先证明漏怪永远可归因',
    detail: '让玩家口述每只漏怪为什么漏；答不上来就是路径、火力或情报呈现有问题。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('hold', '守住第一条路', '单路径 8 到 10 波、两种塔，开局金币只够建一座；波次清空且生命大于零算胜，生命归零算败。'),
      choice('focus', '找到集火点', '带发卡弯的路径加固定预算，一只精英怪压轴；精英不漏且总漏怪不超标算胜，精英抵达终点算败。'),
      choice('choice', '一波一抉择', '经济紧凑局，每波结算只够升级一座旧塔或新建一座；存活到全部波次结束算胜，生命归零算败。'),
    ],
  },
  questions: [
    {
      id: 'td_path', group: '塔防第一局', topic: '路径形态',
      prompt: '敌人的路是谁定的？',
      why: '固定路径把谜面交给你设计，开放造路把谜面交给玩家——后者的规则成本完全不同。',
      options: [
        choice('fixed', '固定路径', '谜面是你设计的集火点位置；成本最低，首版默认。'),
        choice('semi', '半开放：限定区域内造路', '玩家有路线选择权；要处理拐角利用和最短路径压榨。'),
        choice('open', '全开放造路', '塔即墙；必须连带决定防堵死规则和卖塔惩罚，否则翻路技巧毁掉波次设计。'),
      ],
      recommended: 'fixed', depth: 'deep', when: 'towerdefense', dependsOn: ['首局目标'],
    },
    {
      id: 'td_depth', group: '塔防第一局', topic: '塔的深度',
      prompt: '塔的数量和深度怎么配？',
      why: '全能塔和图鉴填充是塔防的两大塔种死法；每种塔都必须有明确的定位。',
      options: [
        choice('few', '少而深：4 种塔加升级分支', '每种塔有鲜明职责；王国保卫战一代就是 4 塔起家。'),
        choice('wide', '多而横向克制：8 种以上', '必须配敌人属性浮动逼玩家横向使用，否则必出全能塔。'),
        choice('single', '单一塔种加特性分叉', '最聚焦；所有深度押在升级选择上，地图要更有戏。'),
      ],
      recommended: 'few', depth: 'deep', when: 'towerdefense', dependsOn: ['首局目标', '路径形态'],
    },
    {
      id: 'td_block', group: '塔防第一局', topic: '阻截层',
      prompt: '除了塔，还有什么能拖住敌人？',
      why: '玩家排斥摆完塔旁观看戏；阻截层是参与感的来源，也是操作负担的来源。',
      options: [
        choice('pure', '纯塔，无阻挡', '最省事；参与感全部押在建造取舍和波次情报上。'),
        choice('units', '可动兵营或英雄单位', '加实时操作换参与感；兵营鸡肋化是真实前车，单位要有明确职责。'),
        choice('slow', '减速控制软阻截', '低成本持续干预点；减速数值要能被玩家算进波次预估。'),
      ],
      recommended: 'pure', depth: 'deep', when: 'towerdefense', dependsOn: ['首局目标', '路径形态'],
    },
    {
      id: 'td_econ', group: '塔防第一局', topic: '经济节奏',
      prompt: '钱怎么来、怎么紧？',
      why: '打怪掉钱造更多塔是正反馈雪球，波次强度必须做负反馈约束；经济口径直接决定难度手感。',
      options: [
        choice('tight', '打怪掉钱，紧凑循环', '每波结算都是一次取舍；最经典的塔防手感。'),
        choice('early', '提前召唤下一波给奖励', '风险回报阀门；高手能主动加速，新手不被拖住。'),
        choice('loose', '宽松第二目标（利息、挖矿）', '适合做长线；首版慎选，容易稀释建造取舍。'),
      ],
      recommended: 'tight', depth: 'deep', when: 'towerdefense', dependsOn: ['首局目标', '路径形态'],
    },
  ],
  prototype: {
    loop: '玩家查看下一波情报 → 把有限金币换成塔位与升级 → 观看防线接战并归因漏怪 → 波间喘息调整 → 波次清空或生命归零，可重开。',
    missions: {
      hold: '占位场景：一条直路加一个拐角，两种塔（输出与减速），开局金币只够一座；第 1 到 2 波教建塔、第 3 到 4 波教升级、第 5 波起自由调配，10 波清空算胜。',
      focus: '占位场景：带发卡弯的单路径，固定预算不许卖塔退款，第 10 波一只精英怪压轴；找到让精英在弯道里吃满火力的摆法才算过。',
      choice: '占位场景：每波结算的金币只够"升一座旧塔或建一座新塔"二选一，共 12 波；第 6 波后玩家要能说出自己选了哪条路、放弃了什么。',
    },
    acceptance: [
      '玩家能口述每只漏怪的原因：路太短、火力太弱还是形状不对。',
      '同一预算换布局后成绩差一档以上，证明集火点存在且可被发现。',
      '波次松紧交替：连续高压之后必有建设喘息窗。',
      '每种塔有一个明确职责，不存在一座"什么都行"的全能塔。',
      '无指引的新手能在第 3 波前把塔放到拐角位。',
      '在目标设备上从开局玩到胜或负，再完成重开。',
    ],
    defer: ['无尽模式', '科技树与局外养成', '塔种图鉴扩张', '多地图', '英雄系统与多路出怪'],
  },
};

const SURVIVAL_PACK = {
  schemaVersion: 1,
  id: 'genre.survival',
  axis: 'genre',
  value: 'survival',
  title: '生存建造',
  shortTitle: '生存建造',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。资源压力＋失败代价（饿死、冻死、被袭击）是品类核心归本包；纯生产扩张、核心循环里没有失败状态归经营包；首局不做多人同步与 PvP 沙盒。',
  review: {
    title: '生存首局先证明「第一周期的压力可读、危机能亲手解掉」',
    detail: '按已选目标做一小段生存循环，检查玩家能否在无外部教程的情况下说出自己为什么死、在第一个周期内亲手解决一次危机（生火、建庇护或撑过一波），并在完成一轮后说得出下一步想干什么；制作时先只开一到两个会致命的压力，再谈系统。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('survive_night', '活过第一夜（单人硬核）', '玩家在敌对环境里从零开始：采集、生火、搭一处庇护，撑到天亮；熬过第一夜算达成，死亡且说不出死因算失败。'),
      choice('build_base', '搭起第一座工作台与初创基地', '玩家以基地为共同目标，采集材料建出第一座工作台与第一层建造；基地成型、能支撑下一周期算达成，材料断供或庇护被毁且无法继续算失败。'),
      choice('hold_wave', '撑过第一波袭击', '玩家在准备期布置防御、在战斗期守住据点；撑过约定波次算达成，据点被破算失败。'),
    ],
  },
  questions: [
    {
      id: 'sv_pressure', group: '生存建造第一局', topic: '压力系统数量',
      prompt: '开局同时开几个会致命的压力（饿、冷、袭击）？',
      why: '「盘」要少而精：压力系统开得越多，每个都和别的系统互相拉扯，压力被稀释成忙碌，玩家反而说不出自己在为什么而活。',
      options: [
        choice('single', '只开一个致命压力（饿、冷或袭击之一）', '最易读、最能在一局里验证一个完整周期；其余威胁先用低压力表现，之后分期加入。'),
        choice('two', '开两个相互咬合的压力（如冷＋袭击）', '更有生存味；但每个新系统都要和已有系统平衡，首版改动成本明显更高。'),
        choice('all', '体温、饥饿、精神等全系统一次上齐', '拟真最强；却已被大量案例证明会在平衡拉锯里拖垮进度，最不推荐首版。'),
      ],
      recommended: 'single', depth: 'deep', when: 'survival_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'sv_first_night', group: '生存建造第一局', topic: '第一夜教学',
      prompt: '第一个周期怎样教玩家面对威胁？',
      why: '第一夜是核心记忆点；威胁必须可读、可达成，玩家要亲手过掉一次，并在早期留一道低压教学题。',
      options: [
        choice('sandbag', '留一只低压力「沙包」怪/事件当教学', '新人在安全压力下学会战斗，并自证为什么要为夜晚准备；是低成本、最不易劝退的做法。'),
        choice('real', '直接上真威胁，死亡后能说出原因', '更硬核；要求威胁与应对手段都极可读，否则新人开局的死法不可学习。'),
        choice('sparse', '先不做敌人，只用环境压力（冷/饿）撑起第一夜', '最省事；但不适配波次、袭击类首局。'),
      ],
      recommended: 'sandbag', depth: 'deep', when: 'survival_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'sv_scarcity', group: '生存建造第一局', topic: '稀缺位置',
      prompt: '稀缺主要制造在哪一种资源上？',
      why: '把稀缺放在玩家愿意为它改变行为的资源上；纯搬运与时间税是玩家最集中的差评源，稀缺错位等于把吸引力做成苦差。',
      options: [
        choice('time', '时间本身：每个决定都在和天黑或下一波赛跑', '最贴合「时间是唯一真资源」的判断；代价是节奏设计要细，别让赶路本身变成耗时。'),
        choice('material', '关键材料：某配方必须去危险区才拿得到', '材料分配构成基地局的取舍；但搬运与采集不能做成纯耗时。'),
        choice('inventory', '背包与负重：资源带不回来', '制造选择更轻；但没有它时，也别让搬运变成第二份工作。'),
      ],
      recommended: 'time', depth: 'deep', when: 'survival_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'sv_scope', group: '生存建造第一局', topic: '首版规模',
      prompt: '第一块可玩区域做多大？',
      why: '这个品类被「做得太大做空」坑过很多次；先把一小块地图上的压力闭环跑通，再谈扩张。换皮新群系是多年差评源，程序生成大地图被成功团队在原型期明确砍过。',
      options: [
        choice('small_dense', '一小块做密的地图（一个群系的基础区域）', '闭环最快跑通、压力最好观察；最贴「不做大、做密」的品类共识。'),
        choice('medium', '中等：能看出两三个群系差异', '卖相更好；但未验证闭环就铺面积，返工风险高。'),
        choice('procedural', '程序生成的大地图', '随机感强；但被成功团队在原型阶段明确砍掉过，首版风险最高。'),
      ],
      recommended: 'small_dense', depth: 'deep', when: 'survival_genre', dependsOn: ['首局目标'],
    },
  ],
  prototype: {
    loop: '玩家从零开始采集 → 制作/建造出第一件能改变处境的物件 → 环境压力在周期内升级（天黑、降温、下一波）→ 玩家亲手把一次危机解掉 → 获得新的生存能力 → 下一周期压力更高。时间是唯一真资源，堆资源只是让"盘"转起来。',
    missions: {
      survive_night: '占位场景：一小块林子，一棵树、一堆石头、一处水源。玩家开局裸装；第一分钟内完成第一次采集并立刻做出工具或火堆，白天收集、夜晚降温，火堆与庇护要能真正保命。玩家熬过第一夜，并在完成后说得出下一步想干什么，算达成；死亡时界面能指出死因（饿/冷/被袭击/走错）为必要条件，说不出死因判失败。',
      build_base: '占位场景：一小块空地加两处资源点。玩家采集材料搭起第一座工作台，再用它做出第一层建造，基地能支撑下一个周期算达成；材料断供或庇护被毁且无路可续判失败，并显示是哪一处断的。',
      hold_wave: '占位场景：一个可防守的地点加一段准备期。玩家在准备期布置防御（封窗/放陷阱/囤火），战斗期守住约定的一波；撑过算达成，据点被破判失败，并指出缺口在哪。',
    },
    acceptance: [
      '首局只有一种明确达成条件和一种明确失败条件；死亡时能指出死因（饿、冷、被袭击或走错）。',
      '制作链首轮闭环：采集 → 制作 → 使用 → 获得新生存能力，能在同一局内走通。',
      '第一个周期（白天准备 → 夜晚压力 → 结果）在首局内被玩家完整走完至少一次。',
      '开局指令/教学提示不超过 3 条，基础循环不依赖外部教程。',
      '每个早期威胁都有可读的应对手段（火堆对应冷、墙/门对应袭击、工具对应饥饿）；不允许"知道要做什么但游戏没给手段"。',
      '致死的压力系统控制在 1–2 个，其余系统延后（分期上线）。',
      '首小时内出现至少一次"计划被打乱后临场改变方案并活下来"。',
      '首小时不存在纯搬运、无操作的时间池（挖矿只为再挖矿）。',
      '没有"一次制作清空全部资源"这类不可预判的代价。',
      '玩家在无提示下能自行走向下一个资源点，并能说出"我接下来想干什么"。',
      '在目标设备上从开局玩到达成或失败，再完成重开。',
    ],
    defer: ['多人同步与联机（原型期最贵的 scope，先砍）', 'PvP 与反作弊', '完整建造物理与结构承重', '程序化生成的大地图', '天气＋体温＋饥饿＋精神多系统同开', '大量生物群系（换皮新群系是差评源，先做"少而不同"）', '故事模式、多结局与长线 meta 进度', '自动化便利的时间点（第几小时给自动化无权威依据，留待实测）'],
  },
};

const SIMULATION_PACK = {
  schemaVersion: 1,
  id: 'genre.simulation',
  axis: 'genre',
  value: 'simulation',
  title: '模拟器（扮演职业/系统角色）',
  shortTitle: '模拟器',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-28），未运行、未平衡、未试玩。扮演具体职业/系统角色、按现实流程作业的模拟器（洗车、小偷、翻修、维修等）归本包；经营/种田/餐厅归经营包；人生模拟（模拟人生类）归候选生活模拟包；首版不做开放世界漫游、硬核物理拟真、载具类作业与多人联机。',
  review: {
    title: '模拟首局先证明「现实流程的爽点被留下、繁琐被删掉」',
    detail: '按已选目标做一个完整作业单，检查玩家能否无教程独立做完第一单、完成瞬间得到视听回执、能复述正确的作业顺序，并在结算后自发开始下一单；制作时把现实流程砍到只剩爽点，凡挡路的（水电管理、几万颗螺丝这种）都删。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('clean_job', '把一处封闭场景洗干净到 100%', '玩家用清洗工具处理一个脏/净对比极强的封闭小场景，完成全部可洗单元并结算；洗到 100% 并拿到第一笔结算算达成，卡在找不到最后一块脏且没有定位辅助判失败。'),
      choice('flip_room', '翻修一间小屋并售出', '玩家按清垃圾→刷墙/铺地→装家具的顺序改造一间小屋，交付给 NPC 收钱；完成翻修并售出算达成，翻修过半发现无法继续且无后续订单判失败。'),
      choice('repair_job', '修好一台设备并交付', '玩家拆开设备、诊断故障件、换件、试机、交付；试机通过并交付算达成，装回去无法运行且排查无头绪判失败。'),
      choice('steal_job', '完成一次潜入作业（踩点→取物→撤离）', '玩家针对一栋小房子踩点、潜入、取物、撤离销账；全身而退算达成，触发警报且无法逃离判失败。首单只做一栋房子，稳定性优先。'),
    ],
  },
  questions: [
    {
      id: 'sm_job_loop', group: '模拟器第一局', topic: '首单骨架',
      prompt: '第一单必须包含哪些环节？',
      why: '「接单→执行→验收→结算/解锁」四步闭环是成功案例的一致形状，也是本包唯一不可省的骨架；省掉验收或结算，作业感就散了。',
      options: [
        choice('full', '完整四步：接单→执行→验收→结算/解锁', '作业感完整、动机链最短；是多数成功案例的一致形状。'),
        choice('quick', '先只做执行＋结算，验收用进度条代替', '更快见到钱；但"做得好不好"无从判断，作业感打折。'),
        choice('guided', '第一单带引导员走完全流程', '教学最稳；但玩家第一次体验的是"被教"，不是"独立完成"。'),
      ],
      recommended: 'full', depth: 'deep', when: 'simulation_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'sm_progress', group: '模拟器第一局', topic: '成长主轴',
      prompt: '玩家变强的感受主要挂在哪一条链上？',
      why: '升级要压缩到单维度可感知：换一件工具立刻在同一个场景里感到更快更省力；多维度数值会让升级感知变糊。',
      options: [
        choice('tool', '工具升级链：第一件升级在首单后立刻可买', '最直观：同一场景里立刻感到更快/更省力，也最方便试玩验证。'),
        choice('skill', '技能树分档，可随时开关', '更灵活；需要每档技能都有可感知的验证，成本更高。'),
        choice('rank', '军衔/评级：完成质量换称号与更难作业', '给长期动机；但评级规则必须对玩家完全可见，否则会被读成"我为什么被扣分"。'),
        choice('none', '首版先不做成长链', '最快出第一单；但重复作业的动机弱，第二单就可能显重复。'),
      ],
      recommended: 'tool', depth: 'deep', when: 'simulation_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'sm_penalty', group: '模拟器第一局', topic: '失败与压力',
      prompt: '第一版要不要失败的惩罚？',
      why: '品类主流倾向是无失败条件（无时限、无惩罚），玩家的核心诉求是低压与秩序感；惩罚设计原则在公开材料里近乎空白，首原型默认不开。',
      options: [
        choice('none', '无时间限制、无失败条件', '最贴玩家的低压预期；代价是少了紧张感，需要进度与回执补足动机。'),
        choice('score', '评分制：完成质量影响评价与收入', '有目标压力；但规则不透明会让玩家问"我为什么被扣分"（已被玩家点名）。'),
        choice('mild', '轻度代价：失误只造成返工成本', '折中；返工不能是"物理把已清区域弄脏且无法预防"那类挫折。'),
      ],
      recommended: 'none', depth: 'deep', when: 'simulation_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'sm_variety', group: '模拟器第一局', topic: '作业变化来源',
      prompt: '第一版怎样让作业不重复？',
      why: '动作本身是统一的，变化只能来自作业对象；重复度饿死后劲是本包头号死法，靠数量堆只会被读成换皮。',
      options: [
        choice('unique', '每单有独特剪影与命名的可操作单元', '变化来自对象本身、最保值；每单都要重新设计对象，成本最高。'),
        choice('minigame', '在长动作间插入可选小游戏打断节奏', 'House Flipper 2 的实测做法；适合翻修这类又长又碎的作业。'),
        choice('volume', '靠作业数量取胜', '上手最快；但对象不独特时，"更多同类"会被读成换皮。'),
      ],
      recommended: 'unique', depth: 'deep', when: 'simulation_genre', dependsOn: ['首局目标'],
    },
  ],
  prototype: {
    loop: '玩家接单 → 按现实流程执行若干步骤 → 验收（完成度始终可见）→ 结算并解锁更好的工具 → 下一单更复杂。',
    missions: {
      clean_job: '占位场景：一个脏/净对比极强的封闭小场景（如一辆车或一间小院）。所有可洗单元都有带地理线索的名字，进度条随时可见；玩家用初始工具清洗，第一个单元完成时有视听回执（白闪/提示音）。洗到 100% 并结算算达成；卡在"找不到最后一块脏"且无定位辅助判失败。',
      flip_room: '占位场景：一间小破屋。玩家按清垃圾→刷墙/铺地→装家具的顺序完成并把屋子卖给 NPC；出手结算算达成。翻修过半发现资金/材料断链且无后续订单判失败，并指出断在哪一步。',
      repair_job: '占位场景：一台能拆的机器。玩家拆开→诊断出故障件→换件→试机→交付；玩家能复述诊断顺序。试机通过并交付算达成；装回后无法运行且无排查头绪判失败。',
      steal_job: '占位场景：一栋只有一层、有明确出入口的小房子。踩点（看巡逻/锁）→潜入→取走目标物→撤离销账；全身而退算达成，触发警报且无法逃离判失败。首单只做这一栋房，稳定性优先。',
    },
    acceptance: [
      '首单闭环四步齐全（接单→执行→验收→结算/解锁）；启动即作业，无教程也能独立做完第一单。',
      '每个可操作单元有名字且带地理线索，玩家能用名字推出位置；找不到剩余是反例红线。',
      '至少两级"脏/坏"难度，第一级无法用初始工具高效处理；存在首单后立刻可买的第一件升级。',
      '完成度始终可见（进度条/剩余高亮/单元清单）；完成判定与评分规则对玩家可见。',
      '秒级＋单局级＋中期三层回执在首小时内都出现：完成瞬间的视听回执、作业结清、第一次升级。',
      '作业变化来自对象本身：首发每个作业有独特剪影，没有趋同形态（载具类）作业。',
      '首单 5–10 分钟量级（低证据起点，不作硬线，仅作排期参考）。',
      '操作不会把已清区域弄脏且无法预防；首单没有"物理返工"类挫折。',
      '完成单局后玩家自发开始下一单；第二单里玩家主动换工具或换做法。',
      '首单没有大段文字门槛，开场三分钟回答：我是谁、在哪、要干什么。',
      '在目标设备上从开局玩到结算，再完成一单重开。',
    ],
    defer: ['开放世界自由漫游', '物理硬核拟真（主流取舍是"清洁 8/10、被清洁物 4/10"）', '多人/联机经济', '几十种职业铺量（先做一条职业线）', '叙事主线与大地图剧情', '沙盒/关卡编辑器', '载具类作业（元素扁平、最难做差异）', '深度经济与破产系统', '失败惩罚机制（首原型默认不开）'],
  },
};

const IDLE_PACK = {
  schemaVersion: 1,
  id: 'genre.idle',
  axis: 'genre',
  value: 'idle',
  title: '增量挂机/放置',
  shortTitle: '增量挂机',
  status: 'complete',
  boundary: '离线设计预设；依据公开检索与卡片库蒸馏（2026-09-29），未运行、未平衡、未试玩。重置型长线（prestige/转生/换蛋）＋产能成本跷跷板＋自动化按序发放归本包；离线生产作为可移植节奏属性仍归经营包 mgmt_pacing 题；管理型放置与经营包重叠区同一项目不同时打两包。',
  review: {
    title: '放置首局先证明「曲线有爆点、等待有上限、重置可读懂」',
    detail: '按已选目标做一段可脚本模拟的核心曲线：先跑前 60 分钟检查爆点间隔与最大等待时长，把第一次重置放在可承诺的时间点并让玩家一分钟内读懂规则；再让一个真人离线数小时回来，看收获是否可感知、回来是否有第一批决策可做。',
  },
  firstChallenge: {
    topic: '首局目标',
    options: [
      choice('click_to_auto', '把「点一下得一份」换成「不点也在涨」', '玩家从手动点击开始，十几分钟内买下第一台自动生成器（品类最成功作品的实测先例是 15 次点击内就交出自转），之后产出自动累积；玩家在一小时内走到第一个明显提速的里程碑算达成，始终无法把手动换成自动（曲线断裂）判失败。'),
      choice('first_reset', '冲到第一次重置，并让下一轮明显更快', '玩家沿成本曲线爬升，撞到第一道等待墙后在重置点主动清零、换取永久乘数；下一轮把同一根曲线爬得更快算达成，重置的收益规则读不懂、或重置后没有可感知的提升判失败。'),
      choice('offline_lines', '用离线时间并行推几条养成线，回来有明确收获', '玩家配置好自动产出与养成线后离开，离线期间游戏继续；回来后能领到可感知的收获、并立刻有第一批决策可做算达成，离线归来无事可做、或收获不可见判失败。'),
    ],
  },
  questions: [
    {
      id: 'idl_pace', group: '增量挂机第一局', topic: '首个爆点节奏',
      prompt: '第一小时里，可感知的「提速节点」应该多密？',
      why: '首小时没有明显提速是放置最典型的死法；成功案例的第一口糖是十几分钟内自动化、一小时内明显提速。具体间隔秒数无权威来源，先立节奏形态，数值交给脚本模拟验收；差评实测锚点：约 15 分钟进入纯等待是真实流失点。',
      options: [
        choice('frequent', '密：每隔几分钟就有一个可感知的提速节点', '最贴成功案例的第一口糖；要求曲线表提前排好每个爆点（生成器首购/倍率门槛/大里程碑）。'),
        choice('staggered', '先密后疏：开头密集，二十分钟后等待开始拉长', '节奏更耐玩；但拉长后必须用决策或并行线补位，否则滑向等待墙。'),
        choice('grindy', '开局就允许较长等待', '省事；但首小时无爆点会直接流失，最不推荐首版。'),
      ],
      recommended: 'frequent', depth: 'deep', when: 'idle_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'idl_wait', group: '增量挂机第一局', topic: '等待上限',
      prompt: '单次等待允许多长、等待时玩家还能做什么？',
      why: '等待上限与等待期决策是放置「不变成无事可做」的护栏；没有权威秒数阈值，就给形态红线。前提是开场零教学可懂——玩家落地就知道自己在做什么。',
      options: [
        choice('decision', '等待要短，且每次等待里留一个可做决策（买哪个/存钱/换倍率）', '最贴「等待期有得选」的共识；要求生成器组合与倍率门槛足够多。'),
        choice('parallel', '允许长等待，但用多条并行线把等待填满', '更长线作品的做法；首版要同时维护几条曲线的平衡，成本更高。'),
        choice('fill_offline', '靠离线收益填补长等待', '最简单；但把在线做得无意义是后期差评源，首版慎用。'),
      ],
      recommended: 'decision', depth: 'deep', when: 'idle_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'idl_prestige', group: '增量挂机第一局', topic: '重置规则与时机',
      prompt: '第一次重置给在什么时候、规则怎么让玩家读得懂？',
      why: '重置时机本身是这类的策略深度；玩家要靠攻略才懂何时重置是被反复指出的反例。',
      options: [
        choice('taught', '第一次重置目标明确标注，规则一分钟内读得懂', '把「何时重置、换到什么」讲成可见的里程碑；最贴差评反例的解法。'),
        choice('discover', '不点破，让玩家自己发现重置的收益', '保留发现乐趣；但首局读不懂重置的玩家会流失，风险高。'),
        choice('after_wall', '在第一道漫长的等待墙之后，用重置当解法递出', '重置成为被感知的救赎；但要求玩家先熬过那堵墙，首版节奏要算准。'),
      ],
      recommended: 'taught', depth: 'deep', when: 'idle_genre', dependsOn: ['首局目标'],
    },
    {
      id: 'idl_offline', group: '增量挂机第一局', topic: '离线收益',
      prompt: '离线收益占多大比重、有没有上限？',
      why: '离线太强在线无意义、太弱回来没收获；先例有 Egg, Inc. 约 2 小时硬上限，另有头部放置 RPG 开发者与发行方互证「低注意力下的进度感是品类特性」（第二屏定位），先立「有明确比值或上限」的纪律。',
      options: [
        choice('capped', '硬上限（如约两小时等长的离线收益），并说明这是设计选择', '压低挂机依赖、推玩家主动回来；低证据方向：上限先例来自单款作品，数值仅作起点。'),
        choice('balanced', '按在线产出的一定比例持续累积', '体感自然；需要把「离线∶在线」比值写进验收模拟。'),
        choice('unlimited', '不做上限，靠解锁与递减保持平衡', '最省事；但后期容易变成「不上线最赚钱」，是最常见的长线崩法。'),
      ],
      recommended: 'capped', depth: 'deep', when: 'idle_genre', dependsOn: ['首局目标'],
    },
  ],
  prototype: {
    loop: '玩家踩油门产出 → 买第一台生成器与倍率（把点击换成自动）→ 成本指数上涨、等待开始拉长 → 每个等待段做一个分配决策 → 撞到重置点，主动清零换永久乘数 → 下一轮更快地爬回同一根曲线 → 新的等待墙与新的重置目标。',
    missions: {
      click_to_auto: '占位场景：一块有数字与一个购买按钮的极简页面。玩家从手动点击开始，十几分钟内买下第一台自动生成器；60 分钟曲线由脚本预演：生成器首购点、倍率门槛（如 25/50 触发 ×2）、第一次明显提速各自排定。玩家在一小时内走到第一个大里程碑算达成；产出追上成本前出现不可达断点判失败。',
      first_reset: '占位场景：同上，加一层重置。玩家沿成本曲线爬升，在承诺的节点（如爬到第一道等待墙）触发重置，换到永久乘数并立刻看到下一轮明显更快；重置规则以一行可读说明呈现。下一轮爬升明显变快算达成；重置后无感知提升、或规则玩家复述不出来判失败。',
      offline_lines: '占位场景：两到三条养成/产出线并行推进，玩家配置后离开；回来时界面给出累积收获与第一批决策。离线归来有可感知收获、并能马上做新决策算达成；归来无事可做或收获不可见判失败。',
    },
    acceptance: [
      '前 60 分钟进度曲线可脚本预演：爆点（生成器首购/倍率门槛/明显提速）与最大等待时长都能从表里读出。',
      '单台生成器成本与产出公式成表（成本指数增长、产出线性/多项式增长）；「最新生成器一旦可买就近乎统治」已被倍率门槛处理。',
      '单轮内有快段慢段，不是一条平线；重置之间也有变奏。',
      '自动化按顺序作为奖励发放，不是开局全自动；第一台自动生成器在十几分钟内可得。',
      '每个等待段内至少有一个可做决策；不存在无决策的长等待段。',
      '第一次重置落在可承诺的时间点，收益规则玩家一分钟内读懂（能复述）；「靠攻略才懂何时重置」是反例红线。',
      '离线收益与在线收益有明确比值或硬上限，且该上限是设计选择而非事故。',
      '存在张力来源（目标里程碑/限时事件/概率门槛），不是纯挂机旁观。',
      '大数字可读（科学计数或命名后缀），玩家无需另写指南解释数量级。',
      '前 60 分钟没有一次明显提速、或存在超上限且无决策的等待段、或重置收益读不懂——触发即判负。',
      '前 20 秒（含启动与菜单）玩家已在执行核心动作并知道为什么继续（单源开发者规则，按中证据使用）。',
      '在目标设备上从头跑到第一次重置（或约定终点），并模拟一次离线回归。',
    ],
    defer: ['多人/排行榜经济与社交比较', '几十个系统铺量与成就大礼包', '复杂战斗（战斗是后置深水区）', '把离线收益做成主玩法', '多套 prestige 货币与多层好感系统', '付费点、限时活动与回归激励（运营期）', '页游化换皮（同数值骨架换题材）'],
  },
};

const UNITY_MONO_PACK = {
  schemaVersion: 1,
  id: 'engine.unity-mono',
  axis: 'engine',
  value: 'unity-mono',
  title: 'Unity（Mono 后端）',
  shortTitle: 'Unity Mono',
  status: 'complete',
  boundary: '依据五个 Mono 逆向工程（授权学习用途，Unity 5.6.5／2018.2／2018.3／2021.3／2022.3）的编译与引用链证据蒸馏；不含可运行代码；这些还原工程均未做真机 Play 验证。',
  capabilities: [
    '反编译工程可脱离 Unity 编辑器验证：用游戏自带 Managed 目录的引擎 DLL 做引用，按 net472 或 netstandard2.1 编译，0 错误才算结构还原成功（五个项目实证）。',
    '资产还原：AssetRipper 可导出完整工程（场景、预制体、SO）；无 GUI 环境可用其无头 HTTP 接口（加载文件夹＋导出工程两个请求）。',
    '存档常见形态分级：JsonUtility 明文快照（注意无版本号坑）／版本包装加多级迁移链／命令日志回放／静态定义加运行时差分；写盘先写临时文件再原子替换。',
    '数据驱动通道分级：StreamingAssets 文本表／protobuf 表／二进制配置表／ScriptableObject／CSV 本地化矩阵；persistentDataPath 覆盖 StreamingAssets 是天然 Mod 点。',
    '版本陷阱：反编译器语言级别必须不高于目标 Unity 的 C# 上限（5.6 仅 C#4，2018.2 上限 7.3）；导出工具重生成 meta GUID 会让场景对第三方 DLL 的引用全断（修法是对齐原 GUID）；Unity 按 firstpass 先行的顺序编译，前序程序集失败会遮蔽后续错误。',
  ],
  verification: [
    '编译核验：单独建校验工程，引用原版 Managed DLL 全量编译，0 错误才过关。',
    '引用链核验：以 meta 文件内容建 GUID 索引（不是按文件名），场景与预制体的脚本引用全量扫描，0 悬空才过关。',
    '功能开关核验：代码里存在的机制不等于启用——以场景序列化配置值为准（有项目加密代码在、全场景却关闭的实证）。',
    '行为核验：编译通过加引用零悬空不等于能运行；没做真机 Play 验证时，必须显式声明这个缺口。',
  ],
};

const UNITY_IL2CPP_PACK = {
  schemaVersion: 1,
  id: 'engine.unity-il2cpp',
  axis: 'engine',
  value: 'unity-il2cpp',
  title: 'Unity（IL2CPP 后端）',
  shortTitle: 'Unity IL2CPP',
  status: 'complete',
  boundary: '依据两个 IL2CPP 逆向项目（2021.3.45f2 与 2021.3.36f1／元数据 v29）证据蒸馏；方法体恢复率与加密细节随项目而异；两个项目均无真机运行验证。',
  capabilities: [
    '三层取证：Il2CppDumper 还原类型与地址，ILSpy 出结构级代码（方法体是空桩），原生层反汇编按地址出函数体。',
    '资产层与代码方法体无关：AssetRipper 可直解 IL2CPP 出完整工程（场景、预制体、纹理、SO 实例全量）；脚本导出要开最高内容级别加反编译模式才有可用产物。',
    '方法体恢复有物理上限（约六成；接口、extern、部分 IL 不可恢复）——有签名不等于有语义，有方法体不等于可编译。',
    '可安全改动通道：数据表（二进制配置表）与美术替换；无 HybridCLR 时热更的现实形态是资源级 CDN 差分（三版本号加文件清单比对）。',
    '存档实证形态：整局状态单 JSON 加对称加密加云同步；随机数按子系统拆多条独立可序列化种子流，互不污染且可复盘。',
  ],
  verification: [
    '加密与协议类结论要双重验证（例如内存导出与明文副本做哈希对账）。',
    '反编译工程默认不可编译；重建的骨架工程单独编译验证并如实报告剩余缺口。',
    '没有真机运行时，一切行为级结论标记为静态分析推断。',
  ],
};

const RENPY_PACK = {
  schemaVersion: 1,
  id: 'engine.renpy',
  axis: 'engine',
  value: 'renpy',
  title: "Ren'Py",
  shortTitle: "Ren'Py",
  status: 'complete',
  boundary: '依据单个 7.4.11 项目（132 个 rpyc 全量还原加工作副本启动日志）蒸馏；覆盖面以该项目为限。',
  capabilities: [
    'rpyc 可用 unrpyc 全量还原；注意反编译器目标版本与文件世代的差异警告与命令行参数差异。',
    'RPA 归档格式可能被厂商改写（头部字段换位、索引加密变体）——标准拆包失败时先验头部字节。',
    '存档救场四件套：加载后回填回调、存档 JSON 版本号、读档失败降级标签、缺失标签回调——长期运营游戏不炸老档的完整做法。',
    '主循环可用"挂起加事件驱动"：摆出地图屏后挂起，一切由界面动作驱动，事件尾部统一回收点（清屏、结算检查、自动存档）。',
    '演出特效用确定性伪随机，不消耗引擎随机数（回滚与复现安全）。',
    'Python 层可承载实时物理（固定步长累加器加子步防穿透），但工程量会集中在个别大模块。',
  ],
  verification: [
    '脚本加载通过（日志无脚本错误、持久化目录生成）不等于可交互游玩；无显示环境下的图形崩溃不算游玩证据。',
    'Py2 升 Py3 前先扫整除语义依赖（如好感除以一百这类判定）。',
  ],
};

const CONTENT_PACKS = [TACTICS_PACK, MANAGEMENT_PACK, GAMBLING_PACK, PARTY_PACK, HORROR_GENRE_PACK, TOWERDEFENSE_PACK, ROGUE_PACK, METROIDVANIA_PACK, VISUAL_NOVEL_PACK, PUZZLE_PACK, SURVIVAL_PACK, SIMULATION_PACK, IDLE_PACK, GUOFENG_PACK, ANIME_PACK, WESTERN_FANTASY_PACK, CYBERPUNK_PACK, STEAMPUNK_PACK, COZY_PACK, PIXEL_PACK, HORROR_PACK, HARD_SCIFI_PACK, UNITY_MONO_PACK, UNITY_IL2CPP_PACK, RENPY_PACK];
const CONTENT_AXES = ['genre', 'style', 'engine'];

function genrePackTopics() {
  const topics = ['首局目标'];
  for (const pack of CONTENT_PACKS) {
    if (pack.axis !== 'genre') continue;
    for (const question of pack.questions ?? []) {
      if (!topics.includes(question.topic)) topics.push(question.topic);
    }
  }
  return topics;
}

function validateContentPack(pack) {
  if (pack.schemaVersion !== 1 || !CONTENT_AXES.includes(pack.axis) || !pack.id || !pack.value || !pack.title
    || !pack.boundary || !['complete', 'draft'].includes(pack.status)) throw new Error('内容包缺少统一字段。');
  if (pack.axis === 'style') {
    if (!pack.presentation?.visual || !pack.presentation?.text || !pack.presentation?.feedback) throw new Error('风格包缺少表现指导。');
    if (!Array.isArray(pack.verification) || !pack.verification.length) throw new Error('风格包缺少呈现核验动作。');
    return pack;
  }
  if (pack.axis === 'engine') {
    if (!pack.capabilities?.length || !pack.verification?.length) throw new Error('引擎包缺少能力和核验动作。');
    return pack;
  }
  if (!pack.firstChallenge?.topic || !Array.isArray(pack.firstChallenge.options) || !Array.isArray(pack.questions)
    || !pack.prototype?.loop || !pack.prototype.missions
    || pack.firstChallenge.options.some(option => !pack.prototype.missions[option.value])
    || !Array.isArray(pack.prototype.acceptance) || !Array.isArray(pack.prototype.defer)) throw new Error('内容包缺少必需字段。');
  const questions = [pack.firstChallenge, ...pack.questions];
  const ids = new Set();
  const topics = new Set();
  for (const question of questions) {
    if (!question.topic || !Array.isArray(question.options) || question.options.length < 2 || question.options.length > 4
      || new Set(question.options.map(option => option.value)).size !== question.options.length
      || question.options.some(option => !option.value || !option.label || !option.effect)) throw new Error(`内容包题目无效：${question.id ?? question.topic}`);
    if (topics.has(question.topic) || (question.id && ids.has(question.id))) throw new Error('内容包题目 ID 或主题重复。');
    topics.add(question.topic);
    if (question.id) ids.add(question.id);
    if (question.recommended && !question.options.some(option => option.value === question.recommended)) throw new Error('内容包推荐不在选项内。');
  }
  return pack;
}

function activeEnginePack(constraints) {
  const text = String(constraints ?? '');
  if (!text.trim()) return null;
  const value = /ren'?py/i.test(text) ? 'renpy'
    : /unity/i.test(text) && /il2cpp/i.test(text) ? 'unity-il2cpp'
      : /unity/i.test(text) ? 'unity-mono' : null;
  return CONTENT_PACKS.find(pack => pack.axis === 'engine' && pack.value === value && pack.status === 'complete') ?? null;
}

function enginePackPlan(constraints) {
  const pack = activeEnginePack(constraints);
  if (!pack) return '';
  return `## 引擎核验清单（${pack.shortTitle} 引擎包预设）\n\n${pack.verification.map(item => `- ${item}`).join('\n')}\n- 依据边界：${pack.boundary}\n\n`;
}

function activeGenrePack(genre) {
  return CONTENT_PACKS.find(pack => pack.axis === 'genre' && pack.value === genre && pack.status === 'complete') ?? null;
}

function activeStylePack(style) {
  return CONTENT_PACKS.find(pack => pack.axis === 'style' && pack.value === style && pack.status === 'complete') ?? null;
}

function stylePackPlan(style) {
  const pack = activeStylePack(style);
  if (!pack) return '';
  const name = pack.shortTitle ?? pack.title;
  return `## ${name}表现指导（风格包预设）\n\n- 画面：${pack.presentation.visual}\n- 文本：${pack.presentation.text}\n- 反馈：${pack.presentation.feedback}\n- 呈现核验：${pack.verification.join('；')}\n- 依据边界：${pack.boundary}\n\n`;
}

function stylePackTopics() {
  return CONTENT_PACKS.filter(pack => pack.axis === 'style' && pack.status === 'complete')
    .map(pack => `${pack.shortTitle ?? pack.title}表现`);
}

const acceptedChallenge = project => (project.designDecisions ?? [])
  .find(item => item.topic === '首局目标' && item.status === 'accepted');

function tacticsRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/护送|撤离|送到|保护.*到达/.test(words)) return { value: 'escort', reason: '你提到了护送或撤离；先用抵达出口检验走位、保护和路线选择。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/歼灭|击败|斩首|首领/.test(words)) return { value: 'defeat', reason: '你提到了击败目标；先把胜负压在一个关键对手身上，方便做出完整短局。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'hold', reason: '先做守点：目标、回合压力和失败原因容易直接显示。它只是战棋包的首版预设，不代表已验证好玩。', source: '战棋内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋战棋内容包' : '战棋内容包预设';
  if (question.id === 'tactics_action') return { value: challenge?.optionValue === 'escort' ? 'team' : 'position',
    reason: challenge?.optionValue === 'escort' ? '护送要让开路者和被护送者互相配合，先检验行动顺序是否有意义。' : '先用站位检验玩家能否看懂危险与机会，再考虑更复杂的行动经济。',
    source };
  if (question.id === 'tactics_terrain') return { value: challenge?.optionValue === 'hold' ? 'cover' : 'route',
    reason: challenge?.optionValue === 'hold' ? '守点需要能争夺的安全位置；掩体可让站位取舍更清楚。' : '先用两条路线让玩家比较风险与速度，避免第一张地图堆太多地形规则。',
    source };
  if (question.id === 'tactics_opponent') return { value: challenge?.optionValue === 'hold' ? 'pressure' : 'telegraph',
    reason: challenge?.optionValue === 'hold' ? '守点局让敌人推进目标，玩家才需要分配防线。' : '先公开下一步威胁，让玩家能据此调整行动；复杂反制放到后续。',
    source };
  return null;
}

function managementRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/短缺|撑过|紧缺|危机|破产|生存/.test(words)) return { value: 'shortage', reason: '你提到了短缺或撑过难关；先用一次资源危机检验分配取舍。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/两位|取舍|优先|顾客.*之间|难缠.*客人/.test(words)) return { value: 'tradeoff', reason: '你提到了顾客之间的取舍；先用一次互斥需求检验优先级的代价。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'order', reason: '先做一个生产到订单的闭环：目标、时限和失败原因都能直接显示。它只是经营包的首版预设，不代表已验证好玩。', source: '模拟经营内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋模拟经营内容包' : '模拟经营内容包预设';
  if (question.id === 'mgmt_control') return { value: 'direct',
    reason: '第一版先做直接指挥：正反馈链最短；NPC 完整自主行为库是“上帝观察”路线的深化项，先用最轻量的小人反应。',
    source };
  if (question.id === 'mgmt_goal') return { value: 'staged',
    reason: '任务清单只承担教学期的引导与奖励，之后退为成长参照；任务一停玩家就失焦，是经营品类最典型的失败模式。',
    source };
  if (question.id === 'mgmt_pressure') return { value: 'soft',
    reason: challenge?.optionValue === 'shortage' ? '短缺局本身就是压力源；让代价落在取舍上而不是存档毁灭上，才符合经营玩家的低压预期。' : '经营品类主流是低压定位；时限和损耗制造取舍，但失败是一局的结算，不是一夜清零。',
    source };
  if (question.id === 'mgmt_pacing') return { value: 'realtime',
    reason: '第一版让一局在离线概念之外玩完，先验证主循环；离线生产是放置属性，会改变整套节奏设计，验证后再加。',
    source };
  return null;
}

function gamblingRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/破绽|识破|看穿|读牌|观察.*对手/.test(words)) return { value: 'read', reason: '你提到了识破或观察对手；先用一次有线索可依的判断检验博弈链。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/押|赌注|全押|止损|筹码/.test(words)) return { value: 'risk', reason: '你提到了押注或筹码；先用继续与止损的取舍检验风险决策。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'rule', reason: '先用一条公开规则做反制：规则可教、时机可练、失败原因可见。它只是棋牌包的首版预设，不代表已验证好玩。', source: '棋牌博弈内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋棋牌博弈内容包' : '棋牌博弈内容包预设';
  if (question.id === 'gam_axis') return { value: challenge?.optionValue === 'risk' ? 'build' : 'info',
    reason: challenge?.optionValue === 'risk' ? '押注取舍要靠手牌与资源管理制造“继续还是止损”的张力。' : '识破与反制本质是先验博弈：把“操作点→信息点→收益点”做成可识别的链条，心理战后置。',
    source };
  if (question.id === 'gam_random') return { value: challenge?.optionValue === 'rule' ? 'minimal' : 'front',
    reason: challenge?.optionValue === 'rule' ? '规则反制需要可计算性；随机减到最少或放到决策之后，玩家才算得出反制时机。' : '前置随机先亮关键信息再让玩家决策，保住掌控感；后置随机只用于丰富过程。',
    source };
  if (question.id === 'gam_opponent') return { value: 'ai_single',
    reason: '先用可控的 AI 对手验证博弈链本身；真人匹配、天梯和 META 治理是另一个量级的工程，首版不做。',
    source };
  if (question.id === 'gam_ai') return { value: 'plain',
    reason: '先纯规则出牌，把博弈链验证成立；作弊庄家和跨手记忆都是真实项目验证过的加深方向，但都该在链成立之后再加。',
    source };
  return null;
}

function rogueRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/分数|计分|牌型得分|凑出.*牌型|倍率/.test(words)) return { value: 'threshold', reason: '你提到了分数或牌型凑得；先用一个分数门槛检验「抽牌—出牌—改牌」这条循环。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/波次|割草|成群|坚持.*回合|撑.*波/.test(words)) return { value: 'survive', reason: '你提到了波次或成群敌人；先用有限资源撑过约定波次，检验构筑能否应对压力。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'climb', reason: '先做分层推进：目标、路线取舍与失败原因都容易直接显示，是肉鸽构筑最通用的首版骨架。它只是本包的首版预设，不代表已验证好玩。', source: '肉鸽构筑内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋肉鸽构筑内容包' : '肉鸽构筑内容包预设';
  if (question.id === 'rogue_growth') return { value: challenge?.optionValue === 'threshold' ? 'multiplicative' : 'additive',
    reason: challenge?.optionValue === 'threshold' ? '计分门槛型天然适合乘法叠倍率：把倍率推高本身就是爽点，但挑战门槛要同步抬升。' : '第一版先用加法稳定成长：曲线好读、容易看出哪一步变强，机制联动留到核心循环站稳之后。',
    source };
  if (question.id === 'rogue_deck') return { value: 'thin',
    reason: '先给玩家精简牌组、追求稳定开出核心牌的目标；玩家能优化手牌质量，才谈得上有掌控感，也最容易暴露牌池问题。',
    source };
  if (question.id === 'rogue_random') return { value: 'skip',
    reason: '首版先给最轻的缓解手段——允许跳过奖励与主动删牌。玩家在「不知道怎么输的」时候最容易流失；三选一与商店都是后续加量项，会各自引入新的平衡点。',
    source };
  if (question.id === 'rogue_meta') return { value: 'sideways',
    reason: '低证据方向：玩家侧对「数值型局外成长」争议大（赢了也不确定是变强还是数值高）。先只做解锁多样性的侧向成长，数值成长待局内循环验证后再议。',
    source: `${source}（局外成长形态证据薄弱，此推荐仅供讨论）` };
  return null;
}

function metroidvaniaRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/地图|探索度|补满|收集|区域|房间/.test(words)) return { value: 'map', reason: '你提到了地图或区域探索；先用一小块区域的探索度补满来检验「拿到能力再折返补齐」这条闭环。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/深处|抵达|穿越|通关|推进.*出口/.test(words)) return { value: 'traverse', reason: '你提到了向深处推进；先用一条能力门控的路线，检验「一路开门、越走越深」是否成立。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'unlock', reason: '先做「看得见的锁被能力打开」：达成与失败最容易直接显示，也最能检验门控闭环是否成立。它只是本包的首版预设，不代表已验证好玩。', source: '银河恶魔城内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋银河恶魔城内容包' : '银河恶魔城内容包预设';
  if (question.id === 'mv_gate_ratio') return { value: 'two_plus',
    reason: '一个能力只开一处门，玩家体感更像换钥匙；首版让每个能力至少打开两处已见门，世界才会「活起来」。这是本包的核心判据，但直接来源以方法论教程为主，属方法论共识而非厂商实测。',
    source };
  if (question.id === 'mv_gate_style') return { value: 'soft',
    reason: '能力型门天然是世界内的对象，玩家把限制体验成探索而非禁止；空气墙式无理由拦截会直接击穿沉浸感，硬门控先留到大章节分界。',
    source };
  if (question.id === 'mv_backtrack') return { value: 'shortcuts',
    reason: '长距离、无捷径的回跑是玩家差评最集中的一条；先用少量单向捷径把世界连起来，是成本最低、最贴品类手感的缓冲。快速旅行会稀释空间记忆，留作大地图阶段的兜底。',
    source };
  if (question.id === 'mv_scope') return { value: 'expand_later',
    reason: '这个品类最容易死在「做得太大」。先极小、把结构做活，再横纵加区域；「约 12 房间、3–5 个能力」的规模数字只出自单篇教程，证据单薄，仅作起点参考而非验收硬线。',
    source: `${source}（规模数字证据单薄，此推荐仅供讨论）` };
  if (question.id === 'mv_combat') return { value: 'light',
    reason: '第一版把敌人当障碍与节奏而非主菜：战斗一重，玩家的关注点就从「开锁看世界」偏移到「打赢这场」，且会与肉鸽、动作包的判据重叠。',
    source };
  if (question.id === 'mv_save') return { value: 'defined_cap',
    reason: '给紧张感但别惩罚过头：把回跑单程时长压在有上限的范围内，靠捷径控制距离。长回跑加尸体回收已被玩家大量抱怨为无意义的难度填充，首版最不该采用。',
    source };
  return null;
}

function visualNovelRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/分支|多结局|选择.*改变|多线|路线/.test(words)) return { value: 'branch_once', reason: '你提到了分支或多结局；先用一处关键选择、加上即时反馈与角色提及，检验「选择被记住」是否成立。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/真结局|真相|集齐|解锁.*结局|拼图/.test(words)) return { value: 'reach_ending', reason: '你提到了真结局或真相；先用「先读完一条直接线、再凭读到的信息打开另一结局」检验前置是否拿得到。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'read_through', reason: '先做一段单线短篇：达成与失败最容易观察（读者是否读完），也最能先验证文本与演出是否立得住。它只是本包的首版预设，不代表已验证好玩。', source: '视觉小说内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋视觉小说内容包' : '视觉小说内容包预设';
  if (question.id === 'vn_shape') return { value: challenge?.optionValue === 'branch_once' ? 'trunk_branch' : 'kinetic',
    reason: challenge?.optionValue === 'branch_once' ? '要检验「一处关键选择走出自己的路」，主干＋短枝是成本最低的形状：分支只挂在关键点上，其余照常汇流。' : '第一版先用单线：词数与测试成本最低，能先把文本质量与演出节奏立住，再谈加分支。',
    source };
  if (question.id === 'vn_choice_type') return { value: 'remember',
    reason: '选择有三种性价比：换路最贵、开门条件便宜、角色后续提及最便宜也印象最深。新手最常见的死在「换路给太多、记住给太少」，首版先把「记住」做够。',
    source };
  if (question.id === 'vn_feedback') return { value: 'immediate',
    reason: '玩家会察觉自己在「假装玩」，不是因为分支不够多，而是因为选择之后世界毫无反应；先用最轻的即时反馈把意义感锁住。',
    source };
  if (question.id === 'vn_scope') return { value: 'expand_later',
    reason: '叙事最容易死在「写不完」。先极短、把结构与反馈做活，再纵向加章；「五千词」与「一到两万字」两个口径都只出自单篇教程或指南，证据单薄，仅作起点参考。',
    source: `${source}（规模数字证据单薄，此推荐仅供讨论）` };
  if (question.id === 'vn_protagonist') return { value: 'voiced',
    reason: '在叙事作品里「故事就是玩法」；空白主角会把全部戏剧张力推给配角，读者失去可投射的立场。给主角一个明确的声音与立场是首版最低要求。',
    source };
  if (question.id === 'vn_ending') return { value: 'closure',
    reason: '坏结局写成戛然而止的 Game Over，会让读者读了几小时却毫无收束感；把坏结局也写成一个完整结局，成本只是多几段交代。密而多的 Game Over 已被读者大量抱怨，首版慎用。',
    source };
  return null;
}

function puzzleRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/唯一解|逻辑|推理|排除|演绎|线索.*推|数独|谜面/.test(words)) return { value: 'deduce_chain', reason: '你提到了推理或唯一解；先用一条可演绎的推理链，检验「线索完备、答案可判定」是否成立。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/啊哈|顿悟|脑洞|巧解|恍然大悟|灵光|恍然大悟/.test(words)) return { value: 'insight_room', reason: '你提到了顿悟或巧妙解法；先用一组各自独立的洞察关，检验「误解能被设计出来」是否成立。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'mechanic_ladder', reason: '先做一条规则的阶梯：达成与失败最容易观察（同一规则能不能被用到底），也最能先验证规则本身是否立得住。它只是解谜包的首版预设，不代表已验证好玩。', source: '解谜内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋解谜内容包' : '解谜内容包预设';
  if (question.id === 'pz_axis') return { value: challenge?.optionValue === 'insight_room' ? 'insight' : challenge?.optionValue === 'deduce_chain' ? 'deduction' : 'ladder',
    reason: challenge?.optionValue === 'insight_room' ? '要检验「每关一个顿悟」，就需要每关单独设计误解与矛盾；这是洞察关的定义，也决定了成本会随关数线性上涨。' : challenge?.optionValue === 'deduce_chain' ? '要检验「答案唯一且可从已给信息推出」，就必须做成规则完备的演绎链，而不是靠减少提示来加难。' : '要检验「一条规则能不能被挖到穷尽」，机制阶梯是成本最低、最可控的形状：每一关只考这条规则的一个新面貌。',
    source };
  if (question.id === 'pz_teach') return { value: 'demo_then_use',
    reason: '完全不教在首局风险过高（前几关没被读懂就直接流失），先讲说明又把「发现」降级成「应用」；先用一两关演示、再用后面的关卡考它，是成本与顿悟质量的平衡点。',
    source };
  if (question.id === 'pz_fairness') return { value: 'all_in_game',
    reason: '品类的差评几乎都来自「不公平」：moon logic、像素狩猎、猜设计者的心。所有必要信息都在游戏里且都能被观察到，是最贴合品类的口径；留级的间接线索必须配确认线索兜底。',
    source };
  if (question.id === 'pz_hint') return { value: 'assumption',
    reason: '提示的目的是让玩家回到有效推理而不是替他完成顿悟：只点出值得怀疑的假设，既不泄露答案，又把那个误解指出来。给答案等于用几个月的设计换几秒的解卡。',
    source: `${source}（提示分级与触发时机出自单篇方法论分析，此推荐仅供讨论）` };
  if (question.id === 'pz_difficulty') return { value: 'sawtooth',
    reason: '解谜的难度不该是平滑坡道：每引入一个新东西先降难度让玩家站稳，再把这一个想法挖到穷尽；平滑上升会让某一关的高出一截变成断崖。',
    source };
  if (question.id === 'pz_scope') return { value: 'expand_later',
    reason: '解谜最容易死在「关卡数堆太多」与「机制堆太多」。先极小、把规则与可读性做活，再纵向加关；关卡数量的具体数字只出自开发者访谈的零散口径，证据单薄，仅作起点参考。',
    source: `${source}（关卡数量证据单薄，此推荐仅供讨论）` };
  return null;
}

function partyRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/诈唬|狼人|卧底|谁是.*鬼|隐藏身份|找.*内鬼/.test(words)) return { value: 'sus', reason: '你提到了诈唬或卧底；先用一轮信息暴露加公投票决检验熟人局的推理张力。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/合作|一起|配合|分工|同屏/.test(words)) return { value: 'cooperate', reason: '你提到了合作或分工；先用"任务多于人手"的混乱检验默契。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'laugh', reason: '先做"让全场笑一次"：创意产出加投票是验证最快的派对形态。它只是派对包的首版预设，不代表已验证好笑。', source: '派对内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋派对内容包' : '派对内容包预设';
  if (question.id === 'party_group') return { value: 'friends',
    reason: '先按熟人朋友局设计：内部梗和互相坑都合法；混龄与半熟局的约束之后按真实玩家再调。',
    source };
  if (question.id === 'party_joy') return { value: challenge?.optionValue === 'sus' ? 'bluff' : challenge?.optionValue === 'cooperate' ? 'chaos' : 'creative',
    reason: challenge?.optionValue === 'sus' ? '选了找人，核心快乐自然是诈唬推理；它需要私密信息形态支撑。' : challenge?.optionValue === 'cooperate' ? '选了扛混乱，快乐就来自默契考验：给玩家不可能优雅完成的处境。' : '创意表达是验证最快的快乐：笑点由玩家亲手产出，不靠你写段子。',
    source };
  if (question.id === 'party_device') return { value: challenge?.optionValue === 'sus' ? 'phones' : 'shared',
    reason: challenge?.optionValue === 'sus' ? '诈唬需要私密信息，一屏加人手一机（房间码）是最轻的实现。' : '首版先围着同一块屏幕：零连接成本，把笑声验证完再谈联机。',
    source };
  if (question.id === 'party_length') return { value: 'standard',
    reason: '10 到 15 分钟能容纳一轮完整的铺垫加揭晓；又臭又长是这类游戏差评最集中的死因。',
    source };
  return null;
}

function horrorRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/值班|上班|夜班|便利店|打工|日常/.test(words)) return { value: 'shift', reason: '你提到了值班或日常；先用一晚例行班表检验"不对劲渗进日常"。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/出海|采集|打捞|回港|赶海/.test(words)) return { value: 'return', reason: '你提到了出海或采集；先用"风险回报随夜上升、玩家自选收手"检验剂量权。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/逃生|逃离|密室|钥匙|洋馆|旧楼/.test(words)) return { value: 'escape', reason: '你提到了逃生或密室；先用一层连通楼检验资源剥夺与规则教学。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'shift', reason: '先做"撑过这一班"：日常班表是最便宜的恐惧容器，一晚只允许一次真威胁。它只是恐怖包的首版预设，不代表已验证吓人。', source: '恐怖内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋恐怖内容包' : '恐怖内容包预设';
  if (question.id === 'horror_lever') return { value: challenge?.optionValue === 'escape' ? 'resource' : challenge?.optionValue === 'return' ? 'info' : 'creep',
    reason: challenge?.optionValue === 'escape' ? '连通楼配紧张物品栏，恐惧来自"任何动作都是错的那步"。' : challenge?.optionValue === 'return' ? '回港局靠雾与不可读制造"无法规划"的恐惧，但要留可归因的线索。' : '班表局先让教学伪装成日常劳动，让不对劲慢慢渗进来。',
    source };
  if (question.id === 'horror_power') return { value: 'unreliable',
    reason: '给玩家可靠权力是把动作游戏错当恐怖的第一死因；完全无力又容易变播片——给一件不可靠、有代价的东西。',
    source };
  if (question.id === 'horror_death') return { value: 'wake',
    reason: '重复尝试是恐惧的头号杀手：失败后醒来或退回安全区、威胁自行降级，保住恐惧记忆。',
    source };
  if (question.id === 'horror_safe') return { value: challenge?.optionValue === 'return' ? 'time' : 'room',
    reason: challenge?.optionValue === 'return' ? '回港局用昼夜循环：玩家自选何时冒险，剂量权在他手里。' : '先用经典存档房：安全区本身也是张力源——想推进就必须离开。',
    source };
  return null;
}

function towerdefenseRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/集火|拐角|弯道|解谜|精英/.test(words)) return { value: 'focus', reason: '你提到了集火点或弯道；先用固定预算的集火点解谜检验布局的价值。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/经济|抉择|升级|取舍/.test(words)) return { value: 'choice', reason: '你提到了经济或取舍；先用"每波只够一件事"检验经济取舍是否立得住。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'hold', reason: '先做"守住第一条路"：一条路两种塔稀疏波次，让玩家亲眼验证一座塔能不能消化一波。它只是塔防包的首版预设，不代表已验证好玩。', source: '塔防内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋塔防内容包' : '塔防内容包预设';
  if (question.id === 'td_path') return { value: 'fixed',
    reason: '首版用固定路径：谜面是你设计的集火点位置，成本最低；开放造路要连带防堵死规则和卖塔惩罚，是另一个量级的规则成本。',
    source };
  if (question.id === 'td_depth') return { value: 'few',
    reason: '少而深：每种塔有鲜明职责才不出全能塔；横向多塔必须配敌人属性浮动，否则是图鉴填充。',
    source };
  if (question.id === 'td_block') return { value: challenge?.optionValue === 'hold' ? 'slow' : 'pure',
    reason: challenge?.optionValue === 'hold' ? '守路局给一座减速塔做低成本持续干预点，避免摆完旁观看戏。' : '先把建造取舍做扎实，可动单位的操作负担之后再谈。',
    source };
  if (question.id === 'td_econ') return { value: 'tight',
    reason: '打怪掉钱的紧凑循环是经典手感：每波结算都是一次取舍；宽松第二目标和利息线留给长线版本。',
    source };
  return null;
}

function survivalRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/波|来袭|袭击|防守|守住|僵尸.*夜|夜晚.*怪/.test(words)) return { value: 'hold_wave', reason: '你提到了波次或袭击防守；先用撑过第一波检验准备期→战斗期的两段结构。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/基地|工作台|家园|和朋友|一起建|合作|村庄|搭.*房子/.test(words)) return { value: 'build_base', reason: '你提到了基地或合作建造；先用搭起第一座工作台检验「建造成为共同目标」的闭环。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'survive_night', reason: '先做活过第一夜：火堆、庇护、可读的饿冷威胁，目标、时限与失败原因都容易直接显示。它只是生存建造包的首版预设，不代表已验证好玩。', source: '生存建造内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋生存建造内容包' : '生存建造内容包预设';
  if (question.id === 'sv_pressure') return { value: 'single',
    reason: challenge?.optionValue === 'hold_wave' ? '波次局里袭击本身就是核心压力；把其他系统压到最低，才看得清防线的取舍。' : '先只开一个致命压力，让第一周期的压力可读、能完整走通；多个系统互相拉扯，把游戏做「忙」却做空，是本品类最典型的死法。',
    source };
  if (question.id === 'sv_first_night') return { value: 'sandbag',
    reason: '留一只低压力「沙包」怪/事件当教学：新人在安全压力下学会战斗，并自证为什么要为夜晚准备；第一夜是核心记忆点，威胁必须可读且可达成。',
    source };
  if (question.id === 'sv_scarcity') return { value: challenge?.optionValue === 'build_base' ? 'material' : 'time',
    reason: challenge?.optionValue === 'build_base' ? '基地局的核心取舍是材料怎么分配（配方要去危险区拿）；但搬运与采集不能做成纯耗时，那是玩家反复点名的时间税。' : '把稀缺放在时间上：每个决定都在和天黑或下一波赛跑；采集搬运只是「盘」，时间是唯一真资源。',
    source };
  if (question.id === 'sv_scope') return { value: 'small_dense',
    reason: '先一小块做密的地图：换皮新群系是多年差评源，程序生成大地图被成功团队在原型期明确砍过；先把一小块区域的压力闭环跑通再谈扩大。',
    source };
  return null;
}

function simulationRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/偷|小偷|潜入|盗贼|盗|踩点|盗窃|夜贼/.test(words)) return { value: 'steal_job', reason: '你提到了潜入或偷窃；先用一栋房子的踩点→取物→撤离闭环检验潜行作业。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/洗|清洁|冲|水枪|powerwash/.test(words)) return { value: 'clean_job', reason: '你提到了清洗清洁；先用一处脏/净对比极强的封闭场景检验「洗到 100%」的反馈闭环。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/翻修|装修|房子|买房|刷墙|家具|翻新/.test(words)) return { value: 'flip_room', reason: '你提到了翻修或装修；先用一间小屋的清→刷→装→卖检验翻修作业。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/拆|诊断|故障|零件|汽修|机修|修车|维修/.test(words)) return { value: 'repair_job', reason: '你提到了维修拆装；先用拆开→诊断→换件→试机→交付的闭环检验作业结构。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/卡车|货车|驾驶|运输|送货|司机|出租车/.test(words)) return { value: 'flip_room', reason: '你提到了运输驾驶；本包首版方向没有载具作业（车辆类最难做出差异），先从「完成一件封闭作业并交付结算」的骨架做起，运输作业线留作后续。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'clean_job', reason: '先做一处封闭场景的清洗作业：脏/净对比最强、反馈最快、最容易做出「接单→执行→验收→结算」四步闭环。它只是广义模拟包的首版预设，不代表已验证好玩。', source: '广义模拟内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋广义模拟内容包' : '广义模拟内容包预设';
  if (question.id === 'sm_job_loop') return { value: 'full',
    reason: challenge?.optionValue === 'steal_job' ? '潜入作业的四步自带形态（踩点→潜入→取物→撤离）；首单就把这四步做全，作业感才完整。' : '首单闭环四步（接单→执行→验收→结算/解锁）是所有成功案例的一致形状；省掉验收或结算，作业感就散了。',
    source };
  if (question.id === 'sm_progress') return { value: challenge?.optionValue === 'flip_room' ? 'skill' : 'tool',
    reason: challenge?.optionValue === 'flip_room' ? '翻修作业又多又杂，技能树分档可开关能让「持续变强」始终可见（House Flipper 的实测做法）。' : '先做工具升级链：第一件升级在首单后立刻可买，让玩家在同一个场景里立刻感到更快更省力；多维度数值会让升级感知变糊。',
    source };
  if (question.id === 'sm_penalty') return { value: 'none',
    reason: '第一版默认无时间限制、无失败条件：这是成功厂商的刻意选择，也有玩家侧的低压与秩序感证据；评分制的规则不透明会被玩家读成「我为什么被扣分」。属单作品样本的方向，先试、看反馈再改。',
    source: `${source}（无失败条件是成功厂商的刻意选择、属单作品样本，此推荐仅供讨论）` };
  if (question.id === 'sm_variety') return { value: challenge?.optionValue === 'flip_room' ? 'minigame' : 'unique',
    reason: challenge?.optionValue === 'flip_room' ? '翻修动作又长又碎，用可选小游戏打断节奏是 House Flipper 2 的实测做法；长动作连做会变无聊。' : '作业变化只能来自作业对象本身：每个作业要有独特剪影与命名的可操作单元；靠数量堆只会被读成换皮。',
    source };
  return null;
}

function idleRecommendation(project, question) {
  if (question.id === 'first_challenge') {
    const words = project.input.idea;
    if (/点一下|点击器|点击.*得|clicker|手点/.test(words)) return { value: 'click_to_auto', reason: '你提到了点击或手动产出；先用「点一下得一份 → 不点也在涨」检验自动化这第一口糖。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/重置|转生|prestige|换蛋|周目|清零.*乘数/.test(words)) return { value: 'first_reset', reason: '你提到了重置或转生；先用冲到第一次重置换永久乘数检验增量曲线的核心循环。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    if (/离线|挂机.*升级|技能.*养成|回来.*收获|AFK/.test(words)) return { value: 'offline_lines', reason: '你提到了离线或多线养成；先用并行推进的养成线检验「离开有收获、回来有决策」。此为文字线索，仍由你确认。', source: '用户原话中的待确认线索' };
    return { value: 'click_to_auto', reason: '先做经典点击器：把点击换成自动产出，第一口糖最容易做成，也最能先验证成本/产出曲线是否成立。它只是增量挂机包的首版预设，不代表已验证好玩。', source: '增量挂机内容包预设' };
  }
  const challenge = acceptedChallenge(project);
  const source = challenge ? '已确认的首局目标＋增量挂机内容包' : '增量挂机内容包预设';
  if (question.id === 'idl_pace') return { value: 'frequent',
    reason: '先做密的提速节点：十几分钟内自动化、一小时内明显提速是成功案例的一致形状；具体间隔无权威秒数，用脚本跑 60 分钟曲线验证，不出数字硬承诺。',
    source };
  if (question.id === 'idl_wait') return { value: 'decision',
    reason: '把等待压短并在每个等待段留一个可做决策（买哪个/存钱/换倍率）；长等待或靠离线填补最容易滑向「无事可做」。',
    source };
  if (question.id === 'idl_prestige') return { value: 'taught',
    reason: challenge?.optionValue === 'first_reset' ? '既然首局就是重置，第一次重置的目标与规则更要显式标注：重置时机本身是策略深度，但「玩家靠攻略才懂何时重置」是差评反例。' : '把第一次重置说成可见的里程碑：何时重置、换到什么，玩家一分钟读得懂；不点破的风险是首局读不懂直接流失。',
    source };
  if (question.id === 'idl_offline') return { value: 'capped',
    reason: '先给离线收益一个硬上限并把「这是设计选择」写出来：离线太强在线无意义、太弱回来没收获。上限数值先例只有单款作品（约两小时），低证据、仅作起点。',
    source: `${source}（离线上限先例为单款作品，低证据、此推荐仅供讨论）` };
  return null;
}

const PACK_RECOMMENDERS = {
  'genre.tactics': tacticsRecommendation,
  'genre.management': managementRecommendation,
  'genre.gambling': gamblingRecommendation,
  'genre.party': partyRecommendation,
  'genre.horror': horrorRecommendation,
  'genre.towerdefense': towerdefenseRecommendation,
  'genre.rogue': rogueRecommendation,
  'genre.metroidvania': metroidvaniaRecommendation,
  'genre.visual-novel': visualNovelRecommendation,
  'genre.puzzle': puzzleRecommendation,
  'genre.survival': survivalRecommendation,
  'genre.simulation': simulationRecommendation,
  'genre.idle': idleRecommendation,
};

function genrePackRecommendation(project, question) {
  const explicit = project.input.genre;
  const genre = explicit && explicit !== 'auto' && explicit !== 'other' ? explicit : inferredGenreOf(project);
  const pack = activeGenrePack(genre);
  if (!pack || (question.id !== 'first_challenge' && !pack.questions.some(item => item.id === question.id))) return null;
  return PACK_RECOMMENDERS[pack.id]?.(project, question) ?? null;
}

function inferredGenreOf(project) {
  return inferGenreFromIdea(project.input.idea ?? '');
}

// 品类推断的唯一实现：只看游戏想法，不看工程条件。workbench-core 的 intakeProfile 同用此函数。
function inferGenreFromIdea(idea) {
  return /战棋|回合策略|战术棋|SRPG/i.test(idea) ? 'tactics'
    : /赌博|赌局|赌桌|赌场|牌局|扑克/.test(idea) ? 'gambling'
    : /肉鸽|rogue|爬塔|构筑|牌组|卡组|割草|幸存者|slay the spire|balatro/i.test(idea) ? 'rogue'
    : /银河城|银河恶魔城|类银河|metroidvania|横版探索|能力锁|恶魔城|迷宫探索|老式横版/i.test(idea) ? 'metroidvania'
    : /视觉小说|叙事冒险|galgame|AVG|文字冒险|互动小说|文字游戏|剧情游戏|多结局|分支剧情|恋爱游戏|乙女|剧情向/i.test(idea) ? 'visual-novel'
    : /解谜|解迷|puzzle|谜题|谜面|推箱|推箱子|脑筋急转弯|数独|填字|密室|逃脱|逃脱游戏|烧脑|推理解谜|逻辑谜题|机关谜题/.test(idea) ? 'puzzle'
    : /派对|聚会游戏|party game|多人同乐|同屏游戏|团建|胡闹厨房|友尽/i.test(idea) ? 'party'
    : /恐怖|惊悚|吓人|微恐|creepy|horror|生存恐怖/i.test(idea) ? 'horror'
    : /塔防|tower defense|td游戏|波次|防线|守塔/i.test(idea) ? 'towerdefense'
    : /生存|求生|饥荒|庇护所|避难所|僵尸|crafting|survival/i.test(idea) ? 'survival'
    : /模拟器|洗车|小偷|盗贼|卡车|货车|装修|翻修|汽修|修车|simulator/i.test(idea) ? 'simulation'
    : /挂机|放置|idle|增量|incremental|点击器|clicker|离线收益|prestige/i.test(idea) ? 'idle'
    : /经营|种田|农场|餐厅|商店模拟/.test(idea) ? 'management' : 'unspecified';
}

function genrePackPlan(project, genre) {
  const pack = activeGenrePack(genre);
  if (!pack) return '';
  const name = pack.shortTitle ?? pack.title;
  const accepted = topic => (project.designDecisions ?? []).find(item => item.topic === topic && item.status === 'accepted');
  const challenge = accepted('首局目标');
  const chosen = topic => accepted(topic)?.label ?? `尚未确认，可先按${name}包预设制作占位版本`;
  const questionLines = pack.questions.map(question => `- ${question.topic}：${chosen(question.topic)}。`).join('\n');
  return `## ${name}首局施工骨架（内容包预设）\n\n- 目标：${challenge?.label ?? '尚未确认'}。${challenge?.consequence ?? '先选首局目标，不能把候选写成已定规则。'}\n- 可修改的关卡草案：${pack.prototype.missions[challenge?.optionValue] ?? `先确认${pack.firstChallenge.options.map(item => item.label).join('、')}等首局目标；下面的循环只是通用品类预设。`}\n${questionLines}\n- 最小可玩循环：${pack.prototype.loop}\n- 结束与验收：${pack.prototype.acceptance.join('；')}\n- 首版暂缓：${pack.prototype.defer.join('；')}。\n- 依据边界：${pack.boundary}\n\n`;
}


// 题库是离线预设。这里的推荐是默认草案，不代表模型已评审当前项目。
const card = (id, group, topic, prompt, why, options, settings = {}) => ({
  id, group, topic, prompt, why,
  options: options.map(([value, label, effect]) => ({ value, label, effect })),
  recommended: options[0][0], depth: 'essential', when: 'all', dependsOn: [], ...settings,
});

const QUESTION_BANK = [
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
function availableQuestions(project) {
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

function recommendationFor(project, question) {
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

function reviewIssues(project) {
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

function questionnaireView(project, { deep = false } = {}) {
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

function answerQuestion(project, id, value) {
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

function usePresetRecommendation(project, id) {
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

function kickoffDraft(project) {
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


// 03 做出来：制作任务包与可玩证据回挂。工作台离线，不在线生成游戏；
// 证据分级写死：构建通过 ≠ 运行通过 ≠ 玩通 ≠ 真人试玩。
const EVIDENCE_TYPES = { build: '构建通过', run: '实际运行', playthrough: '从头玩到结果', playtest: '真人试玩' };
const LEVEL_ORDER = ['build', 'run', 'playthrough', 'playtest'];
const SOURCES = { user: '用户自述', ai: 'AI 报告', log: '日志或文件' };

const accepted = (project, topic) => (project.designDecisions ?? [])
  .find(item => item.topic === topic && item.status === 'accepted');

function evidenceLevel(project) {
  let best = -1;
  for (const item of project.evidence ?? []) {
    if (item.status !== 'current') continue;
    const effective = item.type === 'playtest' && item.degraded ? 'playthrough' : item.type;
    best = Math.max(best, LEVEL_ORDER.indexOf(effective));
  }
  return best < 0 ? null : LEVEL_ORDER[best];
}

function evidenceBoardLabel(project) {
  const level = evidenceLevel(project);
  return { null: '未制作', build: '已构建，未运行', run: '已运行，未玩通',
    playthrough: '已玩通，未试玩', playtest: '有真人试玩记录' }[level ?? 'null'];
}

function buildTaskDocument(project) {
  const valid = validateProject(project);
  const route = valid.decisions.route?.status === 'accepted' ? valid.decisions.route : null;
  const focus = valid.decisions.focus?.status === 'accepted' ? valid.decisions.focus : null;
  const challenge = accepted(valid, '首局目标');
  const test = accepted(valid, '首个验证问题');
  const pack = activeGenrePack(intakeProfile(valid).genre);
  const guidance = intakeGuidance(valid);
  const evidence = (valid.evidence ?? []).filter(item => item.status === 'current');
  return `# 制作任务包

> 项目记录 v${valid.version} · 与同一项目包的记录配套 · 工作台离线生成，不含模型判断

## 要做什么

- 首局目标：${challenge ? `${challenge.label}。${challenge.consequence}` : '未定——先回 01 选定，不能把候选写成任务。'}
- 第一份作品重点：${focus ? `${focus.label}。${focus.effect}` : '未定'}
- 起步路线：${route?.label ?? '未定'}
- 首次试玩先观察：${test ? `${test.label}。${test.consequence}` : '未定'}

${genrePackPlan(valid, intakeProfile(valid).genre)}${enginePackPlan(valid.input.constraints)}${pack ? '' : '## 内容包覆盖\n\n- 当前品类暂无完整内容包，上面没有品类骨架；把这份任务书和你的想法一起交给带张翼 skill 的 AI，由它给首局设计。\n\n'}## 制作纪律

1. 只做本任务书写的范围；暂缓项不做，不顺手扩展。
2. 做出后实际运行：从开局玩到胜或负，再重开一次。构建通过、运行通过、玩通是三件不同的事，分别留证据。
3. 完成后回到工作台"03 做出来"导入可玩证据（构建/运行/玩通/试玩的记录）。**"AI 说做完了"不算证据**——证据要有可核对的形态（日志、文件、记录）。
4. 未定的地方先给可修改草案，不把暂拟写成已定。

## 开工前：把对话分开

同一个 AI 对话里又开发又生图，上下文会很快混乱甚至爆掉——爆了以后，前面谈好的约定就丢了。像真正的团队分工一样，按项目需要给每类工作单开对话：

- **主开发对话**：带上这份任务包和 \`zhangyi.project.json\`，负责玩法、规则与整合；所有决定以它为准。
- **场景图对话**：只出场景图。第一条消息写清题材、风格方向与用途；它不改玩法。
- **角色立绘对话**：只出角色图。先锁角色清单与形象锚点，再逐张出图。
- **界面 UI 对话**：只做界面。把已定的美术方向贴给它，保持同一套语言。

纪律：一个对话只干一件事；任何对话里诞生的设计决定，回到工作台确认后才算数——对话记录不是项目记录。哪个对话开始乱了，导出要点、开新对话接上，别硬撑。

## 已有证据

${evidence.length ? evidence.map(item => `- [${EVIDENCE_TYPES[item.type]}] ${item.note}（${SOURCES[item.source]}，${item.at}）`).join('\n') : '- 尚无。'}

- ${guidance.boundary}

—— 张翼 Spread the Pinions · 制作任务包 v${valid.version}
`;
}

function importEvidence(project, payload) {
  const valid = validateProject(project);
  if (!payload || payload.schemaVersion !== 1 || payload.projectCreatedAt !== valid.createdAt
      || payload.baseVersion !== valid.version) throw new Error('证据与当前项目版本不一致；请先保存最新项目包。');
  if (!Array.isArray(payload.records) || payload.records.length < 1 || payload.records.length > 8) {
    throw new Error('证据应为 1—8 条记录。');
  }
  const text = (value, name, max = 800) => {
    const cleaned = String(value ?? '').trim();
    if (!cleaned || cleaned.length > max) throw new Error(`${name}缺失或过长。`);
    return cleaned;
  };
  const next = structuredClone(valid);
  for (const [index, record] of payload.records.entries()) {
    if (!record || !Object.hasOwn(EVIDENCE_TYPES, record.type)) throw new Error(`第 ${index + 1} 条证据类型无效（只能 build / run / playthrough / playtest）。`);
    if (!Object.hasOwn(SOURCES, record.source)) throw new Error(`第 ${index + 1} 条证据来源无效（只能 user / ai / log）。`);
    const note = text(record.note, `第 ${index + 1} 条证据的验证方式`);
    const at = text(record.at, `第 ${index + 1} 条证据的日期`, 40);
    let degraded = false;
    if (record.type === 'playtest') {
      const sample = record.sample ?? {};
      if (!sample.origin || !sample.size || !sample.caliber) degraded = true;
    }
    next.evidence.push({ id: `evidence-${next.version + 1}-${index + 1}`, type: record.type,
      note, source: record.source, at, degraded, status: 'current' });
  }
  next.version += 1;
  next.updatedAt = new Date().toISOString();
  const degradedCount = payload.records.filter(record => record.type === 'playtest'
    && !(record.sample?.origin && record.sample?.size && record.sample?.caliber)).length;
  next.history.push({ id: `change-${next.version}`, at: next.updatedAt, type: 'evidence_imported',
    summary: `导入可玩证据 ${payload.records.length} 条${degradedCount ? `（其中 ${degradedCount} 条真人试玩缺样本三要素，降级为自述）` : ''}；设计决定未改动。` });
  return next;
}


// 04 试玩与修订：试飞任务导出、场次级试玩记录导入、修订建议生成。
// 天条：不伪造玩家声音；缺样本三要素的场次降级为自述级；04 不替用户改方案。
const PLAYTEST_GEARS = { observe: '首次观察', walkthrough: '体验走查', revise: '修订核对' };

function playtestGear(project) {
  const hasSessions = (project.playtests ?? []).some(item => item.status === 'current');
  if (hasSessions) return 'revise';
  const level = evidenceLevel(project);
  if (level === 'playthrough' || level === 'playtest') return 'walkthrough';
  if (level === 'run') return 'observe';
  return null;
}

const GEAR_GUIDE = {
  observe: {
    goal: '玩家不看任何说明，能否理解开场、能否独立完成一局。',
    checklist: ['开场 30 秒：玩家先点了什么、有没有问"我该干什么"',
      '第一轮是否独立玩完；在哪里停下、皱眉或笑', '结束后让玩家用自己的话复述刚才玩了什么'],
    interview: ['你觉得自己刚才在做什么？', '哪一刻你不确定该怎么办？', '哪一刻你觉得有意思或没意思？'],
  },
  walkthrough: {
    goal: '找出卡点、困惑点与情绪曲线；不推销、不辩解。',
    checklist: ['逐段记录玩家卡住的地方（时间点＋卡在哪）', '情绪高点与低点各出现在什么时候',
      '结束后玩家的自发复述与你设计的重点是否一致'],
    interview: ['哪一段最想跳过？', '有没有哪里你以为会出事结果没有？', '如果再玩一次，你会先做什么？'],
  },
  revise: {
    goal: '核对上一轮发现是否被最近的改动覆盖；没覆盖的照旧算数。',
    checklist: ['逐条重读上一场的发现，标注"本次改动是否碰到它"', '被方案改动影响到的旧记录先标"需复核"再用',
      '新观察只记新事实，不与旧印象合并'],
    interview: ['和上次比，这次哪里顺了？', '之前卡你的地方这次还卡吗？'],
  },
};

function playtestTaskDocument(project) {
  const valid = validateProject(project);
  const gear = playtestGear(valid);
  const guide = gear ? GEAR_GUIDE[gear] : null;
  const sessions = (valid.playtests ?? []).filter(item => item.status === 'current');
  return `# 试飞任务

> 项目记录 v${valid.version} · 与同一项目包的记录配套 · 工作台离线生成，不替你执行试玩

## 当前档位

${guide ? `- 档位：${PLAYTEST_GEARS[gear]}（依据证据状态：${evidenceBoardLabel(valid)}${sessions.length ? `；已有试玩场次 ${sessions.length} 场` : ''}）
- 目标：${guide.goal}` : `- 还没到试飞节点：当前证据状态是"${evidenceBoardLabel(valid)}"。先回 03 做出来，让游戏实际运行起来；能跑了再来这里。`}

${guide ? `## 招募与样本

- 找**不认识这个方案**的人；朋友可以，但要在记录里写明关系。
- 甄别问题：平时玩这类游戏吗？大概多久玩一次？有没有见过这个项目的雏形？
- 样本计划（执行后填进记录）：来源______；人数______；口径（观察／访谈／问卷）______。

## 观察清单

${guide.checklist.map(item => `- ${item}`).join('\n')}

## 访谈提纲（观察完再问，不要边玩边问）

${guide.interview.map(item => `- ${item}`).join('\n')}

## 红线

1. 不引导、不解释、先观察后提问；玩家卡住时先等，出手帮忙之前记下卡了多久。
2. 记录事实（玩家在几分几秒做了什么），不记录印象（"玩家好像喜欢"不算）。
3. 模拟 persona 与 AI 自问自答不是试玩；林思雨的聊天内容也不算。
4. 回来后在 04 页导入记录：缺样本三要素的场次会被降级为自述级。

` : ''}—— 张翼 Spread the Pinions · 试飞任务 v${valid.version}
`;
}

function revisionDocument(project) {
  const valid = validateProject(project);
  const sessions = [...(valid.playtests ?? [])].reverse();
  const body = sessions.length ? sessions.map(item => {
    const facts = item.facts.map(f => `  - ${f}`).join('\n') || '  - 无';
    const conclusions = item.conclusions.map(c => `  - ${c}`).join('\n') || '  - 无';
    const suggestions = item.suggestions.map(s => `  - ${s}`).join('\n') || '  - 本场未给建议；建议由你回看事实后写下。';
    const flags = `${item.degraded ? '（自述级：缺样本三要素）' : ''}${item.status === 'needs_review' ? '（方案已改，需复核）' : ''}${item.unsupported ? '（警告：有结论但没有事实支撑）' : ''}`;
    return `## ${item.at} 的场次${flags}

- 样本：${item.degraded ? '未记全' : `来源 ${item.sample.origin}／人数 ${item.sample.size}／口径 ${item.sample.caliber}`}

- 事实：
${facts}
- 结论：
${conclusions}
- 建议：
${suggestions}`;
  }).join('\n\n') : '尚无试玩记录。先在 04 页导入场次记录，再生成修订建议。';
  return `# 修订建议

> 项目记录 v${valid.version} · 工作台离线整理 · 本文档只列建议，不替你改方案

${body}

## 怎么用这份建议

- 每条建议回到"01 立项"改答案、或回"02 审方案"走审查，由你亲手确认才算数。
- 方案改动后，旧证据与旧场次会自动标为需复核；改动是否覆盖了发现，用下一场观察核对。

—— 张翼 Spread the Pinions · 修订建议 v${valid.version}
`;
}

const cleanList = (value, name, { min, max, maxLength }) => {
  if (value == null) return [];
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    throw new Error(`${name}应为 ${min}—${max} 条。`);
  }
  return value.map((entry, index) => {
    const text = String(entry ?? '').trim();
    if (!text || text.length > maxLength) throw new Error(`${name}第 ${index + 1} 条缺失或过长。`);
    return text;
  });
};

function importPlaytests(project, payload) {
  const valid = validateProject(project);
  if (!payload || payload.schemaVersion !== 1 || payload.projectCreatedAt !== valid.createdAt
      || payload.baseVersion !== valid.version) throw new Error('记录与当前项目版本不一致；请先保存最新项目包。');
  if (!Array.isArray(payload.sessions) || payload.sessions.length < 1 || payload.sessions.length > 6) {
    throw new Error('试玩记录应为 1—6 场。');
  }
  const next = structuredClone(valid);
  next.playtests ??= [];
  for (const [index, session] of payload.sessions.entries()) {
    const at = String(session?.at ?? '').trim();
    if (!at || at.length > 40) throw new Error(`第 ${index + 1} 场的日期缺失或过长。`);
    const facts = cleanList(session.facts, `第 ${index + 1} 场的事实`, { min: 0, max: 8, maxLength: 200 });
    const conclusions = cleanList(session.conclusions, `第 ${index + 1} 场的结论`, { min: 0, max: 5, maxLength: 200 });
    const suggestions = cleanList(session.suggestions, `第 ${index + 1} 场的建议`, { min: 0, max: 5, maxLength: 200 });
    if (!facts.length && !conclusions.length) throw new Error(`第 ${index + 1} 场没有事实也没有结论，无法导入。`);
    const sample = session.sample ?? {};
    const degraded = !(String(sample.origin ?? '').trim() && sample.size && String(sample.caliber ?? '').trim());
    next.playtests.push({ id: `session-${next.version + 1}-${index + 1}`, at,
      sample: { origin: String(sample.origin ?? '').trim(), size: Number(sample.size) || 0,
        caliber: String(sample.caliber ?? '').trim() },
      facts, conclusions, suggestions, degraded,
      unsupported: conclusions.length > 0 && facts.length === 0, status: 'current' });
  }
  next.version += 1;
  next.updatedAt = new Date().toISOString();
  const degradedCount = next.playtests.slice(-payload.sessions.length).filter(item => item.degraded).length;
  next.history.push({ id: `change-${next.version}`, at: next.updatedAt, type: 'playtests_imported',
    summary: `导入试玩记录 ${payload.sessions.length} 场${degradedCount ? `（其中 ${degradedCount} 场缺样本三要素，降级为自述级）` : ''}；设计决定未改动。` });
  return next;
}


const active = (project, topic) => (project.designDecisions ?? []).find(item => item.topic === topic && item.status === 'accepted');
const label = (project, topic) => active(project, topic)?.label ?? '未定';
const symptomLabel = project => {
  const inferred = { clarity: '看不懂目标或规则', feedback: '做了操作却看不出结果', scope: '流程太长，做不完一轮' };
  return active(project, '首个待查症状')?.label
    ?? (inferred[intakeProfile(project).symptom] ? `${inferred[intakeProfile(project).symptom]}（用户描述，待观察）` : '未定');
};

const FIRST_TABLES = [
  { value: 'blackjack', label: '21 点', detail: '建议先做：规则容易入门，能把识破作弊、准备、赌局和结果连成一轮。' },
  { value: 'holdem', label: '德州扑克', detail: '多人心理战较强；对手行为、信息展示和测试量都更大。' },
  { value: 'bingo', label: 'BINGO', detail: '适合呈现公开规则是否公平；需要先设计玩家能采取的反制行动。' },
  { value: 'hitandbit', label: '猜数字', detail: '推理规则集中、制作较轻；要补上与人物和赌注的联系。' },
];

function reviewSnapshot(project) {
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

function chooseFirstTable(project, value) {
  const option = FIRST_TABLES.find(item => item.value === value);
  if (!option || !reviewSnapshot(project).needsFirstTable) throw new Error('当前项目无需选择首个赌桌。');
  const next = recordDesignDecision(project, '首个可玩赌桌', option.label,
    `先以${option.label}打通准备、对局、胜负结算与后续变化；首版四桌主线的决定不变。其余赌桌随后逐一接入。`, 'user');
  active(next, '首个可玩赌桌').reviewChoiceId = value;
  return next;
}

function keepRetry(project) {
  if (!reviewIssues(project).some(item => item.id === 'loss-or-retry')) throw new Error('当前没有这项冲突。');
  return recordDesignDecision(project, '胜负代价', '正式输局可重试，本次不跨局扣资格',
    '撤回原“输局扣资格并带损失继续”的结算规定。重试前可显示失败原因，但资格和押注不进入后续故事；需要另设计长期压力来源。', 'user');
}

function reviewDocument(project) {
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


const cleanReviewValue = value => String(value ?? '').trim();
const validText = (value, name, max = 800) => {
  if (typeof value !== 'string') throw new Error(`${name}必须是文字。`);
  const text = cleanReviewValue(value);
  if (!text || text.length > max) throw new Error(`${name}缺失或过长。`);
  return text;
};
const bases = { record: '项目记录', inference: '张翼推演', external: '外部线索，待核实' };

function reviewTaskDocument(project) {
  const valid = validateProject(project);
  return `# 张翼方案审查任务\n\n> 项目记录 v${valid.version} · 本文件与同一项目包的记录配套使用\n\n请读取项目包中的 \`zhangyi.project.json\`、\`立项书草案.md\` 与 \`方案审查记录.md\`，按张翼 skill 审查当前方案。特别检查玩家第一局实际做什么、赢输怎样改变处境、现成工程的可复用范围是否有证据。游戏品类与有无现成工程是独立维度。不要把源码存在、编译通过说成新游戏已经玩通；不要编造玩家反馈。\n\n先给用户一段通俗的审查说明，再把下列 JSON 保存为 UTF-8 文件，供工作台“导入张翼审查结果”使用。只提出真正改变方案的 1—6 项意见；每项说明理由、改动代价、验证方式和依据类型。建议是建议，不能写成用户已拍板。若证据不足，\`basis\` 用 \`inference\`。\n\n\`\`\`json\n${JSON.stringify({
    schemaVersion: 1, projectCreatedAt: valid.createdAt, baseVersion: valid.version,
    summary: '一句话说清当前最值得推进的部分和最大缺口',
    interventions: [{ topic: '首局目标', current: '当前项目记录中的结论，未定则写未定',
      proposal: '建议改成的具体决定', effect: '采纳后玩家行为或项目范围会怎样变化',
      reason: '为什么这样改', cost: '这样改会失去什么或增加什么工作',
      verification: '下一次用什么可观察的证据核实', basis: 'inference', basisDetail: '依据哪条项目记录或哪项已核实证据' }],
  }, null, 2)}\n\`\`\`\n\n依据类型只能选：\`record\`（项目记录）、\`inference\`（张翼推演）、\`external\`（外部线索待核实）。用户原话和项目包不是运行或真人试玩证据。\n\n—— 张翼 Spread the Pinions · 审查任务 v${valid.version}\n`;
}

function importReview(project, payload) {
  const valid = validateProject(project);
  if (!payload || payload.schemaVersion !== 1 || payload.projectCreatedAt !== valid.createdAt
      || payload.baseVersion !== valid.version) throw new Error('审查结果与当前项目版本不一致；请用最新项目包重新审查。');
  if (!Array.isArray(payload.interventions) || payload.interventions.length < 1 || payload.interventions.length > 8) {
    throw new Error('审查结果应有 1—8 条具体介入意见。');
  }
  const summary = validText(payload.summary, '审查摘要', 1200);
  const seen = new Set();
  const interventions = payload.interventions.map((item, index) => {
    if (!item || !Object.hasOwn(bases, item.basis)) throw new Error('介入意见缺少有效的依据类型。');
    const topic = validText(item.topic, '主题', 100);
    if (seen.has(topic)) throw new Error('同一主题不能在一次审查中给出多条相互竞争的建议。');
    seen.add(topic);
    return { id: `judgment-${valid.version + 1}-${index + 1}`, topic,
      current: validText(item.current, '当前方案'), proposal: validText(item.proposal, '建议结论'),
      effect: validText(item.effect, '实际影响'), reason: validText(item.reason, '判断理由'),
      cost: validText(item.cost, '改动代价'), verification: validText(item.verification, '验证方式'),
      basis: item.basis, basisDetail: validText(item.basisDetail, '依据说明'), status: 'proposed' };
  });
  const next = structuredClone(valid);
  next.version += 1;
  next.updatedAt = new Date().toISOString();
  const reviewId = `review-${next.version}`;
  next.judgments.push({ id: reviewId, kind: 'ai_review', sourceVersion: valid.version,
    at: next.updatedAt, summary, interventions });
  next.history.push({ id: `change-${next.version}`, at: next.updatedAt, type: 'ai_review_imported',
    summary: `导入张翼审查：${interventions.length} 条待采纳建议；没有自动改动游戏决定。` });
  return next;
}

function latestReview(project) {
  return [...(project.judgments ?? [])].reverse().find(item => item.kind === 'ai_review') ?? null;
}

function resolveIntervention(project, id, action) {
  if (!['accept', 'defer'].includes(action)) throw new Error('未知介入处理方式。');
  const review = latestReview(project);
  const intervention = review?.interventions.find(item => item.id === id);
  if (!intervention || intervention.status !== 'proposed') throw new Error('这条建议已处理或已过期。');
  let next = action === 'accept'
    ? recordDesignDecision(project, intervention.topic, intervention.proposal, intervention.effect, 'user')
    : structuredClone(project);
  const nextItem = latestReview(next).interventions.find(item => item.id === id);
  nextItem.status = action === 'accept' ? 'accepted' : 'deferred';
  if (action === 'accept') {
    next.history.at(-1).type = 'ai_suggestion_accepted';
    next.history.at(-1).summary = `采纳张翼建议：${intervention.topic}。`;
  } else {
    next.version += 1;
    next.updatedAt = new Date().toISOString();
    next.history.push({ id: `change-${next.version}`, at: next.updatedAt,
      type: 'ai_suggestion_deferred', summary: `暂缓张翼建议：${intervention.topic}。` });
  }
  return next;
}

function interventionDocument(project) {
  const reviews = (project.judgments ?? []).filter(item => item.kind === 'ai_review');
  if (!reviews.length) return '# 张翼介入记录\n\n当前尚未导入 AI 审查结果。工作台的离线规则提示不算模型专业评审。\n';
  const entries = reviews.map(review => `## 审查 ${review.id}（基于项目 v${review.sourceVersion}）\n\n${review.summary}\n\n${review.interventions.map(item => `### ${item.topic} · ${item.status === 'accepted' ? '用户已采纳' : item.status === 'deferred' ? '暂缓' : item.status === 'needs_review' ? '已过期，需复核' : '待用户决定'}\n\n- 原方案：${item.current}\n- 张翼建议：${item.proposal}\n- 对玩家和范围的影响：${item.effect}\n- 理由：${item.reason}\n- 代价：${item.cost}\n- 核实方式：${item.verification}\n- 依据：${bases[item.basis]}；${item.basisDetail}`).join('\n\n')}`).join('\n\n');
  return `# 张翼介入记录\n\n> 项目记录 v${project.version}。AI 建议与用户已确认的决定分开记录；外部线索未由工作台核实。\n\n${entries}\n`;
}

const encoder = new TextEncoder();

function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let i = 0; i < 8; i++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
  }
  return (value ^ 0xffffffff) >>> 0;
}

function write16(view, offset, value) { view.setUint16(offset, value, true); }
function write32(view, offset, value) { view.setUint32(offset, value >>> 0, true); }
function join(parts) {
  const size = parts.reduce((total, part) => total + part.length, 0);
  const result = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.length; }
  return result;
}

function makeZip(files) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = encoder.encode(file.content);
    const checksum = crc32(data);
    const header = new Uint8Array(30 + name.length);
    const lh = new DataView(header.buffer);
    write32(lh, 0, 0x04034b50);
    write16(lh, 4, 20);
    write16(lh, 6, 0x0800);
    write16(lh, 8, 0);
    write16(lh, 10, 0);
    write16(lh, 12, 0x0021);
    write32(lh, 14, checksum);
    write32(lh, 18, data.length);
    write32(lh, 22, data.length);
    write16(lh, 26, name.length);
    write16(lh, 28, 0);
    header.set(name, 30);
    local.push(header, data);

    const listing = new Uint8Array(46 + name.length);
    const cd = new DataView(listing.buffer);
    write32(cd, 0, 0x02014b50);
    write16(cd, 4, 20);
    write16(cd, 6, 20);
    write16(cd, 8, 0x0800);
    write16(cd, 10, 0);
    write16(cd, 12, 0);
    write16(cd, 14, 0x0021);
    write32(cd, 16, checksum);
    write32(cd, 20, data.length);
    write32(cd, 24, data.length);
    write16(cd, 28, name.length);
    write16(cd, 30, 0);
    write16(cd, 32, 0);
    write16(cd, 34, 0);
    write16(cd, 36, 0);
    write32(cd, 38, 0);
    write32(cd, 42, offset);
    listing.set(name, 46);
    central.push(listing);
    offset += header.length + data.length;
  }
  const centralBytes = join(central);
  const end = new Uint8Array(22);
  const directory = new DataView(end.buffer);
  write32(directory, 0, 0x06054b50);
  write16(directory, 4, 0);
  write16(directory, 6, 0);
  write16(directory, 8, files.length);
  write16(directory, 10, files.length);
  write32(directory, 12, centralBytes.length);
  write32(directory, 16, offset);
  write16(directory, 20, 0);
  return join([...local, centralBytes, end]);
}

// Interface copy only. Project records, content packs, drafts and exported files stay in Chinese.
const UI_MESSAGES = {
  'zh-CN': {
    language: '语言', pageTitle: '张翼工作台 · 从想法到第一局', languageNote: '品类包内容目前仅中文；切换语言不会翻译题目、草案或导出文件。',
    mentorName: '林思雨', mentorOpen: '看看下一步', mentorClose: '收起提示',
    petShow: '显示林思雨', petHide: '隐藏林思雨', petModeAI: '可连接本机配置的 AI 服务', petModeOffline: '离线项目指引',
    petNoteAI: '发送消息时，你的问题与简短项目摘要会交给本机配置的 AI 服务；回答未经过工程或玩家验证。',
    petNoteOffline: '离线时只回答当前项目记录与工作台操作；不会假装已审查工程或见过玩家。',
    petGreeting: '我在这里。下面列的是常被问到的事，点一条我就答；也可以直接问我。',
    petSummaryLead: '你记录的想法：', petSummaryBoundary: '这只是你目前写下的内容，我还没有审过工程或试玩。',
    petNoIdea: '你还没写想法。先在立项页留下一句话，我就能带你看下一步。',
    petPractice: '试着只用一句话说清：玩家在第一局做哪一个动作？这个动作成功或失败后，画面会给出什么结果？',
    petEvidenceBoundary: '没有。我只能读到这份工作台记录；还没运行你的工程，也没观察真人玩家。要判断工程是否可用，先做一轮实际运行并留下可核对的结果。',
    petOfflineFallback: '我现在没有连接 AI 服务，无法可靠回答开放问题。可以点下方的常见问题；需要深入判断时，把项目包交给带张翼 skill 的 AI。',
    petThinking: '正在整理回答…', petStopped: '已停止。', petEmptyReply: '这次没有收到回答。', petServiceError: 'AI 服务未能回答：',
    faqWhatQ: '张翼是什么？能帮我做什么？',
    faqWhatA: '张翼是一组装进 AI 助手的游戏设计陪练 skill，这个工作台是它的可视化入口。它帮你把想法整理成方案、审查会卡住制作的地方、派出制作任务并回收证据——判断和选择永远是你的。',
    faqTabsQ: '四个页签分别做什么？',
    faqTabsA: '01 立项：留下想法，回答当前路线需要的问题，看立项书草案；02 审方案：摆出已定内容、已知矛盾和制作风险，需要你拍板的地方才有按钮；03 做出来：下载制作任务包交给 AI 或开发者，做出后导入可玩证据；04 试玩与修订：按证据状态安排真人观察，导入场次记录，生成修订建议回 01/02 拍板。',
    faqAnswerAllQ: '要把所有问题都答完吗？',
    faqAnswerAllA: '不需要。题库约四十题，但工作台只问当前路线缺的关键题，每题都能回改。答到立项书草案能看、审方案页没有硬缺口，就够往下走了。',
    faqPackageQ: '项目包是什么？怎么保存？',
    faqPackageA: '项目包是一个 ZIP，里面有九份同源文件：项目记录、总览、开发交接、立项书草案、审查记录、审查任务、介入记录、制作任务包和试飞任务。点“保存项目包”存进你选的文件夹，或用浏览器下载。换浏览器或设备前记得先保存。',
    faqResumeQ: '隔天或换台电脑，怎么接着做？',
    faqResumeA: '从项目包解压出 zhangyi.project.json，回工作台点“导入工作台记录”就能继续。把开发交接.md 和这份 JSON 交给你的 AI 助手，它会承接已定内容，不会重复问、不擅自改。',
    faqBoundaryQ: '和你聊天会改动我的方案吗？',
    faqBoundaryA: '不会。聊天内容不进项目记录、不进项目包，我也不会替你点任何按钮。方案只在 01、02 页由你亲手确认才算数。',
    faqEvidenceQ: '证据等级是什么？为什么“AI 说做完了”不算？',
    faqEvidenceA: '证据分四级：构建通过、实际运行、从头玩通、真人试玩。等级只由可核对的记录提升——日志、文件、观察记录。“做完了”这句话没有可核对的形态，所以不算。真人试玩记录还要带样本来源、人数和观察方法，缺了会降级为自述。',
    faqAiReviewQ: '怎么让 AI 帮我审方案？',
    faqAiReviewA: '在 02 审方案下载《张翼审查任务.md》，连同项目记录交给装了张翼 skill 的 AI；它会返回一份结构化结果。你回到 02 导入，逐条看建议、理由和代价——点“采纳”才会改动决定。',
    mentorHeading: '林思雨给你一条下一步', mentorBoundary: '只按当前项目记录提示行动；她没有审过工程，也没有见过玩家。',
    'mentor.start': '先写一句你想让玩家做什么，或选一种已有材料。', 'mentor.start.action': '写下起点',
    'mentor.route': '起点已经留下。现在选一条最省力的起步路线。', 'mentor.route.action': '去选路线',
    'mentor.focus': '路线定了。把第一份作品收成一局能观察结果的内容。', 'mentor.focus.action': '去定首局',
    'mentor.questions': '还有 {count} 道当前路线的题要答；只处理会改变首局的缺口。', 'mentor.questions.action': '去补关键题',
    'mentor.toReview': '起步决定已够看草案了。去审方案，看看哪里会卡住制作。', 'mentor.toReview.action': '去审方案',
    'mentor.reviewGaps': '审方案页还有缺口或冲突。先看清原因，再决定要不要改。', 'mentor.reviewGaps.action': '看待处理项',
    'mentor.reviewAdvice': '张翼审查给了建议，但还没替你拍板。逐条看理由与代价。', 'mentor.reviewAdvice.action': '看审查建议',
    'mentor.reviewAI': '离线检查到这里。需要更深的判断，就把审查任务交给带张翼 skill 的 AI。', 'mentor.reviewAI.action': '下载审查任务',
    'mentor.toBuild': '方案记录已整理。下一步把它做成能跑的一局。', 'mentor.toBuild.action': '去做出来',
    'mentor.staleEvidence': '方案改过了。旧证据先标为需复核，再用新版重跑。', 'mentor.staleEvidence.action': '看旧证据',
    'mentor.buildTask': '先下载制作任务包，让开发者或 AI 做出第一局。', 'mentor.buildTask.action': '下载制作任务',
    'mentor.playThrough': '已有一些制作证据。下一步从头玩到结束，记录实际结果。', 'mentor.playThrough.action': '导入玩通证据',
    'mentor.playtest': '已经有玩通记录。找新玩家试一轮，记下样本来源、人数和观察方法。', 'mentor.playtest.action': '导入试玩证据',
    'mentor.revise': '已有试玩记录。回看方案与证据，挑一处最值得修的地方。', 'mentor.revise.action': '回审方案',
    'mentor.playtestNotReady': '试玩之前，先让游戏能跑起来。', 'mentor.playtestNotReady.action': '回 03 做出来',
    'mentor.staleSessions': '方案改过了。旧试玩场次先标需复核，再安排新一轮观察。', 'mentor.staleSessions.action': '看试玩记录板',
    'mentor.playtestTask': '证据够安排真人了。下载试飞任务，照它找人执行。', 'mentor.playtestTask.action': '下载试飞任务',
    'mentor.playtestRevise': '已有试玩场次。生成修订建议，回 01/02 逐条拍板。', 'mentor.playtestRevise.action': '看修订建议',
  },
  en: {
    language: 'Language', pageTitle: 'Zhangyi Studio · From idea to first playable round', languageNote: 'Genre pack content is currently available in Chinese only. Questions, drafts and exports are not translated.',
    mentorName: 'Lin Siyu · your assistant', mentorOpen: 'See the next step', mentorClose: 'Close the tip',
    petShow: 'Show Lin Siyu', petHide: 'Hide Lin Siyu', petModeAI: 'Local AI service available', petModeOffline: 'Offline project guidance',
    petNoteAI: 'When you send a message, your question and a short project summary go to the configured AI service. Replies are not proof that a build works or players enjoy it.',
    petNoteOffline: 'Offline guidance uses your project record and Studio controls. Lin Siyu has not inspected a build or observed players.',
    petGreeting: 'I’m here. Below are the questions people ask most — tap one and I’ll answer. You can also type your own.',
    petSummaryLead: 'Your idea:', petSummaryBoundary: 'This is what you recorded. I have not inspected a build or playtest.',
    petNoIdea: 'There is no idea recorded yet. Add one sentence on the first page, then I can point to a next step.',
    petPractice: 'In one sentence: what does the player do in the first round, and what visible result follows success or failure?',
    petEvidenceBoundary: 'No. I can read this Studio record, but I have not run your build or observed players. To judge whether the build works, run it and record evidence that someone else can check.',
    petOfflineFallback: 'No AI service is connected, so I cannot reliably answer open-ended questions. Try the frequent questions below. For a deeper judgment, take your project package to an AI with Zhangyi.',
    petThinking: 'Working on an answer…', petStopped: 'Stopped.', petEmptyReply: 'No answer came back.', petServiceError: 'The AI service could not answer:',
    faqWhatQ: 'What is Zhangyi? What can it do for me?',
    faqWhatA: 'Zhangyi is a set of game-design coaching skills inside your AI assistant; this Studio is its visual entry. It turns your idea into a plan, flags what could block production, hands out a build task and collects evidence — the judgment and choices stay yours.',
    faqTabsQ: 'What do the four tabs do?',
    faqTabsA: '01 Kickoff: record your starting point, answer the questions your route needs, read the draft. 02 Review: see what is decided, what conflicts, and what risks production — buttons appear only where your call is needed. 03 Build: download the build task for your AI or developer, then import playable evidence. 04 Playtest & revise: schedule real-player observation by evidence level, import session records, and generate revision suggestions to confirm back on pages 01/02.',
    faqAnswerAllQ: 'Do I have to answer every question?',
    faqAnswerAllA: 'No. The pool has about forty questions, but the Studio only asks what your current route is missing, and every answer can be changed. Once the draft reads well and the review page shows no hard gaps, you can move on.',
    faqPackageQ: 'What is the project package? How do I save it?',
    faqPackageA: 'It is a ZIP with nine matching files: the project record, overview, handoff, draft, review record, review task, intervention log, build task and playtest task. Use “Save project package” to store it in your chosen folder, or download it in the browser. Save before switching browsers or devices.',
    faqResumeQ: 'How do I continue another day or on another computer?',
    faqResumeA: 'Unzip the package, take zhangyi.project.json, and use “Import Studio record” here. Hand 开发交接.md and that JSON to your AI assistant — it will pick up what is settled without re-asking or changing things on its own.',
    faqBoundaryQ: 'Will chatting with you change my plan?',
    faqBoundaryA: 'No. Chat content never enters the project record or the package, and I never click anything for you. A plan only counts when you confirm it yourself on pages 01 and 02.',
    faqEvidenceQ: 'What are evidence levels? Why doesn’t “the AI said it’s done” count?',
    faqEvidenceA: 'Four levels: builds, runs, playable end-to-end, playtested by real people. Levels rise only through checkable records — logs, files, observation notes. “It’s done” has no checkable form, so it does not count. Playtest records also need sample source, size and method, or they are downgraded to self-report.',
    faqAiReviewQ: 'How do I get an AI to review my plan?',
    faqAiReviewA: 'On page 02, download 张翼审查任务.md and give it with your project record to an AI that has the Zhangyi skills. It returns a structured result; import it back on page 02, read each suggestion with its reason and cost — nothing changes until you click accept.',
    mentorHeading: 'One next step from Lin Siyu', mentorBoundary: 'Based on your project record only. She has not inspected the build or observed players.',
    'mentor.start': 'Start with one thing you want players to do, or choose what you already have.', 'mentor.start.action': 'Describe your starting point',
    'mentor.route': 'You have a starting point. Pick the route that gets you moving with the least extra work.', 'mentor.route.action': 'Choose a route',
    'mentor.focus': 'Your route is set. Narrow the first playable piece to one observable outcome.', 'mentor.focus.action': 'Set the first round',
    'mentor.questions': '{count} questions remain for this route. Answer only what could change the first round.', 'mentor.questions.action': 'Answer key questions',
    'mentor.toReview': 'You have enough to inspect the draft. Check what might block production.', 'mentor.toReview.action': 'Review the plan',
    'mentor.reviewGaps': 'The plan has open gaps or conflicts. Read the reasons before changing anything.', 'mentor.reviewGaps.action': 'See open issues',
    'mentor.reviewAdvice': 'Zhangyi offered suggestions; none are your decisions yet. Check each reason and cost.', 'mentor.reviewAdvice.action': 'Read the suggestions',
    'mentor.reviewAI': 'Offline checks stop here. For a deeper review, give the review task to an AI with Zhangyi.', 'mentor.reviewAI.action': 'Download review task',
    'mentor.toBuild': 'The plan is recorded. Next, make one round that actually runs.', 'mentor.toBuild.action': 'Go to build',
    'mentor.staleEvidence': 'The plan changed. Recheck earlier evidence against the current version.', 'mentor.staleEvidence.action': 'See earlier evidence',
    'mentor.buildTask': 'Download the build task and make a first playable round with your developer or AI.', 'mentor.buildTask.action': 'Download build task',
    'mentor.playThrough': 'You have some build evidence. Play from start to finish and record what happened.', 'mentor.playThrough.action': 'Import playthrough evidence',
    'mentor.playtest': 'A complete playthrough is recorded. Try it with a new player and record who, how many and how you observed them.', 'mentor.playtest.action': 'Import playtest evidence',
    'mentor.revise': 'A player test is recorded. Review the plan and evidence, then choose one change to make.', 'mentor.revise.action': 'Return to plan review',
    'mentor.playtestNotReady': 'Before any playtest, the game has to actually run.', 'mentor.playtestNotReady.action': 'Back to 03 Build',
    'mentor.staleSessions': 'The plan changed. Earlier sessions are flagged for review before you schedule another round.', 'mentor.staleSessions.action': 'See the session board',
    'mentor.playtestTask': 'There is enough evidence to involve real people. Download the playtest task and run it as written.', 'mentor.playtestTask.action': 'Download playtest task',
    'mentor.playtestRevise': 'Sessions are on record. Generate the revision suggestions and confirm them one by one on pages 01/02.', 'mentor.playtestRevise.action': 'See revision suggestions',
  },
};

const EN = {
  '林思雨': 'Lin Siyu', '助手林思雨': 'Lin Siyu, your assistant', '隐藏林思雨': 'Hide Lin Siyu', '显示林思雨': 'Show Lin Siyu',
  '点林思雨看下一步；双击打开对话；拖动可移动': 'Click Lin Siyu for the next step; double-click to chat; drag to move',
  '去做这一步': 'Go to this step', '和林思雨聊聊': 'Chat with Lin Siyu', '暂时隐藏': 'Hide for now',
  '你的助手 · 根据当前项目记录回答': 'Your assistant · answers from your project record', '关闭对话': 'Close chat',
  '形象大小': 'Character size', '小': 'Small', '中': 'Medium', '大': 'Large',
  '当前项目': 'Current project', '下一步': 'Next step', '设计练习': 'Design exercise',
  '离线时只回答当前项目记录与工作台操作；不会假装已审查工程或见过玩家。': 'Offline guidance uses your project record and Studio controls. Lin Siyu has not inspected a build or observed players.',
  '问林思雨': 'Ask Lin Siyu', '比如：我下一步该做什么？': 'For example: what should I do next?',
  '发送': 'Send', '停止': 'Stop',
  '张翼': 'Zhangyi', '语言': 'Language', '界面语言': 'Interface language', '制作阶段': 'Project stages',
  '已有材料': 'What you have', '项目状态': 'Project status',
  '整页反色、隐藏装饰与侧栏，适合长时间读草案与审查记录': 'Switch to a light reading layout for longer drafts and review records',
  '例如 C:\\项目\\我的游戏': 'For example: C:\\Projects\\MyGame',
  '例如：我很喜欢《文明6》，想做一个五代十国背景的版本。': 'For example: I love Civilization VI and want a version set in another historical era.',
  '例如：已有 Ren\'Py 工程；必须沿用当前项目目录。': 'For example: Existing Ren\'Py project; keep the current project folder.',
  '尚未判定品类；会先给通用首局候选。': 'No genre chosen yet. We will start with general first-round ideas.',
  '品类由你指定；改动它只会更新相关玩法候选，不会改变是否沿用工程。': 'You chose the genre. Changing it updates play suggestions, independently of your existing project.',
  '我喜欢一款游戏': 'I love a game', '想做一个类似的版本': 'I want to make something like it',
  '我想到一种玩法': 'I have a mechanic in mind', '知道玩家能做什么': 'I know what players would do',
  '我有故事或世界': 'I have a story or world', '先让它能被玩家参与': 'I want players to take part in it',
  '我只想做游戏': 'I want to make a game', '还没想好具体方向': 'I have not picked a direction yet',
  '我已有项目': 'I have a project already', '从企划或原型继续': 'Continue from a plan or prototype',
  '沿用现有工程做新游戏': 'Make a new game with my existing project',
  '先核实现有工程可用的部分，再重新决定玩家目标与内容。': 'Check what the existing project actually supports, then choose new player goals and content.',
  '先做原游戏模组': 'Make a mod for the original game',
  '沿用现成游戏的运行环境；先核实它支持怎样的模组。': 'Use the original game as a base. Check what kinds of mod it permits first.',
  '先做一局独立小样': 'Make one standalone playable round',
  '只重现一段关键体验，尽快得到能玩的短局。': 'Recreate one key experience and get a short round playable soon.',
  '先比较几个方向': 'Compare a few directions first',
  '先看玩家会做什么，再决定要做哪一版。': 'Look at what players would do before choosing a version to make.',
  '先修现有项目': 'Improve my current project',
  '从已有材料和最大问题继续，不重新立项。': 'Start from what exists and its biggest problem.',
  '张翼工作台首页': 'Zhangyi Studio home', '工作台': 'Studio', '主要导航': 'Main navigation',
  '使用说明': 'How to use', '裁决书档案馆': 'Decision archive', '正在整理的游戏': 'Current game',
  '阅读模式': 'Reading mode', '退出阅读模式': 'Exit reading mode', '保存在此浏览器': 'Saved in this browser',
  '本次浏览器无法读取旧记录': 'Could not read the saved project in this browser',
  '未能在浏览器保存，请下载项目包': 'Could not save here. Download your project package.',
  '制作阶段': 'Project stages', '01 立项': '01 Shape the idea', '02 审方案': '02 Review the plan',
  '03 做出来': '03 Build it',
  '从玩家的念头开始': 'Start with a player’s idea', '把想法，变成第一局。': 'Turn an idea into a first playable round.',
  '你可以只带来一款喜欢的游戏、一个玩法动作，或一个还没说清的愿望。先留下你已有的，下一步只处理最重要的选择。': 'Bring a game you love, one thing you want players to do, or a rough idea. Start with what you have; we will focus on the next decision.',
  '试填一个例子': 'Try an example', '备份并新建': 'Back up and start fresh',
  '项目保存位置': 'Where to save your project',
  '选一次文件夹，之后点“保存项目包”就直接存到这里。页面内的选择仍会照常保存在浏览器。': 'Choose a folder once. “Save project package” will then write there. Your choices also stay in this browser.',
  '选择本地文件夹': 'Choose a folder', '也可以粘贴文件夹路径': 'Or paste a folder path',
  '使用此路径': 'Use this path', '正在检查本地保存服务…': 'Checking the local save service…',
  '你现在手里有什么？': 'What are you starting with?', '可选多个。这里记录起点，不决定你以后只能走哪条路。': 'Choose any that apply. Your starting point does not lock in your route.',
  '已有材料': 'What you have', '用自己的话记下想法': 'Describe your idea in your own words',
  '可以留空，之后再补': 'Optional; you can add it later', '游戏品类': 'Game genre',
  '和有没有现成工程是两回事；暂时不确定也能继续': 'Independent of whether you have an existing project; you can decide later',
  '先不定，让张翼从想法中推测': 'Not sure yet — let Zhangyi infer it',
  '战棋或战术策略': 'Tactics or tactical strategy', '棋牌、赌局或心理博弈': 'Card, casino or mind games',
  '肉鸽或牌组构筑': 'Roguelike or deckbuilding', '银河恶魔城（能力门控探索）': 'Metroidvania (ability-gated exploration)',
  '视觉小说或叙事冒险（阅读推进与分支）': 'Visual novel or narrative adventure',
  '解谜（理解与推导为核心的谜题）': 'Puzzle (reasoning and discovery)', '派对或聚会游戏': 'Party game',
  '恐怖或微恐治愈': 'Horror or gentle horror', '塔防': 'Tower defense',
  '生存建造（资源压力与失败代价）': 'Survival crafting', '模拟器（扮演职业/系统角色、按流程作业）': 'Simulation (a role or job)',
  '增量挂机/放置（产能、自动化与重置）': 'Incremental or idle', '经营或养成': 'Management or raising sim',
  '其他或混合玩法': 'Other or hybrid', '表现风格': 'Presentation style',
  '只影响画面、文本与反馈，不改变玩法胜负': 'Changes visuals, writing and feedback; not the win rules',
  '先不定风格，或不做特定文化风格': 'Decide later / no specific cultural style',
  '古风（武侠、仙侠、国潮）': 'Chinese historical fantasy', '日式幻想／二次元': 'Japanese fantasy / anime',
  '西幻（中世纪奇幻、低魔与史诗）': 'Western fantasy', '赛博朋克（近未来、义体与巨型企业）': 'Cyberpunk',
  '蒸汽朋克与柴油朋克（维多利亚机械、两战之间）': 'Steampunk or dieselpunk',
  '治愈系／cozy（庇护感、日常仪式、低压力）': 'Cozy', '像素／复古（呈现技术纪律、可叠加任一题材）': 'Pixel / retro',
  '恐怖氛围（只管呈现与不安，不管玩法规则）': 'Horror atmosphere', '硬科幻／太空（只管呈现与技术可信，不管玩法规则）': 'Hard sci-fi / space',
  '已有工程或不能改的条件': 'Existing project or fixed constraints',
  '把已有引擎、项目位置等写在这里；交接文件会原样保留。': 'Note your engine, project location or other constraints. These carry into the handoff unchanged.',
  '保存这个起点': 'Save this starting point', '张翼先替你整理': 'Zhangyi’s first read',
  '这是一版可回改的起步判断，不把猜测当事实。': 'A starting assessment you can revise. Inferences are not treated as facts.',
  '你带来的线索：': 'Your clues: ', '张翼建议：': 'Zhangyi suggests: ', '还要核实：': 'Still to check: ',
  '第一步，想先做出什么？': 'What should we make first?', '路线以后可以改。工作台会保留你改动前的决定。': 'You can change routes later. Earlier decisions stay in the history.',
  '起步选项': 'Starting routes', '这里是工作台的预设路线，尚未针对你的游戏做 AI 评审。': 'These are preset routes. No AI has reviewed your game yet.',
  '起步路线': 'Starting route', '第一份作品，先试哪一件事？': 'What should the first playable piece test?',
  '把完整游戏压成一个能观察到结果的片段。': 'Narrow the full game to one piece with a visible outcome.',
  '第一份作品重点': 'First playable focus', '把方案补到下一步': 'Fill the gaps that matter next',
  '已定的内容直接带入。只回答会改变这份草案的缺口；这里是预设题库，尚无实时 AI 判断。': 'Confirmed choices carry over. Answer only the gaps that affect this draft. These are preset questions, not live AI judgments.',
  '展开更多可选题': 'Show more optional questions', '收起可选题': 'Hide optional questions',
  '已带入的决定': 'Decisions carried forward', '查看立项书草案': 'View concept draft',
  '立项书草案': 'Concept draft', '随答案更新': 'Updates with your answers',
  '项目状态': 'Project status', '正在形成的游戏': 'Your game in progress', '目前能确定什么': 'What we know so far',
  '先留下一个念头。哪怕只有一句“我想做这样的游戏”。': 'Start with one thought, even “I want to make a game like this.”',
  '还没选': 'Not chosen', '第一份作品': 'First playable piece', '已确认的设计决定': 'Confirmed design decisions',
  '还没有具体设计决定。': 'No design decisions yet.',
  '上游选择已改变。旧决定留着供你参考，但需要重新确认。': 'An earlier choice changed. Review the affected decisions before using them.',
  '目前已有的证据': 'Evidence so far',
  '只有你的想法与选择。小样尚未生成，也没有真人试玩结论。': 'Your idea and choices only. There is no playable build or player test yet.',
  '改动记录': 'Change history', '你的选择会留在这里。': 'Your choices will appear here.',
  '第二步 · 用现有记录审方案': 'Step 2 · Review the plan', '先找出会卡住制作的决定。': 'Find the decisions that could block production.',
  '这里把已定内容、冲突和首个可玩范围摆在一起。点击才会改动你的项目记录；页面检查不等于模型专业评审或真人试玩。': 'See confirmed choices, conflicts and the first playable scope together. Your record changes only when you choose. Page checks are neither an expert AI review nor a player test.',
  '已经定下的骨架': 'What is already set', '来自同一份项目记录；未定处直接标出。': 'From one project record. Open questions are marked.',
  '让张翼真正介入': 'Ask Zhangyi to review',
  '把项目包与审查任务交给带张翼 skill 的 AI，再把它给出的 JSON 结果导回这里。工作台本身仍是离线页面。': 'Give the project package and review task to an AI with the Zhangyi skill, then import its JSON response. The studio itself works offline.',
  '下载审查任务': 'Download review task', '导入张翼审查结果': 'Import Zhangyi review',
  '先处理的矛盾与缺口': 'Conflicts and gaps to address first', '只显示工作台能从结构化答案中检查到的项目。': 'Only issues the studio can detect from structured answers appear here.',
  '制作风险提示': 'Production risks', '根据已定方案推演，尚未通过实做或玩家验证。': 'Inferred from the plan; not tested in a build or with players.',
  '四桌主线，先打通哪一桌？': 'Four tables planned: which one first?', '这是制作顺序，不改变已定的首版四桌范围。': 'This sets the build order, not the approved four-table scope.',
  '方案审查记录': 'Plan review record', '随选择更新，并进入项目包。供下一次开发接力使用。': 'Updates with your choices and travels in the project package.',
  '此页实际查了什么': 'What this page checks',
  '问卷必要题是否已定、结构化答案的已知冲突、路线前置条件，以及被上游改动影响的旧决定；四桌主线项目另查首个可玩赌桌。': 'Required answers, known conflicts, route prerequisites and decisions affected by earlier changes. Four-table projects also choose the first table to build.',
  '还没查什么': 'What remains untested',
  '没有运行游戏、核查工程或模组支持、推算平衡或观察真人玩家。完成此页后，下一步仍需要制作和试玩证据。': 'This page does not run the game, inspect your project, check mod support, simulate balance or observe players. Building and playtesting are still needed.',
  '保存项目包': 'Save project package', '返回立项修改答案': 'Return to answers',
  '第三步 · 把方案做成能跑的一局': 'Step 3 · Build one playable round', '派活给你的 AI，证据说话。': 'Give your AI a build task. Bring back evidence.',
  '这里把工作台已审的方案整理成《制作任务包》，交给带张翼 skill 的 AI 或你自己去制作；做出后把可玩证据导回来。工作台离线，不生成游戏代码。': 'Turn the reviewed plan into a build task for your AI or yourself. Import evidence after it runs. This offline studio does not generate game code.',
  '制作任务包': 'Build task', '随方案更新，并进入项目包。未定的地方写"未定"，不会替你编造。': 'Updates with the plan and joins the project package. Open decisions stay open.',
  '下载制作任务包': 'Download build task', '导入可玩证据': 'Import playability evidence',
  '构建通过、实际运行、从头玩通、真人试玩是四级不同的证据。真人试玩记录必须带样本来源、样本量与口径，缺了会降级为自述。': 'A successful build, a running game, a complete playthrough and a player test are different evidence levels. Player tests need source, sample size and method; otherwise they count as self-report.',
  '导入证据 JSON': 'Import evidence JSON', '证据状态板': 'Evidence board', '未制作': 'No build yet', '还没有可玩证据。': 'No playability evidence yet.',
  '等级只能由证据提升："AI 说做完了"不算证据。方案改动后旧证据标为需复核。': 'Only evidence raises the level. “The AI says it is done” does not count. Changed plans flag earlier evidence for review.',
  '返回审方案': 'Back to plan review', '留给下一个自己，也留给下一个 AI': 'For your future self and your next AI',
  '把现在的决定带走': 'Take your decisions with you',
  '八份文件由同一份项目记录生成。没决定的地方会写“未定”，不会替你编造。': 'Eight files come from one project record. Open decisions are marked, not invented.',
  '九份文件由同一份项目记录生成。没决定的地方会写“未定”，不会替你编造。': 'Nine files come from one project record. Open decisions are marked, not invented.',
  '04 试玩与修订': '04 Playtest & revise',
  '第四步 · 让真人玩给你看': 'Step 4 · Let real people play it',
  '先看人玩，再决定改哪。': 'Watch people play first, then decide what to change.',
  '这里按当前证据状态给出该测什么：导出《试飞任务》去找真人执行，回来后导入场次记录，再生成《修订建议》带回 01/02 拍板。工作台不替你试玩，模拟的问答不算玩家声音。': 'This page routes what to test by your evidence level: export the playtest task, run it with real people, import session records, then generate revision suggestions to confirm back on pages 01/02. The Studio never playtests for you, and simulated Q&A is not a player voice.',
  '当前该测什么': 'What to test now',
  '按证据状态路由：能跑没玩通先首次观察；玩通了做体验走查；已有场次就核对修订。': 'Routed by evidence: runnable but not played through → first observation; played through → experience walkthrough; sessions recorded → revision check.',
  '下载试飞任务': 'Download playtest task',
  '导入试玩记录': 'Import playtest records',
  '场次级记录：日期、样本三要素（来源/人数/口径）、事实与结论分开填。缺三要素的场次降级为自述级；有结论没事实的场次会带警告。': 'Session-level records: date, sample triad (source/size/method), facts and conclusions kept separate. Sessions missing the triad degrade to self-report; conclusions without facts get flagged.',
  '导入记录 JSON': 'Import records JSON',
  '只整理，不落地：改动回 01 改答案或回 02 走审查，由你亲手确认。': 'Organized only, never applied: make changes back on page 01 or through review on 02, confirmed by you.',
  '下载修订建议': 'Download revision suggestions',
  '试玩记录板': 'Playtest session board',
  '还没有试玩记录。按试飞任务执行后，把记录 JSON 导回来。': 'No sessions yet. Run the playtest task, then import the records JSON.',
  '自述级场次可以留档，但不能支撑结论。林思雨的聊天与 AI 的模拟问答都不是玩家声音。': 'Self-report sessions stay on file but cannot support conclusions. Lin Siyu chat and AI-simulated Q&A are not player voices.',
  '返回做出来': 'Back to build',
  '首次观察': 'First observation', '体验走查': 'Experience walkthrough', '修订核对': 'Revision check',
  '还没到试飞节点：先回 03 做出来': 'Not at the playtest stage yet: go back to 03 Build first',
  '场次': 'session',
  '自述级：缺样本三要素': 'self-report: sample triad missing',
  ' · 有结论缺事实': ' · conclusions without facts',
  '已下载试飞任务。找真人执行后，回来导入场次记录。': 'Playtest task downloaded. Run it with real people, then import the session records.',
  '已下载修订建议。改动请回 01/02 页亲手确认。': 'Revision suggestions downloaded. Confirm changes yourself on pages 01/02.',
  '已导入试玩记录；设计决定未改动。缺三要素的场次已标自述级。': 'Playtest records imported; design decisions unchanged. Sessions missing the triad are marked self-report.',
  '浏览器下载': 'Download in browser', '导入工作台记录': 'Import project record',
  '—— 张翼 Spread the Pinions · 工作台预览': '— Zhangyi · Studio preview',
  '当前：': 'Now: ', '建议：': 'Suggestion: ', '采纳后的变化：': 'If accepted, what changes: ',
  '代价：': 'Cost: ', '怎么验证：': 'How to verify: ', '依据：': 'Basis: ',
  '需要重新确认': ' needs re-confirmation',
  ' · 需复核': ' · needs re-check', '（已确认）': ' (confirmed)', '旧决定：': 'Earlier decision: ',
  '。上游答案改变后，它暂时不能作为当前指令。': '. After the upstream answers changed, it is not the current instruction.',
  '输局要留损失，还是允许正式重试？': 'Keep the loss on defeat, or allow a formal retry?',
  '前一项说输局扣资格并带着押注损失继续；后一项说学到规则后重试。两者会写出不同的剧情和存档规则。': 'One option continues with the wager lost after a defeat; the other retries after the rule is learned. They write different story and save rules.',
  'A · 建议：正式输局留损失，继续故事': 'A · Suggested: keep the loss and continue the story',
  'B · 保留重试，撤回原输局扣资格': 'B · Keep retry and withdraw the original defeat',
  '构建通过': 'Build passed', '实际运行': 'Ran for real', '从头玩到结果': 'Played to an outcome', '真人试玩': 'Player test',
  ' · 缺样本三要素，降级为自述': ' · missing sample source, size and method; counted as self-report',
  ' · 方案已改，需复核': ' · plan changed; needs re-check',
  '建议': 'Recommended', '查看相关选择': 'View related choice', '修改': 'Edit',
  '先用预设建议，稍后再确认': 'Use the preset for now; confirm later',
  '已按预设建议暂拟，可点上方选项改定': 'Provisional preset; choose an option above to confirm',
  '还没有可预填的题目。': 'No questions to carry forward yet.',
  '还没有可玩证据。把任务包交给 AI 制作后，把证据导回来。': 'No playability evidence yet. Build the task, then import evidence here.',
  '先选一个想玩的方向': 'Choose a direction you want to play', '先查哪一个问题？': 'Which issue should we inspect first?',
  '这个项目先定哪一层？': 'What should this project settle first?',
  '每张都是短局草案；选定后再回答与它有关的问题。': 'Each card is a short playable idea. Choose one, then answer only its related questions.',
  '先诊断具体症状，别从零重做立项。': 'Name the specific problem before revisiting the whole concept.',
  '按你现在最需要明确的顺序推进，一次只定一层。': 'Settle the most useful layer first, one at a time.',
  '下一次观察怎么做': 'Plan the next observation', '把选中方向再收紧一点': 'Narrow the chosen direction',
  '先核实模组能不能做': 'Check whether a mod is possible first', '查看诊断草案': 'View diagnosis draft',
  '诊断重点': 'Diagnosis focus', '本地服务未连接。': 'Local save service is not connected.',
  '本地服务不支持直接保存。': 'The local service cannot save directly.', '本地保存服务未连接。': 'Local save service is not connected.',
  '本地保存失败。': 'Local save failed.', '起点没有变化。': 'No changes to your starting point.',
  '已保存。下面的起步选项已按你的材料更新。': 'Saved. The starting routes now reflect what you brought.',
  '先选一种手里的材料，或写下一句话。': 'Choose what you have, or write one sentence.',
  '入口还没保存；按“保存这个起点”继续。': 'Starting point not saved yet. Select “Save this starting point” to continue.',
  '想法有修改，保存后会检查旧决定。': 'Idea changed. Save to review affected decisions.',
  '品类有修改，保存后会更新首局候选。': 'Genre changed. Save to update the first-round suggestions.',
  '风格有修改，保存后会更新表现指导；它不改变玩法胜负。': 'Style changed. Save to update presentation guidance; win rules stay the same.',
  '条件有修改，保存后会检查旧决定。': 'Constraints changed. Save to review affected decisions.',
  '示例已填入。你可以直接改成自己的想法。': 'Example added. Replace it with your own idea.',
  '新项目已开始；旧记录已下载备份。': 'New project started. A backup of the previous record was downloaded.',
  '正在打开文件夹选择窗口…': 'Opening the folder picker…', '没有更改保存位置。': 'Save location unchanged.',
  '直接保存需要本地服务；当前可使用“浏览器下载”。': 'Direct saving needs the local service. Use “Download in browser” for now.',
  '还没选择文件夹。也可继续使用“浏览器下载”。': 'No folder chosen. You can still download in the browser.',
  '请先在页面顶部选择项目文件夹；也可点“浏览器下载”。': 'Choose a project folder above, or use “Download in browser”.',
  '已导入张翼审查。下面逐条显示建议；未点采纳前，游戏决定不会改变。': 'Zhangyi review imported. Suggestions appear below; nothing changes until you accept one.',
  '已下载审查任务。请连同最新项目包交给带张翼 skill 的 AI。': 'Review task downloaded. Give it and the latest project package to an AI with Zhangyi.',
  '已下载制作任务包。交给带张翼 skill 的 AI 制作，做完后回来导入证据。': 'Build task downloaded. Give it to an AI with Zhangyi, then import evidence after the build.',
  '已导入证据。证据状态板已更新；设计决定未改动。': 'Evidence imported. The evidence board is updated; design decisions are unchanged.',
  '尚未导入张翼审查': 'No Zhangyi review imported', '张翼本次判断': 'Zhangyi’s assessment',
  '采纳为我的决定': 'Accept as my decision', '暂缓这条': 'Defer this',
  '待你决定': 'Awaiting your decision', '你已采纳': 'Accepted', '已暂缓': 'Deferred', '项目改动后需重新审查': 'Review again after project changes',
  '项目记录': 'Project record', '张翼推演': 'Zhangyi inference', '外部线索，待核实': 'External clue; verify it',
  '返回立项查看': 'Return to the concept', '返回立项补题': 'Answer required questions',
  '当前规则检查没有其他待核对项': 'No other preset rule conflicts found',
  '路线还不能直接开工': 'The route is not ready to build yet',
  '目前没有预设的制作风险提示': 'No preset production risks found',
  '已选短局方向 · 规则待细化': 'Short-round direction chosen · rules need detail',
  '可安排首次玩家观察': 'Ready to plan a first player observation',
  '当前规则检查已处理完 · 可准备下一步': 'Preset rule checks done · prepare the next step',
  '还有待处理项 · 先核对': 'Open issues · review these first',
  '文件超过 2 MB，请检查是否选错。': 'This file is over 2 MB. Check that you selected the right file.',
  '审查结果超过 200 KB，请检查是否选错。': 'The review file is over 200 KB. Check the file you selected.',
  '证据文件超过 200 KB，请检查是否选错。': 'The evidence file is over 200 KB. Check the file you selected.',
  '未知游戏品类。': 'Unknown game genre.', '未知表现风格。': 'Unknown presentation style.',
  '未知的选择类型。': 'Unknown choice type.', '先确认起步路线，再选第一份作品的重点。': 'Choose a starting route before the first playable focus.',
  '这个选项与当前项目不匹配。': 'This option does not fit the current project.',
  '设计决定需要主题、结论和影响。': 'A design decision needs a topic, conclusion and consequence.',
  '这不是工作台支持的项目记录。': 'This project record is not supported by the studio.',
  '项目记录中的设计决定无效。': 'A design decision in this project record is invalid.',
  '项目记录中的张翼审查无效。': 'A Zhangyi review in this project record is invalid.',
  '项目记录中的可玩证据无效。': 'Playability evidence in this project record is invalid.',
  '项目记录含有未知入口。': 'This project record contains an unknown starting point.',
  '项目记录中的选择状态无效。': 'A choice status in this project record is invalid.',
  '当前路线与项目入口不匹配。': 'The selected route does not fit the project starting point.',
  '第一份作品的重点与起步路线不一致。': 'The first playable focus does not fit the starting route.',
  '这道题不适用于当前项目。': 'This question does not apply to this project.',
  '请选择题目提供的选项。': 'Choose one of the options provided for this question.',
  '这道题不能由预设建议代答。': 'This question needs your decision; the preset cannot answer it.',
  '审查结果与当前项目版本不一致；请用最新项目包重新审查。': 'This review belongs to a different project version. Review the latest package again.',
  '审查结果应有 1—8 条具体介入意见。': 'A review needs 1–8 concrete recommendations.',
  '介入意见缺少有效的依据类型。': 'A recommendation has no valid basis type.',
  '同一主题不能在一次审查中给出多条相互竞争的建议。': 'One review cannot give conflicting recommendations on the same topic.',
  '未知介入处理方式。': 'Unknown review action.', '这条建议已处理或已过期。': 'This recommendation was handled or is out of date.',
  '证据与当前项目版本不一致；请先保存最新项目包。': 'This evidence belongs to a different project version. Save the latest package first.',
  '证据应为 1—8 条记录。': 'Evidence must contain 1–8 records.',
  '当前项目无需选择首个赌桌。': 'This project does not need a first table choice.',
  '当前没有这项冲突。': 'This conflict is no longer present.',
  '页面上方的冲突提示来自离线规则；把项目包交给带张翼 skill 的 AI 审过，再把结果导回来。': 'The conflicts above come from offline rules. Ask an AI with Zhangyi to review the package, then import its result.',
  '这仅说明已知规则未再报出矛盾；可玩性仍须实际制作与试玩。': 'No more preset conflicts were found. You still need a build and a playtest.',
  '仍需在实际制作中检验方案。': 'The plan still needs to be tested in a real build.',
  '首局方向和复用意图已记下。接下来还需核查工程并由张翼审具体方案；可以先查看草案。': 'The first-round direction and reuse intent are recorded. Check the project and ask Zhangyi to review the plan. You can view the draft now.',
  '当前适用题已有答案。预设暂拟项仍需确认；可以先查看草案。': 'Applicable questions have answers. Confirm provisional presets later; you can view the draft now.',
  '第一项改动已选。先核实目标游戏允许怎样做模组；这里没有必须重答的通用题。': 'Your first change is chosen. Check what mods the target game allows; there are no more required general questions.',
  '你给出的线索足够安排下一次观察；这里没有必须重答的题。可以先查看草案和审方案。': 'You have enough clues to plan an observation. View the draft and review the plan next.',
};

let locale = 'zh-CN';
const originals = new WeakMap();
const attributeSources = new WeakMap();
function setLocale(value) { locale = value === 'en' ? 'en' : 'zh-CN'; return locale; }
function getLocale() { return locale; }
function t(key, values = {}) {
  const message = UI_MESSAGES[locale][key] ?? UI_MESSAGES['zh-CN'][key] ?? key;
  return message.replace(/\{([a-z]+)\}/g, (_, name) => String(values[name] ?? ''));
}

function uiText(value) {
  if (locale !== 'en' || typeof value !== 'string') return value;
  if (EN[value]) return EN[value];
  const patterns = [
    [/^当前保存位置：(.+)$/, ([, path]) => `Current save location: ${path}`],
    [/^（依据项目 v(\d+)）$/, ([, version]) => ` (basis: project v${version})`],
    [/^判断依据：(.+)$/, ([, detail]) => `Basis: ${detail}`],
    [/^从文字暂推：(.+)。如果不对，请在上方改选。$/, ([, genre]) => `Inferred from your idea: ${uiText(genre)}. Change it above if that is wrong.`],
    [/^张翼建议（(.+)）：(.+)。(.+)$/, ([, source, option, reason]) => `Zhangyi suggests (${source}): ${option}. ${reason}`],
    [/^第 (\d+) 条证据类型无效（只能 build \/ run \/ playthrough \/ playtest）。$/, ([, index]) => `Evidence record ${index} has an invalid type. Use build, run, playthrough or playtest.`],
    [/^第 (\d+) 条证据来源无效（只能 user \/ ai \/ log）。$/, ([, index]) => `Evidence record ${index} has an invalid source. Use user, ai or log.`],
    [/^已有 (\d+) 项确认决定；当前还有 (\d+) 项可补(?:，(\d+) 项预设暂拟)?。$/, ([, done, open, draft]) => `${done} confirmed decisions; ${open} questions to answer${draft ? `; ${draft} provisional presets` : ''}.`],
    [/^已带入 (\d+) 道题的答案，点开查看$/, ([, count]) => `${count} answers carried forward · expand to view`],
    [/^(\d+) 次$/, ([, count]) => `${count} changes`],
    [/^待核对：(.+)$/, ([, title]) => `Check: ${title}`],
    [/^必要题还有 (\d+) 项未定$/, ([, count]) => `${count} required questions remain`],
    [/^包括：(.+)。先补足会改变第一份作品的答案。$/, ([, topics]) => `Including: ${topics}. Answer these before the first playable build.`],
    [/^已交给浏览器下载项目包 v(\d+)；保存位置由浏览器决定。$/, ([, version]) => `Project package v${version} sent to your browser downloads.`],
    [/^已保存项目包 v(\d+)：(.+)$/, ([, version, path]) => `Project package v${version} saved: ${path}`],
    [/^已导入项目记录 v(\d+)。请检查当前路线和需复核项。$/, ([, version]) => `Project v${version} imported. Review the route and flagged decisions.`],
    [/^“(.+)”只作暂拟，尚非你确认的决定。$/, ([, topic]) => `“${topic}” is provisional, not a confirmed decision.`],
    [/^已记下“(.+)”。可随时在已带入的决定中查看。$/, ([, topic]) => `“${topic}” saved. You can review it among carried-forward decisions.`],
    [/^旧答案“(.+)”需复核，请重新选择。$/, ([, answer]) => `Review the earlier answer “${answer}” and choose again.`],
    [/^导入失败：(.+)$/, ([, error]) => `Import failed: ${uiText(error)}`],
    [/^导出失败：(.+)$/, ([, error]) => `Export failed: ${uiText(error)}`],
    [/^直接保存失败：(.+)。可用“浏览器下载”。$/, ([, error]) => `Direct save failed: ${uiText(error)}. Use browser download.`],
    [/^选择窗口未完成：(.+)。可在右侧粘贴文件夹路径。$/, ([, error]) => `Folder picker did not finish: ${uiText(error)}. Paste a path instead.`],
    [/^样本 (\d+) 人 · (.+)$/, ([, size, caliber]) => `Sample: ${size} people · ${uiText(caliber)}`],
    [/^目录未选定：(.+)$/, ([, error]) => `Folder not selected: ${uiText(error)}`],
  ];
  for (const [pattern, translate] of patterns) {
    const match = value.match(pattern);
    if (match) return translate(match);
  }
  return value;
}

function setUiText(element, value) {
  element.textContent = value;
  const node = element.firstChild;
  if (!node || node.nodeType !== 3) return;
  const rendered = uiText(value);
  node.nodeValue = rendered;
  originals.set(node, { source: value, rendered });
}

function translateUI(root = document) {
  if (!root?.createTreeWalker) return;
  const walker = root.createTreeWalker(root.body ?? root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('pre')) continue;
    const current = node.nodeValue;
    const previous = originals.get(node);
    const source = previous && previous.rendered === current ? previous.source : current;
    const trimmed = source.trim();
    const translated = uiText(trimmed);
    const rendered = translated === trimmed ? source : source.replace(trimmed, translated);
    if (current !== rendered) node.nodeValue = rendered;
    originals.set(node, { source, rendered });
  }
  for (const element of (root.body ?? root).querySelectorAll('[placeholder], [title], [aria-label]')) {
    const sources = attributeSources.get(element) ?? {};
    for (const attr of ['placeholder', 'title', 'aria-label']) {
      if (!element.hasAttribute(attr)) continue;
      if (element.id === 'mentor-toggle' && attr === 'aria-label') continue; // Set from t() as panel state changes.
      const current = element.getAttribute(attr);
      const source = sources[attr] ?? current;
      sources[attr] = source;
      element.setAttribute(attr, uiText(source));
    }
    attributeSources.set(element, sources);
  }
  document.documentElement.lang = locale;
}

// One grounded next step. This module never writes to the project record.
const EVIDENCE_RANK = { build: 1, run: 2, playthrough: 3, playtest: 4 };

function mentorSignal(project) {
  const accepted = [
    ...Object.entries(project.decisions ?? {})
      .filter(([, decision]) => decision?.status === 'accepted')
      .map(([topic, decision]) => `${topic}:${decision.value}`),
    ...(project.designDecisions ?? []).filter(item => item.status === 'accepted')
      .map(item => `${item.topic}:${item.label}`),
    ...(project.judgments ?? []).flatMap(review => (review.interventions ?? [])
      .filter(item => item.status === 'accepted')
      .map(item => `review:${item.topic}:${item.proposal}`)),
  ];
  const evidenceRank = Math.max(0, ...(project.evidence ?? [])
    .filter(item => item.status !== 'needs_review' && !item.degraded)
    .map(item => EVIDENCE_RANK[item.type] ?? 0));
  return { accepted, evidenceRank };
}

function mentorProgress(previous, current) {
  return current.evidenceRank > previous.evidenceRank
    || current.accepted.some(value => !previous.accepted.includes(value));
}

function mentorCue(project, stage, { openQuestions = 0, reviewReady = false } = {}) {
  if (stage === 'kickoff') {
    if (!project.input.idea?.trim() && !project.input.entries?.length)
      return { id: 'start', stage, target: 'idea' };
    if (project.decisions.route?.status !== 'accepted')
      return { id: 'route', stage, target: 'route-section' };
    if (project.decisions.focus?.status !== 'accepted')
      return { id: 'focus', stage, target: 'focus-section' };
    if (openQuestions > 0)
      return { id: 'questions', stage, target: 'questionnaire-section', count: openQuestions };
    return { id: 'toReview', stage: 'review', target: 'stage-review-button' };
  }
  if (stage === 'review') {
    if (!reviewReady) return { id: 'reviewGaps', stage, target: 'review-action-list' };
    const pending = (project.judgments ?? []).some(review => (review.interventions ?? [])
      .some(item => item.status === 'proposed'));
    if (pending) return { id: 'reviewAdvice', stage, target: 'ai-review-cards' };
    if (!(project.judgments ?? []).length)
      return { id: 'reviewAI', stage, target: 'download-review-task' };
    return { id: 'toBuild', stage: 'build', target: 'stage-build-button' };
  }
  if (stage === 'playtest') {
    const rank = mentorSignal(project).evidenceRank;
    const staleSession = (project.playtests ?? []).some(item => item.status === 'needs_review');
    if (staleSession) return { id: 'staleSessions', stage, target: 'playtest-list' };
    const hasSessions = (project.playtests ?? []).some(item => item.status === 'current');
    if (rank < 2 && !hasSessions) return { id: 'playtestNotReady', stage: 'build', target: 'stage-build-button' };
    if (!hasSessions) return { id: 'playtestTask', stage, target: 'download-playtest-task' };
    return { id: 'playtestRevise', stage, target: 'revision-preview' };
  }
  const stale = (project.evidence ?? []).some(item => item.status === 'needs_review');
  if (stale) return { id: 'staleEvidence', stage, target: 'evidence-list' };
  const rank = mentorSignal(project).evidenceRank;
  if (rank === 0) return { id: 'buildTask', stage, target: 'download-build-task' };
  if (rank < 3) return { id: 'playThrough', stage, target: 'import-evidence-button' };
  if (rank < 4) return { id: 'playtest', stage, target: 'import-evidence-button' };
  return { id: 'revise', stage: 'review', target: 'stage-review-button' };
}


const STORAGE_KEY = 'zhangyi.workbench.project.v1';
const STAGE_KEY = 'zhangyi.workbench.stage.v1';
const READ_KEY = 'zhangyi.workbench.readmode.v1';
const LOCALE_KEY = 'zhangyi.workbench.locale.v1';
const PET_VISIBLE_KEY = 'zhangyi.workbench.pet.visible.v1';
const PET_SIZE_KEY = 'zhangyi.workbench.pet.size.v1';
const PET_POSITION_KEY = 'zhangyi.workbench.pet.position.v1';
const PET_WELCOME_KEY = 'zhangyi.workbench.pet.welcome.v1';
const $ = id => document.getElementById(id);
let project = createProject();
let entryDraft = [];
let showDeep = false;
let editingQuestionIds = new Set();
let bridge = null;
let stage = 'kickoff';
let lastMentorSignal = null;
let currentMentorCue = null;
let mentorBubbleTimer = null;
let mentorIdleTimer = null;
let mentorChatAbort = null;
let mentorChatBusy = false;
let mentorAnimTimer = null;
let mentorPosition = null;
try { setLocale(localStorage.getItem(LOCALE_KEY)); } catch { setLocale('zh-CN'); }
document.title = t('pageTitle');

function selectStage(next) {
  stage = next;
  document.body.dataset.stage = next;
  try { localStorage.setItem(STAGE_KEY, next); } catch { /* 页面仍可切换 */ }
  $('kickoff-heading').hidden = next !== 'kickoff';
  $('kickoff-stage').hidden = next !== 'kickoff';
  $('review-stage').hidden = next !== 'review';
  $('build-stage').hidden = next !== 'build';
  $('playtest-stage').hidden = next !== 'playtest';
  $('stage-kickoff-button').setAttribute('aria-current', next === 'kickoff' ? 'step' : 'false');
  $('stage-review-button').setAttribute('aria-current', next === 'review' ? 'step' : 'false');
  $('stage-build-button').setAttribute('aria-current', next === 'build' ? 'step' : 'false');
  $('stage-playtest-button').setAttribute('aria-current', next === 'playtest' ? 'step' : 'false');
  if (next === 'review') renderReview();
  if (next === 'build') renderBuild();
  if (next === 'playtest') renderPlaytest();
  renderMentor();
  translateUI();
  document.querySelector('.stage-nav').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function reviewAction(title, detail, choices = []) {
  const box = document.createElement('div');
  box.className = 'review-action';
  const heading = document.createElement('h3');
  heading.textContent = title;
  const copy = document.createElement('p');
  copy.textContent = detail;
  box.append(heading, copy);
  for (const choice of choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = choice.primary ? 'primary-button' : 'secondary-button';
    button.textContent = choice.label;
    button.addEventListener('click', choice.run);
    box.append(button);
  }
  return box;
}

function renderAIReview() {
  const list = $('ai-review-cards');
  list.replaceChildren();
  const review = latestReview(project);
  if (!review) {
    list.append(reviewAction('尚未导入张翼审查', '页面上方的冲突提示来自离线规则；把项目包交给带张翼 skill 的 AI 审过，再把结果导回来。'));
    return;
  }
  list.append(reviewAction('张翼本次判断', `${review.summary}${uiText(`（依据项目 v${review.sourceVersion}）`)}`));
  for (const item of review.interventions) {
    const actions = item.status === 'proposed' ? [
      { label: '采纳为我的决定', primary: true, run: () => {
        try { project = resolveIntervention(project, item.id, 'accept'); persist(); render(); }
        catch (error) { text($('ai-review-message'), error.message); }
      } },
      { label: '暂缓这条', run: () => {
        try { project = resolveIntervention(project, item.id, 'defer'); persist(); render(); }
        catch (error) { text($('ai-review-message'), error.message); }
      } },
    ] : [];
    const state = { proposed: '待你决定', accepted: '你已采纳', deferred: '已暂缓', needs_review: '项目改动后需重新审查' }[item.status];
    const card = reviewAction(`${item.topic} · ${uiText(state)}`,
      `${uiText('当前：')}${item.current}。${uiText('建议：')}${item.proposal}。${item.reason}`, actions);
    const details = document.createElement('ul');
    for (const line of [`${uiText('采纳后的变化：')}${item.effect}`, `${uiText('代价：')}${item.cost}`, `${uiText('怎么验证：')}${item.verification}`,
      `${uiText('依据：')}${uiText({ record: '项目记录', inference: '张翼推演', external: '外部线索，待核实' }[item.basis])}；${item.basisDetail}`]) {
      const row = document.createElement('li');
      row.textContent = line;
      details.append(row);
    }
    card.append(details);
    list.append(card);
  }
}

function renderReview() {
  renderAIReview();
  const view = reviewSnapshot(project);
  const route = project.decisions.route?.value;
  text($('review-status'), route === 'compare' && view.routeGaps.length
    ? '已选短局方向 · 规则待细化'
    : route === 'improve' && view.ready ? '可安排首次玩家观察'
      : view.ready ? '当前规则检查已处理完 · 可准备下一步' : '还有待处理项 · 先核对');
  $('review-status').className = `review-status ${view.ready ? 'ready' : ''}`;
  const facts = $('review-facts');
  facts.replaceChildren();
  for (const [topic, value] of view.facts) {
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = topic;
    description.textContent = value;
    facts.append(term, description);
  }
  const list = $('review-action-list');
  list.replaceChildren();
  if (view.issues.some(item => item.id === 'loss-or-retry')) {
    list.append(reviewAction('输局要留损失，还是允许正式重试？',
      '前一项说输局扣资格并带着押注损失继续；后一项说学到规则后重试。两者会写出不同的剧情和存档规则。', [
        { label: 'A · 建议：正式输局留损失，继续故事', primary: true, run: () => {
          project = answerQuestion(project, 'failure_continue', 'cost'); persist(); render();
        } },
        { label: 'B · 保留重试，撤回原输局扣资格', run: () => {
          project = keepRetry(project); persist(); render();
        } },
      ]));
  }
  for (const item of view.needsReview) {
    list.append(reviewAction(`${item.topic}${uiText('需要重新确认')}`,
      `${uiText('旧决定：')}${item.label}${uiText('。上游答案改变后，它暂时不能作为当前指令。')}`, [
      { label: '返回立项查看', run: () => selectStage('kickoff') },
    ]));
  }
  if (view.missing.length) {
    list.append(reviewAction(`必要题还有 ${view.missing.length} 项未定`,
      `包括：${view.missing.slice(0, 5).map(item => item.topic).join('、')}${view.missing.length > 5 ? '等' : ''}。先补足会改变第一份作品的答案。`, [
        { label: '返回立项补题', run: () => { selectStage('kickoff'); $('questionnaire-section').scrollIntoView({ behavior: 'smooth' }); } },
      ]));
  }
  for (const gap of view.routeGaps) {
    list.append(reviewAction('路线还不能直接开工', gap));
  }
  if (!view.issues.length && !view.needsReview.length && !view.missing.length && !view.routeGaps.length && (!view.needsFirstTable || view.firstTable)) {
    list.append(reviewAction('当前规则检查没有其他待核对项', '这仅说明已知规则未再报出矛盾；可玩性仍须实际制作与试玩。'));
  }
  const advisories = $('review-advisories');
  advisories.replaceChildren();
  for (const item of view.advisories) {
    const card = reviewAction(item.title, item.detail);
    card.classList.add('advisory');
    const source = document.createElement('small');
    source.textContent = `判断依据：${item.source}`;
    card.append(source);
    advisories.append(card);
  }
  if (!view.advisories.length) advisories.append(reviewAction('目前没有预设的制作风险提示', '仍需在实际制作中检验方案。'));
  const tableChoices = $('first-table-choices');
  tableChoices.replaceChildren();
  $('first-table-section').hidden = !view.needsFirstTable;
  if (view.needsFirstTable) {
    FIRST_TABLES.forEach((item, index) => tableChoices.append(optionButton(item, index,
      view.firstTable?.reviewChoiceId === item.value || view.firstTable?.label === item.label,
      () => { project = chooseFirstTable(project, item.value); persist(); render(); }, 'choice')));
  }
  text($('review-document'), reviewDocument(project));
}

async function connectLocalSave() {
  try {
    const response = await fetch('/api/status', { cache: 'no-store' });
    if (!response.ok) throw new Error('本地服务未连接。');
    const info = await response.json();
    if (!info.directSave || !info.token) throw new Error('本地服务不支持直接保存。');
    bridge = info;
    renderMentor();
    $('choose-folder').disabled = false;
    $('use-folder-path').disabled = false;
    $('folder-path').disabled = false;
    $('folder-path').value = info.selectedDirectory ?? '';
    text($('folder-status'), info.selectedDirectory
      ? `当前保存位置：${info.selectedDirectory}` : '还没选择文件夹。也可继续使用“浏览器下载”。');
  } catch {
    bridge = null;
    renderMentor();
    $('choose-folder').disabled = true;
    $('use-folder-path').disabled = true;
    $('folder-path').disabled = true;
    text($('folder-status'), '直接保存需要本地服务；当前可使用“浏览器下载”。');
  }
}

async function localRequest(path, payload = {}, signal) {
  if (!bridge?.token) throw new Error('本地保存服务未连接。');
  const response = await fetch(path, { method: 'POST', headers: {
    'Content-Type': 'application/json', 'X-Zhangyi-Token': bridge.token,
  }, body: JSON.stringify(payload), signal });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || '本地保存失败。');
  return result;
}

function text(node, value) { setUiText(node, value); }
function renderMentor() {
  const openQuestions = project.decisions.focus?.status === 'accepted'
    ? questionnaireView(project, { deep: false }).filter(item => !item.accepted && !item.provisional).length : 0;
  currentMentorCue = mentorCue(project, stage, { openQuestions, reviewReady: reviewSnapshot(project).ready });
  text($('mentor-tip'), t(`mentor.${currentMentorCue.id}`, { count: currentMentorCue.count }));
  text($('mentor-action'), t(`mentor.${currentMentorCue.id}.action`));
  text($('mentor-toggle'), $('mentor-pet').hidden ? t('petShow') : t('petHide'));
  text($('mentor-chat-title'), t('mentorName'));
  text($('mentor-chat-mode'), bridge?.assistantAvailable ? t('petModeAI') : t('petModeOffline'));
  text($('mentor-chat-note'), bridge?.assistantAvailable ? t('petNoteAI') : t('petNoteOffline'));
  renderMentorFaq();
  if (!$('mentor-bubble').hidden) positionMentorBubble();
}

function mentorShowAnim(name) {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const target = reduced ? null : name;
  $('mentor-pet').classList.toggle('apng-on', Boolean(target));
  document.querySelectorAll('.mentor-apng').forEach(img => {
    const live = img.dataset.anim === target;
    img.classList.toggle('is-live', live);
    if (live) img.src = `assets/lin-siyu/${img.dataset.anim}.apng?r=${Date.now()}`;
    else img.removeAttribute('src');
  });
}
function mentorReact() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    showMentorBubble();
    return;
  }
  const pet = $('mentor-pet');
  pet.classList.add('is-reacting');
  mentorShowAnim('welcome');
  clearTimeout(mentorAnimTimer);
  mentorAnimTimer = setTimeout(() => {
    pet.classList.remove('is-reacting');
    mentorShowAnim('idle');
  }, 4200);
  showMentorBubble();
}
function loadStored() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) project = validateProject(JSON.parse(stored));
  } catch {
    text($('save-state'), '本次浏览器无法读取旧记录');
  }
  entryDraft = [...project.input.entries];
  lastMentorSignal = mentorSignal(project);
}

function persist() {
  const nextMentorSignal = mentorSignal(project);
  if (lastMentorSignal && mentorProgress(lastMentorSignal, nextMentorSignal)) mentorReact();
  lastMentorSignal = nextMentorSignal;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    text($('save-state'), '保存在此浏览器');
  } catch {
    text($('save-state'), '未能在浏览器保存，请下载项目包');
  }
}

function optionButton(item, index, selected, onClick, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-pressed', String(selected));
  const marker = document.createElement('span');
  marker.className = className === 'entry-chip' ? 'chip-icon' : 'choice-index';
  marker.textContent = className === 'entry-chip' ? (selected ? '◆' : '◇') : String.fromCharCode(65 + index);
  const copy = document.createElement('span');
  copy.className = className === 'entry-chip' ? 'chip-copy' : 'choice-copy';
  const title = document.createElement('strong');
  title.textContent = item.label;
  const description = document.createElement('small');
  description.textContent = item.detail ?? item.effect;
  copy.append(title, description);
  button.append(marker, copy);
  button.addEventListener('click', onClick);
  return button;
}

function renderEntries() {
  const grid = $('entry-grid');
  grid.replaceChildren();
  ENTRY_POINTS.forEach((item, index) => {
    grid.append(optionButton(item, index, entryDraft.includes(item.id), () => {
      entryDraft = entryDraft.includes(item.id)
        ? entryDraft.filter(id => id !== item.id) : [...entryDraft, item.id];
      renderEntries();
      text($('input-message'), '入口还没保存；按“保存这个起点”继续。');
    }, 'entry-chip'));
  });
}

function renderChoices(topic) {
  const target = $(topic === 'route' ? 'route-options' : 'focus-options');
  target.replaceChildren();
  const options = topic === 'route' ? routeOptions(project) : focusOptions(project);
  const decision = project.decisions[topic];
  options.forEach((item, index) => {
    const button = optionButton(item, index, decision?.value === item.id && decision.status === 'accepted', () => {
      project = choose(project, topic, item.id);
      persist();
      render();
    }, 'choice');
    if (item.recommended) {
      const badge = document.createElement('span');
      badge.className = 'recommend-badge';
      badge.textContent = '建议';
      button.append(badge);
    }
    target.append(button);
  });
}

function decisionLabel(decision) {
  if (!decision) return '还没选';
  return `${decision.label}${decision.status === 'needs_review' ? uiText(' · 需复核') : ''}`;
}

function renderLedger() {
  const list = $('history-list');
  list.replaceChildren();
  const events = [...project.history].reverse().slice(0, 8);
  text($('change-count'), `${project.history.length} 次`);
  if (!events.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-history';
    empty.textContent = '你的选择会留在这里。';
    list.append(empty);
    return;
  }
  for (const event of events) {
    const row = document.createElement('li');
    row.textContent = event.summary;
    list.append(row);
  }
}

function renderDesignDecisions() {
  const list = $('design-decisions');
  list.replaceChildren();
  const decisions = (project.designDecisions ?? []).filter(item => item.status === 'accepted');
  for (const item of decisions) {
    const row = document.createElement('li');
    row.textContent = `${item.topic}：${item.label}`;
    row.title = item.consequence;
    list.append(row);
  }
  if (!decisions.length) {
    const row = document.createElement('li');
    row.textContent = '还没有具体设计决定。';
    list.append(row);
  }
}

function renderQuestionnaire() {
  const ready = project.decisions.focus?.status === 'accepted';
  $('questionnaire-section').hidden = !ready;
  if (!ready) return;
  const questions = questionnaireView(project, { deep: showDeep });
  const covered = questions.filter(item => item.accepted);
  const missing = questions.filter(item => !item.accepted || editingQuestionIds.has(item.id));
  const savedTotal = (project.designDecisions ?? []).filter(item => item.status === 'accepted').length;
  const provisionalCount = questions.filter(item => item.provisional).length;
  text($('questionnaire-summary'), `已有 ${savedTotal} 项确认决定；当前还有 ${questions.filter(item => !item.accepted && !item.provisional).length} 项可补${provisionalCount ? `，${provisionalCount} 项预设暂拟` : ''}。`);
  const issues = reviewIssues(project);
  const issueList = $('review-issues');
  issueList.hidden = !issues.length;
  issueList.replaceChildren();
  for (const issue of issues) {
    const heading = document.createElement('strong');
    heading.textContent = `待核对：${issue.title}`;
    const detail = document.createElement('p');
    detail.textContent = issue.detail;
    const jump = document.createElement('button');
    jump.type = 'button';
    jump.className = 'text-button';
    jump.textContent = '查看相关选择';
    jump.addEventListener('click', () => {
      editingQuestionIds.add(issue.questionId);
      renderQuestionnaire();
      document.getElementById(`question-${issue.questionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    issueList.append(heading, detail, jump);
  }
  text($('accepted-summary'), `已带入 ${covered.length} 道题的答案，点开查看`);
  $('show-deep').setAttribute('aria-pressed', String(showDeep));
  text($('show-deep'), showDeep ? '收起可选题' : '展开更多可选题');
  const acceptedList = $('accepted-question-list');
  acceptedList.replaceChildren();
  for (const item of covered) {
    const row = document.createElement('li');
    const value = document.createElement('span');
    value.textContent = `${item.topic}：${item.accepted.label}（已确认）`;
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'inline-edit';
    edit.textContent = '修改';
    edit.addEventListener('click', () => {
      editingQuestionIds.add(item.id);
      renderQuestionnaire();
      document.getElementById(`question-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    row.append(value, edit);
    acceptedList.append(row);
  }
  if (!covered.length) {
    const row = document.createElement('li');
    row.textContent = '还没有可预填的题目。';
    acceptedList.append(row);
  }
  const list = $('question-list');
  list.replaceChildren();
  let lastGroup = '';
  for (const item of missing) {
    if (item.group !== lastGroup) {
      const heading = document.createElement('h3');
      heading.className = 'question-group';
      heading.textContent = item.group;
      list.append(heading);
      lastGroup = item.group;
    }
    const block = document.createElement('section');
    block.className = 'question-card';
    block.id = `question-${item.id}`;
    const title = document.createElement('h4');
    title.textContent = item.prompt;
    const why = document.createElement('p');
    why.textContent = item.why;
    const recommendation = document.createElement('p');
    recommendation.className = 'question-recommendation';
    const recommendedOption = item.options.find(option => option.value === item.recommendation.value);
    recommendation.textContent = `张翼建议（${item.recommendation.source}）：${recommendedOption?.label}。${item.recommendation.reason}`;
    const choices = document.createElement('div');
    choices.className = 'question-options';
    choices.setAttribute('role', 'group');
    choices.setAttribute('aria-label', item.prompt);
    item.options.forEach((option, index) => {
      const button = optionButton({ label: option.label, effect: option.effect }, index,
        (item.accepted ?? item.provisional)?.label === option.label, () => {
        try {
          project = answerQuestion(project, item.id, option.value);
          editingQuestionIds.delete(item.id);
          persist();
          render();
          text($('question-message'), `已记下“${item.topic}”。可随时在已带入的决定中查看。`);
        } catch (error) {
          text($('question-message'), error.message);
        }
      }, 'choice');
      if (option.value === item.recommendation.value) {
        const badge = document.createElement('span');
        badge.className = 'recommend-badge';
        badge.textContent = '建议';
        button.append(badge);
      }
      choices.append(button);
    });
    block.append(title, why, recommendation, choices);
    if (item.depth === 'deep' && !item.accepted) {
      const provisional = document.createElement('button');
      provisional.type = 'button';
      provisional.className = 'preset-button';
      provisional.textContent = item.provisional ? '已按预设建议暂拟，可点上方选项改定' : '先用预设建议，稍后再确认';
      provisional.disabled = Boolean(item.provisional);
      provisional.addEventListener('click', () => {
        try {
          project = usePresetRecommendation(project, item.id);
          persist();
          render();
          text($('question-message'), `“${item.topic}”只作暂拟，尚非你确认的决定。`);
        } catch (error) {
          text($('question-message'), error.message);
        }
      });
      block.append(provisional);
    }
    if (item.needsReview) {
      const warning = document.createElement('p');
      warning.className = 'question-review';
      warning.textContent = `旧答案“${item.needsReview.label}”需复核，请重新选择。`;
      block.append(warning);
    }
    list.append(block);
  }
  if (questions.every(item => item.accepted || item.provisional)) {
    const done = document.createElement('p');
    done.className = 'question-done';
    done.textContent = questions.length
      ? project.decisions.route?.value === 'new_game'
        ? '首局方向和复用意图已记下。接下来还需核查工程并由张翼审具体方案；可以先查看草案。'
        : '当前适用题已有答案。预设暂拟项仍需确认；可以先查看草案。'
      : project.decisions.route?.value === 'mod'
        ? '第一项改动已选。先核实目标游戏允许怎样做模组；这里没有必须重答的通用题。'
        : '你给出的线索足够安排下一次观察；这里没有必须重答的题。可以先查看草案和审方案。';
    list.append(done);
  }
  if (!$('draft-panel').hidden) text($('draft-preview'), kickoffDraft(project));
}

function renderBuild() {
  text($('task-preview'), buildTaskDocument(project));
  text($('evidence-status'), evidenceBoardLabel(project));
  text($('evidence-level-label'), evidenceBoardLabel(project));
  const list = $('evidence-list');
  list.replaceChildren();
  const records = [...(project.evidence ?? [])].reverse();
  for (const item of records) {
    const row = document.createElement('li');
    row.textContent = `[${uiText(EVIDENCE_TYPES[item.type])}] ${item.note}（${item.at}）`
      + `${item.degraded ? uiText(' · 缺样本三要素，降级为自述') : ''}${item.status === 'needs_review' ? uiText(' · 方案已改，需复核') : ''}`;
    list.append(row);
  }
  if (!records.length) {
    const row = document.createElement('li');
    row.textContent = '还没有可玩证据。把任务包交给 AI 制作后，把证据导回来。';
    list.append(row);
  }
}

function renderPlaytest() {
  const gear = playtestGear(project);
  text($('playtest-task-preview'), playtestTaskDocument(project));
  text($('revision-preview'), revisionDocument(project));
  text($('playtest-status'), gear
    ? `${uiText(PLAYTEST_GEARS[gear])}（${uiText(evidenceBoardLabel(project))}）`
    : uiText('还没到试飞节点：先回 03 做出来'));
  const list = $('playtest-list');
  list.replaceChildren();
  const sessions = [...(project.playtests ?? [])].reverse();
  for (const item of sessions) {
    const row = document.createElement('li');
    row.textContent = `${item.at} ${uiText('场次')} · `
      + (item.degraded ? uiText('自述级：缺样本三要素') : uiText(`样本 ${item.sample.size} 人 · ${item.sample.caliber}`))
      + `${item.unsupported ? uiText(' · 有结论缺事实') : ''}${item.status === 'needs_review' ? uiText(' · 方案已改，需复核') : ''}`;
    list.append(row);
  }
  if (!sessions.length) {
    const row = document.createElement('li');
    row.textContent = '还没有试玩记录。按试飞任务执行后，把记录 JSON 导回来。';
    list.append(row);
  }
}

function render() {
  entryDraft = [...project.input.entries];
  $('idea').value = project.input.idea;
  $('genre').value = project.input.genre ?? 'auto';
  document.body.dataset.genre = project.input.genre ?? 'auto';
  $('style').value = project.input.style ?? 'none';
  const profile = intakeProfile(project);
  const genreNames = Object.fromEntries(GENRE_OPTIONS.map(option => [option.id, option.label]));
  text($('genre-hint'), project.input.genre && project.input.genre !== 'auto'
    ? '品类由你指定；改动它只会更新相关玩法候选，不会改变是否沿用工程。'
    : profile.genre === 'unspecified' ? '尚未判定品类；会先给通用首局候选。'
      : `从文字暂推：${genreNames[profile.genre]}。如果不对，请在上方改选。`);
  $('constraints').value = project.input.constraints ?? '';
  const route = project.decisions.route?.value;
  const guidance = intakeGuidance(project);
  $('intake-guidance').hidden = !route || project.decisions.route?.status !== 'accepted';
  text($('intake-known'), guidance.known);
  text($('intake-suggestion'), guidance.suggestion);
  text($('intake-boundary'), guidance.boundary);
  text($('intake-basis'), `判断依据：${guidance.basis}`);
  $('focus-title').textContent = route === 'compare' ? '先选一个想玩的方向'
    : route === 'improve' ? '先查哪一个问题？'
      : route === 'new_game' ? '这个项目先定哪一层？' : '第一份作品，先试哪一件事？';
  $('focus-help').textContent = route === 'compare' ? '每张都是短局草案；选定后再回答与它有关的问题。'
    : route === 'improve' ? '先诊断具体症状，别从零重做立项。'
      : route === 'new_game' ? '按你现在最需要明确的顺序推进，一次只定一层。'
        : '把完整游戏压成一个能观察到结果的片段。';
  $('questionnaire-title').textContent = route === 'improve' ? '下一次观察怎么做'
    : route === 'compare' ? '把选中方向再收紧一点'
      : route === 'mod' ? '先核实模组能不能做' : '把方案补到下一步';
  $('show-draft').textContent = route === 'improve' ? '查看诊断草案' : '查看立项书草案';
  $('focus-preview').previousElementSibling.textContent = route === 'improve' ? '诊断重点' : '第一份作品';
  $('route-section').hidden = !project.input.idea && project.input.entries.length === 0;
  $('focus-section').hidden = !project.decisions.route || project.decisions.route.status !== 'accepted';
  renderEntries();
  renderChoices('route');
  renderChoices('focus');
  text($('version-tag'), `v${project.version}`);
  text($('idea-preview'), project.input.idea || '先留下一个念头。哪怕只有一句“我想做这样的游戏”。');
  text($('route-preview'), decisionLabel(project.decisions.route));
  text($('focus-preview'), decisionLabel(project.decisions.focus));
  $('review-warning').hidden = !Object.values(project.decisions).some(decision => decision?.status === 'needs_review');
  renderDesignDecisions();
  renderQuestionnaire();
  renderLedger();
  renderReview();
  renderBuild();
  renderPlaytest();
  renderMentor();
  translateUI();
}

function saveInput() {
  const idea = $('idea').value;
  const genre = $('genre').value;
  const style = $('style').value;
  const constraints = $('constraints').value;
  if (!idea.trim() && entryDraft.length === 0) {
    text($('input-message'), '先选一种手里的材料，或写下一句话。');
    return;
  }
  const oldVersion = project.version;
  project = setInput(project, idea, entryDraft, constraints, genre, style);
  persist();
  render();
  text($('input-message'), oldVersion === project.version ? '起点没有变化。' : '已保存。下面的起步选项已按你的材料更新。');
}

function download(data, filename, type) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadProject() {
  try {
    const files = [...exportFiles(project), { name: '立项书草案.md', type: 'text/markdown', content: kickoffDraft(project) },
      { name: '方案审查记录.md', type: 'text/markdown', content: reviewDocument(project) },
      { name: '张翼审查任务.md', type: 'text/markdown', content: reviewTaskDocument(project) },
      { name: '张翼介入记录.md', type: 'text/markdown', content: interventionDocument(project) },
      { name: '制作任务包.md', type: 'text/markdown', content: buildTaskDocument(project) },
      { name: '试飞任务.md', type: 'text/markdown', content: playtestTaskDocument(project) }];
    download(makeZip(files), `张翼项目包-v${project.version}.zip`, 'application/zip');
    text($('export-message'), `已交给浏览器下载项目包 v${project.version}；保存位置由浏览器决定。`);
  } catch (error) {
    text($('export-message'), `导出失败：${error.message}`);
  }
}

async function exportProject() {
  if (!bridge?.selectedDirectory) {
    text($('export-message'), '请先在页面顶部选择项目文件夹；也可点“浏览器下载”。');
    return;
  }
  try {
    const result = await localRequest('/api/save', { project });
    text($('export-message'), `已保存项目包 v${result.version}：${result.path}`);
  } catch (error) {
    text($('export-message'), `直接保存失败：${error.message}。可用“浏览器下载”。`);
  }
}

async function importProject(file) {
  if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error('文件超过 2 MB，请检查是否选错。');
    const incoming = validateProject(JSON.parse(await file.text()));
    project = incoming;
    lastMentorSignal = mentorSignal(project); // Import is not a new decision or evidence upgrade.
    persist();
    render();
    text($('export-message'), `已导入项目记录 v${project.version}。请检查当前路线和需复核项。`);
    text($('input-message'), '');
  } catch (error) {
    text($('export-message'), `导入失败：${error.message}`);
  }
  $('import-file').value = '';
}

async function importAIReview(file) {
  if (!file) return;
  try {
    if (file.size > 200_000) throw new Error('审查结果超过 200 KB，请检查是否选错。');
    project = importReview(project, JSON.parse(await file.text()));
    persist();
    render();
    text($('ai-review-message'), '已导入张翼审查。下面逐条显示建议；未点采纳前，游戏决定不会改变。');
  } catch (error) { text($('ai-review-message'), `导入失败：${error.message}`); }
  $('import-review-file').value = '';
}

$('locale-select').value = getLocale();
text($('language-boundary'), t('languageNote'));
$('locale-select').addEventListener('change', () => {
  setLocale($('locale-select').value);
  document.title = t('pageTitle');
  try { localStorage.setItem(LOCALE_KEY, getLocale()); } catch { /* 切换仍生效 */ }
  text($('language-boundary'), t('languageNote'));
  renderMentor();
  translateUI();
});
function petSetting(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function setMentorVisible(visible) {
  $('mentor-pet').hidden = !visible;
  document.body.classList.toggle('pet-visible', visible);
  $('mentor-toggle').setAttribute('aria-pressed', String(visible));
  text($('mentor-toggle'), visible ? t('petHide') : t('petShow'));
  if (!visible) { $('mentor-bubble').hidden = true; mentorShowAnim(null); }
  else mentorShowAnim('idle');
  try { localStorage.setItem(PET_VISIBLE_KEY, visible ? '1' : '0'); } catch { /* 仍可操作 */ }
}
function setMentorSize(size) {
  if (!['s', 'm', 'l'].includes(size)) size = 'm';
  $('mentor-pet').dataset.size = size;
  document.querySelectorAll('[data-mentor-size]').forEach(button =>
    button.setAttribute('aria-pressed', String(button.dataset.mentorSize === size)));
  try { localStorage.setItem(PET_SIZE_KEY, size); } catch { /* 仍可操作 */ }
  clampMentorPosition();
}
function clampMentorPosition() {
  if (!mentorPosition) return;
  const pet = $('mentor-pet');
  mentorPosition.x = Math.max(0, Math.min(mentorPosition.x, window.innerWidth - pet.offsetWidth));
  mentorPosition.y = Math.max(0, Math.min(mentorPosition.y, window.innerHeight - pet.offsetHeight));
  pet.style.left = `${mentorPosition.x}px`;
  pet.style.top = `${mentorPosition.y}px`;
  pet.style.right = 'auto';
  pet.style.bottom = 'auto';
  if (!$('mentor-bubble').hidden) positionMentorBubble();
}
function positionMentorBubble() {
  const bubble = $('mentor-bubble');
  const rect = $('mentor-sprite').getBoundingClientRect();
  const width = Math.min(300, window.innerWidth - 24);
  bubble.style.width = `${width}px`;
  const center = rect.left + rect.width / 2;
  const left = Math.max(12, Math.min(center - width / 2, window.innerWidth - width - 12));
  bubble.style.left = `${left}px`;
  const above = rect.top - bubble.offsetHeight - 14;
  const fitsAbove = above >= 12;
  bubble.style.top = fitsAbove
    ? `${above}px`
    : `${Math.min(rect.bottom + 14, window.innerHeight - bubble.offsetHeight - 12)}px`;
  bubble.dataset.tail = fitsAbove ? 'down' : 'up';
  bubble.style.setProperty('--tail-x', `${Math.max(22, Math.min(center - left, width - 22))}px`);
}
function showMentorBubble(autoHide = true) {
  if ($('mentor-pet').hidden || !$('mentor-chat').hidden) return;
  renderMentor();
  $('mentor-bubble').hidden = false;
  positionMentorBubble();
  clearTimeout(mentorBubbleTimer);
  if (autoHide) mentorBubbleTimer = setTimeout(() => { $('mentor-bubble').hidden = true; }, 11000);
}
function mentorMessage(body, sender = 'assistant') {
  const node = document.createElement('div');
  node.className = `mentor-chat-message ${sender}`;
  node.textContent = body;
  $('mentor-chat-history').append(node);
  $('mentor-chat-history').scrollTop = $('mentor-chat-history').scrollHeight;
  return node;
}
function openMentorChat() {
  clearTimeout(mentorBubbleTimer);
  $('mentor-bubble').hidden = true;
  $('mentor-chat').hidden = false;
  document.querySelector('.app-shell').inert = true;
  $('mentor-pet').inert = true;
  if (!$('mentor-chat-history').childElementCount) mentorMessage(t('petGreeting'));
  renderMentor();
  $('mentor-chat-input').focus();
}
function closeMentorChat() {
  mentorChatAbort?.abort();
  $('mentor-chat').hidden = true;
  document.querySelector('.app-shell').inert = false;
  $('mentor-pet').inert = false;
  $('mentor-sprite').focus();
}
function mentorOfflineReply(question) {
  const q = question.toLowerCase();
  if (/工程|玩过|玩家|证据|构建|审查|build|playtest|tested|reviewed/.test(q)) return t('petEvidenceBoundary');
  if (/项目|想法|概要|summary|idea|project/.test(q)) {
    const idea = project.input.idea?.trim();
    return idea ? `${t('petSummaryLead')} ${idea}\n${t('petSummaryBoundary')}` : t('petNoIdea');
  }
  if (/下一步|接下来|怎么做|next|help|继续/.test(q))
    return t(`mentor.${currentMentorCue.id}`, { count: currentMentorCue.count });
  if (/练习|挑战|问题|practice|exercise/.test(q)) return t('petPractice');
  return t('petOfflineFallback');
}
async function sendMentorChat(question) {
  if (mentorChatBusy || !question.trim()) return;
  const message = question.trim().slice(0, 2000);
  mentorMessage(message, 'user');
  $('mentor-chat-input').value = '';
  const reply = mentorMessage(t('petThinking'));
  if (!bridge?.assistantAvailable) { reply.textContent = mentorOfflineReply(message); return; }
  mentorChatBusy = true;
  mentorChatAbort = new AbortController();
  $('mentor-chat-send').disabled = true;
  $('mentor-chat-stop').hidden = false;
  if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    mentorShowAnim('thinking');
  }
  try {
    const response = await fetch('/api/assistant', { method: 'POST', headers: {
      'Content-Type': 'application/json', 'X-Zhangyi-Token': bridge.token,
    }, body: JSON.stringify({ stream: true, question: message, context: {
      idea: project.input.idea?.slice(0, 1200) || '', stage,
      route: project.decisions.route?.value || '', focus: project.decisions.focus?.value || '',
      next: t(`mentor.${currentMentorCue.id}`, { count: currentMentorCue.count }),
    } }), signal: mentorChatAbort.signal });
    if (!response.ok) {
      const problem = await response.json().catch(() => ({}));
      throw new Error(problem.error || `HTTP ${response.status}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let answer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      answer += decoder.decode(value, { stream: true });
      reply.textContent = answer;
      $('mentor-chat-history').scrollTop = $('mentor-chat-history').scrollHeight;
    }
    reply.textContent = answer.trim() || t('petEmptyReply');
  } catch (error) {
    reply.textContent = error.name === 'AbortError' ? t('petStopped') : `${t('petServiceError')} ${error.message}`;
  } finally {
    mentorChatBusy = false;
    mentorChatAbort = null;
    $('mentor-chat-send').disabled = false;
    $('mentor-chat-stop').hidden = true;
    mentorShowAnim('idle');
  }
}
$('mentor-toggle').addEventListener('click', () => setMentorVisible($('mentor-pet').hidden));
$('mentor-hide').addEventListener('click', () => setMentorVisible(false));
$('mentor-chat-open').addEventListener('click', openMentorChat);
$('mentor-chat-close').addEventListener('click', closeMentorChat);
$('mentor-chat').addEventListener('click', event => { if (event.target === $('mentor-chat')) closeMentorChat(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('mentor-chat').hidden) closeMentorChat(); });
document.querySelectorAll('[data-mentor-size]').forEach(button => button.addEventListener('click', () => setMentorSize(button.dataset.mentorSize)));
const MENTOR_FAQ = ['faqWhat', 'faqTabs', 'faqAnswerAll', 'faqPackage', 'faqResume', 'faqBoundary', 'faqEvidence', 'faqAiReview'];
function renderMentorFaq() {
  const box = $('mentor-chat-presets');
  box.textContent = '';
  for (const id of MENTOR_FAQ) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.mentorFaq = id;
    setUiText(button, t(`${id}Q`));
    box.append(button);
  }
}
document.querySelector('.mentor-chat-presets').addEventListener('click', event => {
  const id = event.target.dataset?.mentorFaq;
  if (!id) return;
  mentorMessage(t(`${id}Q`), 'user');
  mentorMessage(t(`${id}A`));
});
$('mentor-chat-send').addEventListener('click', () => sendMentorChat($('mentor-chat-input').value));
$('mentor-chat-input').addEventListener('keydown', event => { if (event.key === 'Enter') sendMentorChat(event.currentTarget.value); });
$('mentor-chat-stop').addEventListener('click', () => mentorChatAbort?.abort());
let petDrag = null;
let petWasDragged = false;
$('mentor-sprite').addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  const rect = $('mentor-pet').getBoundingClientRect();
  petDrag = { id: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top, startX: event.clientX, startY: event.clientY };
  petWasDragged = false;
  $('mentor-sprite').setPointerCapture(event.pointerId);
});
$('mentor-sprite').addEventListener('pointermove', event => {
  if (!petDrag || petDrag.id !== event.pointerId) return;
  if (Math.hypot(event.clientX - petDrag.startX, event.clientY - petDrag.startY) > 5) petWasDragged = true;
  if (!petWasDragged) return;
  mentorPosition = { x: event.clientX - petDrag.dx, y: event.clientY - petDrag.dy };
  clampMentorPosition();
});
$('mentor-sprite').addEventListener('pointerup', event => {
  if (!petDrag || petDrag.id !== event.pointerId) return;
  petDrag = null;
  if (petWasDragged) {
    try { localStorage.setItem(PET_POSITION_KEY, JSON.stringify(mentorPosition)); } catch { /* 仍可拖动 */ }
  }
});
$('mentor-sprite').addEventListener('click', () => { if (!petWasDragged) showMentorBubble(); petWasDragged = false; });
$('mentor-sprite').addEventListener('dblclick', openMentorChat);
$('mentor-sprite').addEventListener('keydown', event => {
  if (!event.altKey || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault();
  const rect = $('mentor-pet').getBoundingClientRect();
  mentorPosition = { x: rect.left + (event.key === 'ArrowRight' ? 24 : event.key === 'ArrowLeft' ? -24 : 0),
    y: rect.top + (event.key === 'ArrowDown' ? 24 : event.key === 'ArrowUp' ? -24 : 0) };
  clampMentorPosition();
  try { localStorage.setItem(PET_POSITION_KEY, JSON.stringify(mentorPosition)); } catch { /* 仍可移动 */ }
});
window.addEventListener('resize', clampMentorPosition);
$('mentor-action').addEventListener('click', () => {
  if (!currentMentorCue) return;
  const cue = currentMentorCue;
  if (cue.stage !== stage) selectStage(cue.stage);
  const target = $(cue.target);
  if (['reviewAI', 'buildTask', 'playThrough', 'playtest', 'playtestTask'].includes(cue.id)) target?.click();
  else { target?.scrollIntoView({ behavior: 'smooth', block: 'center' }); target?.focus?.({ preventScroll: true }); }
  $('mentor-bubble').hidden = true;
});
loadStored();
try { const saved = JSON.parse(petSetting(PET_POSITION_KEY, 'null')); if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) mentorPosition = saved; } catch { /* 默认位置 */ }
setMentorVisible(petSetting(PET_VISIBLE_KEY, '1') !== '0');
setMentorSize(petSetting(PET_SIZE_KEY, 'm'));
render();
connectLocalSave();
const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
if (!$('mentor-pet').hidden && !motionPreference?.matches) {
  try {
    if (!sessionStorage.getItem(PET_WELCOME_KEY)) {
      sessionStorage.setItem(PET_WELCOME_KEY, '1');
      mentorReact();
    }
  } catch { /* 无 sessionStorage 也保持待机 */ }
}
motionPreference?.addEventListener?.('change', event => {
  $('mentor-pet').classList.remove('is-reacting');
  mentorShowAnim(event.matches ? null : 'idle');
});
function scheduleMentorIdle() {
  clearTimeout(mentorIdleTimer);
  mentorIdleTimer = setTimeout(() => {
    if (!$('mentor-pet').hidden && $('mentor-chat').hidden && $('mentor-bubble').hidden) showMentorBubble();
    scheduleMentorIdle();
  }, 240000);
}
scheduleMentorIdle();
function applyReadMode(on) {
  document.body.classList.toggle('reading', on);
  const toggle = $('read-mode-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    text(toggle, on ? '退出阅读模式' : '阅读模式');
  }
  try { localStorage.setItem(READ_KEY, on ? '1' : '0'); } catch { /* 页面仍可切换 */ }
}

document.body.dataset.stage = stage;
try {
  const storedStage = localStorage.getItem(STAGE_KEY);
  if (['review', 'build', 'playtest'].includes(storedStage)) selectStage(storedStage);
  if (localStorage.getItem(READ_KEY) === '1') applyReadMode(true);
} catch { /* 默认立项、默认非阅读模式 */ }
$('read-mode-toggle').addEventListener('click', () => applyReadMode(!document.body.classList.contains('reading')));
$('save-input').addEventListener('click', saveInput);
$('idea').addEventListener('input', () => text($('input-message'), '想法有修改，保存后会检查旧决定。'));
$('genre').addEventListener('change', () => {
  document.body.dataset.genre = $('genre').value;
  text($('input-message'), '品类有修改，保存后会更新首局候选。');
});
$('style').addEventListener('change', () => text($('input-message'), '风格有修改，保存后会更新表现指导；它不改变玩法胜负。'));
$('constraints').addEventListener('input', () => text($('input-message'), '条件有修改，保存后会检查旧决定。'));
$('load-example').addEventListener('click', () => {
  project = setInput(project, '我很喜欢《文明6》，想做一个五代十国背景的版本。', ['reference']);
  persist();
  render();
  text($('input-message'), '示例已填入。你可以直接改成自己的想法。');
});
$('new-project').addEventListener('click', () => {
  if (project.history.length) {
    download(makeZip(exportFiles(project)), `张翼旧项目备份-v${project.version}.zip`, 'application/zip');
  }
  project = createProject();
  persist();
  render();
  text($('input-message'), '新项目已开始；旧记录已下载备份。');
});
$('export-all').addEventListener('click', exportProject);
$('export-all-aside').addEventListener('click', exportProject);
$('browser-download').addEventListener('click', downloadProject);
$('choose-folder').addEventListener('click', async () => {
  text($('folder-status'), '正在打开文件夹选择窗口…');
  try {
    const result = await localRequest('/api/select-directory');
    if (result.selectedDirectory) {
      bridge.selectedDirectory = result.selectedDirectory;
      $('folder-path').value = result.selectedDirectory;
      text($('folder-status'), `当前保存位置：${result.selectedDirectory}`);
    } else text($('folder-status'), '没有更改保存位置。');
  } catch (error) {
    text($('folder-status'), `选择窗口未完成：${error.message}。可在右侧粘贴文件夹路径。`);
  }
});
$('use-folder-path').addEventListener('click', async () => {
  try {
    const result = await localRequest('/api/use-directory', { path: $('folder-path').value });
    bridge.selectedDirectory = result.selectedDirectory;
    text($('folder-status'), `当前保存位置：${result.selectedDirectory}`);
  } catch (error) {
    text($('folder-status'), `目录未选定：${error.message}`);
  }
});
$('show-deep').addEventListener('click', () => {
  showDeep = !showDeep;
  renderQuestionnaire();
});
$('show-draft').addEventListener('click', () => {
  $('draft-panel').hidden = false;
  text($('draft-preview'), kickoffDraft(project));
  $('draft-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
$('import-button').addEventListener('click', () => $('import-file').click());
$('import-file').addEventListener('change', event => importProject(event.target.files[0]));
$('download-review-task').addEventListener('click', () => {
  download(reviewTaskDocument(project), `张翼审查任务-v${project.version}.md`, 'text/markdown');
  text($('ai-review-message'), '已下载审查任务。请连同最新项目包交给带张翼 skill 的 AI。');
});
$('import-review-button').addEventListener('click', () => $('import-review-file').click());
$('import-review-file').addEventListener('change', event => importAIReview(event.target.files[0]));
$('stage-kickoff-button').addEventListener('click', () => selectStage('kickoff'));
$('stage-review-button').addEventListener('click', () => selectStage('review'));
$('stage-build-button').addEventListener('click', () => selectStage('build'));
$('stage-playtest-button').addEventListener('click', () => selectStage('playtest'));
$('back-to-kickoff').addEventListener('click', () => selectStage('kickoff'));
$('back-to-review').addEventListener('click', () => selectStage('review'));
$('back-to-build').addEventListener('click', () => selectStage('build'));
$('download-playtest-task').addEventListener('click', () => {
  download(playtestTaskDocument(project), `试飞任务-v${project.version}.md`, 'text/markdown');
  text($('playtest-message'), '已下载试飞任务。找真人执行后，回来导入场次记录。');
});
$('download-revision').addEventListener('click', () => {
  download(revisionDocument(project), `修订建议-v${project.version}.md`, 'text/markdown');
  text($('playtest-message'), '已下载修订建议。改动请回 01/02 页亲手确认。');
});
$('import-playtest-button').addEventListener('click', () => $('import-playtest-file').click());
$('import-playtest-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 200_000) throw new Error('记录文件超过 200 KB，请检查是否选错。');
    project = importPlaytests(project, JSON.parse(await file.text()));
    persist();
    render();
    text($('playtest-message'), '已导入试玩记录；设计决定未改动。缺三要素的场次已标自述级。');
  } catch (error) { text($('playtest-message'), `导入失败：${error.message}`); }
  $('import-playtest-file').value = '';
});
$('download-build-task').addEventListener('click', () => {
  download(buildTaskDocument(project), `制作任务包-v${project.version}.md`, 'text/markdown');
  text($('evidence-message'), '已下载制作任务包。交给带张翼 skill 的 AI 制作，做完后回来导入证据。');
});
$('import-evidence-button').addEventListener('click', () => $('import-evidence-file').click());
$('import-evidence-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 200_000) throw new Error('证据文件超过 200 KB，请检查是否选错。');
    project = importEvidence(project, JSON.parse(await file.text()));
    persist();
    render();
    text($('evidence-message'), '已导入证据。证据状态板已更新；设计决定未改动。');
  } catch (error) { text($('evidence-message'), `导入失败：${error.message}`); }
  $('import-evidence-file').value = '';
});

})();
