// One grounded next step. This module never writes to the project record.
const EVIDENCE_RANK = { build: 1, run: 2, playthrough: 3, playtest: 4 };

export function mentorSignal(project) {
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

export function mentorProgress(previous, current) {
  return current.evidenceRank > previous.evidenceRank
    || current.accepted.some(value => !previous.accepted.includes(value));
}

export function mentorCue(project, stage, { openQuestions = 0, reviewReady = false } = {}) {
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
