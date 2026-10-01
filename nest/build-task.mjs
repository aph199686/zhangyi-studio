import { intakeProfile, intakeGuidance, validateProject } from './workbench-core.mjs';
import { genrePackPlan, enginePackPlan, activeGenrePack } from './content-packs.mjs';

// 03 做出来：制作任务包与可玩证据回挂。工作台离线，不在线生成游戏；
// 证据分级写死：构建通过 ≠ 运行通过 ≠ 玩通 ≠ 真人试玩。
export const EVIDENCE_TYPES = { build: '构建通过', run: '实际运行', playthrough: '从头玩到结果', playtest: '真人试玩' };
const LEVEL_ORDER = ['build', 'run', 'playthrough', 'playtest'];
const SOURCES = { user: '用户自述', ai: 'AI 报告', log: '日志或文件' };

const accepted = (project, topic) => (project.designDecisions ?? [])
  .find(item => item.topic === topic && item.status === 'accepted');

export function evidenceLevel(project) {
  let best = -1;
  for (const item of project.evidence ?? []) {
    if (item.status !== 'current') continue;
    const effective = item.type === 'playtest' && item.degraded ? 'playthrough' : item.type;
    best = Math.max(best, LEVEL_ORDER.indexOf(effective));
  }
  return best < 0 ? null : LEVEL_ORDER[best];
}

export function evidenceBoardLabel(project) {
  const level = evidenceLevel(project);
  return { null: '未制作', build: '已构建，未运行', run: '已运行，未玩通',
    playthrough: '已玩通，未试玩', playtest: '有真人试玩记录' }[level ?? 'null'];
}

export function buildTaskDocument(project) {
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

export function importEvidence(project, payload) {
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
