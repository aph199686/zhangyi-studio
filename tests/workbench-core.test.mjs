import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProject, setInput, routeOptions, choose, recordDesignDecision, exportFiles, validateProject,
} from '../nest/workbench-core.mjs';
import { makeZip } from '../nest/zip.mjs';

test('多个入口可叠加，改路线会使依赖选择失效并保留历史', () => {
  let state = setInput(createProject(), '我喜欢一款策略游戏，也有自己的故事。', ['reference', 'story']);
  assert.deepEqual(state.input.entries, ['reference', 'story']);
  assert.ok(routeOptions(state).some(option => option.id === 'mod'));
  state = setInput(state, state.input.idea, ['reference', 'story', 'existing']);
  assert.ok(routeOptions(state).some(option => option.id === 'mod'));
  assert.ok(routeOptions(state).some(option => option.id === 'improve'));
  state = choose(state, 'route', 'short');
  state = choose(state, 'focus', 'moment');
  const oldFocus = state.decisions.focus.id;
  state = choose(state, 'route', 'mod');
  assert.equal(state.decisions.focus.id, oldFocus);
  assert.equal(state.decisions.focus.status, 'needs_review');
  assert.match(state.history.at(-1).summary, /独立小样.*原游戏模组/);
  const files = exportFiles(state);
  const handoff = files.find(file => file.name === '开发交接.md').content;
  assert.match(handoff, /第一份作品重点尚未确认/);
  assert.match(handoff, /需复核/);
  assert.match(handoff, /尚无本次新游戏的运行证据/);
  assert.equal(validateProject(JSON.parse(files[0].content)).version, state.version);
  state = choose(state, 'focus', 'content');
  assert.equal(state.decisions.focus.status, 'accepted');
});

test('改最初想法会要求复核决定，不能从旧文档推断现状', () => {
  let state = setInput(createProject(), '我想做棋盘游戏。', ['mechanic']);
  state = choose(state, 'route', 'short');
  state = choose(state, 'focus', 'first_turn');
  state = setInput(state, '我其实想做一个故事游戏。', ['story']);
  assert.equal(state.decisions.route.status, 'needs_review');
  assert.equal(state.decisions.focus.status, 'needs_review');
  assert.match(exportFiles(state)[1].content, /路线尚未确认/);
});

test('导出包含三份同版本文件', () => {
  const state = setInput(createProject(), '五代十国策略游戏', ['reference']);
  const files = exportFiles(state);
  assert.equal(files.length, 3);
  assert.equal(JSON.parse(files[0].content).version, state.version);
  for (const file of files.slice(1)) assert.match(file.content, new RegExp(`v${state.version}`));
  const zip = makeZip(files);
  assert.equal(new DataView(zip.buffer).getUint32(0, true), 0x04034b50);
  assert.ok(zip.length > files.reduce((sum, file) => sum + file.content.length, 0));
});

test('现成引擎做新游戏会保留技术约束和设计顺序', () => {
  let state = setInput(createProject(), '从零设计一款新斗智游戏。', ['story', 'existing'],
    'Ren\'Py 7.4.11；项目 C:\\Users\\surface\\Desktop\\0926casino');
  assert.ok(routeOptions(state).some(option => option.id === 'new_game'));
  state = choose(state, 'route', 'new_game');
  state = choose(state, 'focus', 'world');
  const handoff = exportFiles(state).find(file => file.name === '开发交接.md').content;
  assert.match(handoff, /Ren'Py 7\.4\.11/);
  assert.match(handoff, /先定玩家会进入的地方/);
  assert.doesNotMatch(handoff, /目标平台.*未定/);
});

test('旧项目已选新游戏路线时，不因想法栏留空就推荐改回修旧项目', () => {
  let state = setInput(createProject(), '', ['existing'], '已有战棋工程');
  state = choose(state, 'route', 'new_game');
  assert.equal(routeOptions(state).find(item => item.recommended).id, 'new_game');
  const unchanged = choose(state, 'route', 'new_game');
  assert.equal(unchanged.version, state.version);
});

test('确认具体设计决定后，项目总览和交接同步显示，重选留下旧记录', () => {
  let state = recordDesignDecision(createProject(), '世界与舞台', '封闭的未来避难城', '有限空间反复相遇；举办者未定');
  let files = exportFiles(state);
  assert.match(files.find(file => file.name === '项目总览.md').content, /封闭的未来避难城/);
  assert.match(files.find(file => file.name === '开发交接.md').content, /举办者未定/);
  state = recordDesignDecision(state, '世界与舞台', '航行中的方舟', '场景随航行推进');
  assert.equal(state.designDecisions[0].status, 'superseded');
  assert.equal(state.designDecisions[1].status, 'accepted');
  files = exportFiles(state);
  assert.doesNotMatch(files.find(file => file.name === '项目总览.md').content, /封闭的未来避难城/);
});
