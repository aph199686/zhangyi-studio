import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getLocale, setLocale, t, uiText, translateUI } from '../nest/i18n.mjs';

test('language switch translates interface copy and preserves unsupported design text', () => {
  setLocale('en');
  assert.equal(getLocale(), 'en');
  assert.equal(t('language'), 'Language');
  assert.equal(t('pageTitle'), 'Zhangyi Studio · From idea to first playable round');
  assert.equal(uiText('保存项目包'), 'Save project package');
  assert.equal(uiText('已有 3 项确认决定；当前还有 2 项可补，1 项预设暂拟。'),
    '3 confirmed decisions; 2 questions to answer; 1 provisional presets.');
  assert.equal(uiText('五代十国的文明'), '五代十国的文明');
  assert.equal(uiText('如果玩家失败，先告诉他为什么。'), '如果玩家失败，先告诉他为什么。');
  assert.equal(t('mentor.questions', { count: 2 }), '2 questions remain for this route. Answer only what could change the first round.');
  setLocale('zh-CN');
  assert.equal(uiText('保存项目包'), '保存项目包');
});

test('local bundle contains the language layer and the workbench exposes a persistent switch', () => {
  const source = readFileSync(new URL('../nest/studio.html', import.meta.url), 'utf8');
  const build = readFileSync(new URL('../tools/build_studio.mjs', import.meta.url), 'utf8');
  const studio = readFileSync(new URL('../nest/studio.mjs', import.meta.url), 'utf8');
  assert.match(source, /id="locale-select"/);
  assert.match(source, /id="language-boundary"/);
  assert.match(build, /read\('i18n\.mjs'\)/);
  assert.match(studio, /localStorage\.setItem\(LOCALE_KEY/);
});

test('attribute translation reverses cleanly without touching project data', () => {
  const oldDocument = globalThis.document;
  const oldNodeFilter = globalThis.NodeFilter;
  const attributes = new Map([['aria-label', '界面语言']]);
  const element = {
    hasAttribute: key => attributes.has(key),
    getAttribute: key => attributes.get(key),
    setAttribute: (key, value) => attributes.set(key, value),
  };
  const root = {
    createTreeWalker: () => ({ nextNode: () => null }),
    querySelectorAll: () => [element],
  };
  globalThis.document = { documentElement: { lang: 'zh-CN' } };
  globalThis.NodeFilter = { SHOW_TEXT: 4 };
  try {
    setLocale('en'); translateUI(root);
    assert.equal(attributes.get('aria-label'), 'Interface language');
    setLocale('zh-CN'); translateUI(root);
    assert.equal(attributes.get('aria-label'), '界面语言');
  } finally {
    globalThis.document = oldDocument;
    globalThis.NodeFilter = oldNodeFilter;
  }
});
