import { recordDesignDecision, validateProject } from './workbench-core.mjs';

const cleanReviewValue = value => String(value ?? '').trim();
const validText = (value, name, max = 800) => {
  if (typeof value !== 'string') throw new Error(`${name}必须是文字。`);
  const text = cleanReviewValue(value);
  if (!text || text.length > max) throw new Error(`${name}缺失或过长。`);
  return text;
};
const bases = { record: '项目记录', inference: '张翼推演', external: '外部线索，待核实' };

export function reviewTaskDocument(project) {
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

export function importReview(project, payload) {
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

export function latestReview(project) {
  return [...(project.judgments ?? [])].reverse().find(item => item.kind === 'ai_review') ?? null;
}

export function resolveIntervention(project, id, action) {
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

export function interventionDocument(project) {
  const reviews = (project.judgments ?? []).filter(item => item.kind === 'ai_review');
  if (!reviews.length) return '# 张翼介入记录\n\n当前尚未导入 AI 审查结果。工作台的离线规则提示不算模型专业评审。\n';
  const entries = reviews.map(review => `## 审查 ${review.id}（基于项目 v${review.sourceVersion}）\n\n${review.summary}\n\n${review.interventions.map(item => `### ${item.topic} · ${item.status === 'accepted' ? '用户已采纳' : item.status === 'deferred' ? '暂缓' : item.status === 'needs_review' ? '已过期，需复核' : '待用户决定'}\n\n- 原方案：${item.current}\n- 张翼建议：${item.proposal}\n- 对玩家和范围的影响：${item.effect}\n- 理由：${item.reason}\n- 代价：${item.cost}\n- 核实方式：${item.verification}\n- 依据：${bases[item.basis]}；${item.basisDetail}`).join('\n\n')}`).join('\n\n');
  return `# 张翼介入记录\n\n> 项目记录 v${project.version}。AI 建议与用户已确认的决定分开记录；外部线索未由工作台核实。\n\n${entries}\n`;
}
