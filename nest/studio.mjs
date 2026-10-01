import {
  ENTRY_POINTS, GENRE_OPTIONS, createProject, routeOptions, focusOptions, intakeGuidance, setInput, choose,
  validateProject, exportFiles, intakeProfile,
} from './workbench-core.mjs';
import { makeZip } from './zip.mjs';
import { questionnaireView, answerQuestion, usePresetRecommendation, reviewIssues, kickoffDraft } from './questionnaire.mjs';
import { FIRST_TABLES, reviewSnapshot, chooseFirstTable, keepRetry, reviewDocument } from './review-core.mjs';
import { reviewTaskDocument, importReview, latestReview, resolveIntervention, interventionDocument } from './review-exchange.mjs';
import { buildTaskDocument, importEvidence, evidenceBoardLabel, EVIDENCE_TYPES } from './build-task.mjs';
import { playtestGear, playtestTaskDocument, revisionDocument, importPlaytests, PLAYTEST_GEARS } from './playtest.mjs';
import { getLocale, setLocale, t, uiText, translateUI, setUiText } from './i18n.mjs';
import { mentorSignal, mentorProgress, mentorCue } from './mentor.mjs';

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
