import { genrePackTopics, inferGenreFromIdea } from './content-packs.mjs';

export const ENTRY_POINTS = [
  { id: 'reference', label: '我喜欢一款游戏', detail: '想做一个类似的版本' },
  { id: 'mechanic', label: '我想到一种玩法', detail: '知道玩家能做什么' },
  { id: 'story', label: '我有故事或世界', detail: '先让它能被玩家参与' },
  { id: 'wish', label: '我只想做游戏', detail: '还没想好具体方向' },
  { id: 'existing', label: '我已有项目', detail: '从企划或原型继续' },
];

export const GENRE_OPTIONS = [
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

export const STYLE_OPTIONS = [
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

export function intakeProfile(state) {
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

export function intakeGuidance(state) {
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

export function createProject() {
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

export function routeOptions(state) {
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

export function focusOptions(state) {
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

export function setInput(project, idea, entries, constraints = '', genre = project.input.genre ?? 'auto', style = project.input.style ?? 'none') {
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

export function choose(project, topic, value) {
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

export function recordDesignDecision(project, topic, label, consequence, actor = 'user') {
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

export function validateProject(value) {
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

export function projectOverview(state) {
  const route = state.decisions.route;
  const focus = state.decisions.focus;
  return `# 项目总览\n\n> 项目记录 v${state.version} · 生成于 ${timestamp()} · 来源：zhangyi.project.json\n\n## 用户的原话\n\n${quote(state.input.idea || '尚未填写。')}\n\n## 已给出的条件\n\n${quote(state.input.constraints || '尚未单独记录。')}\n\n## 现在确定了什么\n\n${facts(state)}\n\n## 已确认的设计决定\n\n${designLines(state)}\n\n## 这会怎样影响第一份作品\n\n- 起步路线：${current(route) ? route.effect : '路线尚未确认，不能据此开工。'}\n- 第一份作品重点：${current(focus) ? focus.effect : '重点尚未确认；已有旧选择时需复核。'}\n\n## 证据与产物\n\n- 可玩小样：尚未生成或运行。\n- 真人试玩：尚无记录。\n- 正式裁决书：尚未形成。\n\n## 待决定\n\n${!current(route) ? '- 确认起步路线。\n' : ''}${!current(focus) ? '- 确认第一份作品重点。\n' : ''}- 制作前核实尚未明确的结束条件与目标环境；已给出的条件沿用。\n\n—— 张翼 Spread the Pinions · 项目总览 v${state.version}\n`;
}

export function handoffDocument(state) {
  const route = state.decisions.route;
  const focus = state.decisions.focus;
  return `# 张翼开发交接\n\n> 项目记录 v${state.version} · 生成于 ${timestamp()} · 来源：zhangyi.project.json\n\n## 接手前先读\n\n${facts(state)}\n\n用户原话：\n\n${quote(state.input.idea || '尚未填写。')}\n\n用户已给出的条件：\n\n${quote(state.input.constraints || '尚未单独记录。')}\n\n## 可以依此推进的决定\n\n${current(route) ? `- ${route.id}：${route.label}。${route.effect}\n` : '- 起步路线尚未确认。\n'}${current(focus) ? `- ${focus.id}：${focus.label}。${focus.effect}\n` : '- 第一份作品重点尚未确认。\n'}${designLines(state)}\n\n## 不能擅自补成事实\n\n- “需复核”的旧选择不是当前指令；详见结构化项目记录的 history。\n- 已给出的引擎、目录和素材条件不得改写；未给出的胜负条件、数值、美术范围与发布时间仍需决定。\n- 尚无本次新游戏的运行证据或真人反馈，不要声称新游戏已经可玩或玩法已经好玩。\n\n## 下一步交付与验收\n\n${current(route) && current(focus) ? '- 围绕已选路线和重点，给一版能让用户反应的草案；只提下一道会改变玩家体验的选择题。' : '- 先让用户确认标为未定或需复核的方向，不要据旧选择开发。'}\n- 若用户要求可玩物，制作后实际检查输入、结果、结束与重开，并回写运行证据。\n- 每项新决定写回项目记录，更新版本，再生成文档。\n\n—— 张翼 Spread the Pinions · 开发交接 v${state.version}\n`;
}

export function exportFiles(state) {
  const valid = validateProject(state);
  return [
    { name: 'zhangyi.project.json', type: 'application/json', content: `${JSON.stringify(valid, null, 2)}\n` },
    { name: '项目总览.md', type: 'text/markdown', content: projectOverview(valid) },
    { name: '开发交接.md', type: 'text/markdown', content: handoffDocument(valid) },
  ];
}
