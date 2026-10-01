import { validateProject } from './workbench-core.mjs';
import { evidenceLevel, evidenceBoardLabel } from './build-task.mjs';

// 04 试玩与修订：试飞任务导出、场次级试玩记录导入、修订建议生成。
// 天条：不伪造玩家声音；缺样本三要素的场次降级为自述级；04 不替用户改方案。
export const PLAYTEST_GEARS = { observe: '首次观察', walkthrough: '体验走查', revise: '修订核对' };

export function playtestGear(project) {
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

export function playtestTaskDocument(project) {
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

export function revisionDocument(project) {
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

export function importPlaytests(project, payload) {
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
