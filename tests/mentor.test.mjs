import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { createProject } from '../nest/workbench-core.mjs';
import { mentorCue, mentorProgress, mentorSignal } from '../nest/mentor.mjs';

test('Lin points to the next real action without changing the project', () => {
  const project = createProject();
  const original = JSON.stringify(project);
  assert.equal(mentorCue(project, 'kickoff').id, 'start');
  project.input.idea = 'A tactics game';
  assert.equal(mentorCue(project, 'kickoff').id, 'route');
  project.decisions.route = { value: 'short', status: 'accepted' };
  assert.equal(mentorCue(project, 'kickoff').id, 'focus');
  project.decisions.focus = { value: 'first_turn', status: 'accepted' };
  assert.equal(mentorCue(project, 'kickoff', { openQuestions: 2 }).id, 'questions');
  assert.equal(mentorCue(project, 'kickoff', { openQuestions: 0 }).id, 'toReview');
  assert.equal(mentorCue(project, 'review', { reviewReady: false }).id, 'reviewGaps');
  assert.equal(mentorCue(project, 'review', { reviewReady: true }).id, 'reviewAI');
  project.judgments.push({ kind: 'ai_review', interventions: [{ status: 'proposed' }] });
  assert.equal(mentorCue(project, 'review', { reviewReady: true }).id, 'reviewAdvice');
  project.judgments[0].interventions[0].status = 'deferred';
  assert.equal(mentorCue(project, 'review', { reviewReady: true }).id, 'toBuild');
  assert.equal(mentorCue(project, 'build').id, 'buildTask');
  assert.notEqual(JSON.stringify(project), original); // Only the test changed it.
});

test('reaction fires for accepted decisions or higher evidence, not a reload or provisional choice', () => {
  const project = createProject();
  const initial = mentorSignal(project);
  assert.equal(mentorProgress(initial, mentorSignal(structuredClone(project))), false);
  project.decisions.route = { value: 'short', status: 'provisional' };
  assert.equal(mentorProgress(initial, mentorSignal(project)), false);
  project.decisions.route.status = 'accepted';
  const accepted = mentorSignal(project);
  assert.equal(mentorProgress(initial, accepted), true);
  project.evidence.push({ type: 'build', status: 'current' });
  assert.equal(mentorProgress(accepted, mentorSignal(project)), true);
  project.evidence.push({ type: 'playtest', status: 'current', degraded: true });
  assert.equal(mentorCue(project, 'build').id, 'playThrough');
  project.evidence[0].status = 'needs_review';
  assert.equal(mentorCue(project, 'build').id, 'staleEvidence');
});

test('floating Lin has a movable sprite, chat controls, chosen states and reduced-motion fallback', () => {
  const html = readFileSync(new URL('../nest/studio.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../nest/studio.css', import.meta.url), 'utf8');
  const js = readFileSync(new URL('../nest/studio.mjs', import.meta.url), 'utf8');
  for (const name of ['idle.apng', 'welcome.apng', 'thinking.apng', 'still.png', 'avatar.png']) {
    assert.ok(statSync(new URL(`../nest/assets/lin-siyu/${name}`, import.meta.url)).size > 0);
  }
  assert.match(html, /id="mentor-toggle"/);
  assert.match(html, /id="mentor-pet"/);
  assert.match(html, /id="mentor-sprite"/);
  assert.match(html, /id="mentor-chat"[^>]*hidden/);
  assert.match(html, /id="mentor-chat-stop"[^>]*hidden/);
  for (const anim of ['idle', 'welcome', 'thinking']) {
    assert.match(html, new RegExp(`class="mentor-apng" data-anim="${anim}"`));
  }
  assert.doesNotMatch(html, /<video/, 'no video element: animations are alpha-safe APNG layers');
  assert.doesNotMatch(js, /\.webm/, 'defective webm intermediates stay unreferenced');
  assert.match(js, /function mentorShowAnim\(/);
  assert.match(js, /mentorShowAnim\('welcome'\)/);
  assert.match(js, /mentorShowAnim\('thinking'\)/);
  assert.match(js, /--tail-x/);
  assert.match(css, /\.mentor-apng \{ opacity:0/);
  assert.match(css, /\.mentor-apng\.is-live \{ opacity:1/);
  assert.match(css, /prefers-reduced-motion:reduce\)[\s\S]*?\.mentor-apng \{ display:none/);
  assert.match(css, /\.mentor-bubble::after/);
  assert.match(css, /\.mentor-pet \{[^}]*position:fixed/);
  assert.match(js, /setPointerCapture/);
  assert.match(js, /PET_POSITION_KEY/);
  assert.match(js, /mentorChatAbort\?\.abort\(\)/);
  assert.match(js, /function mentorReact\(\) \{[^}]*?prefers-reduced-motion: reduce[^}]*?showMentorBubble\(\);/,
    'reduced-motion still shows the short reaction as a static bubble');
});
