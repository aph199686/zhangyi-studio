import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('first-use guide is generated as steps with an optional reference section', () => {
  const source = readFileSync(new URL('../docs/产品说明书.md', import.meta.url), 'utf8');
  const html = readFileSync(new URL('../nest/guide.html', import.meta.url), 'utf8');
  const version = source.match(/适用版本：v(\d+\.\d+\.\d+)/)?.[1];
  assert.ok(version);
  assert.match(source, new RegExp(`产品说明书 v${version.replace(/\./g, '\\.')}`));
  assert.match(html, /<ol class="steps">/);
  assert.match(html, /<section class="guide-section guide-reference">/);
  assert.match(html, /<details><summary>展开内容包细节与证据边界<\/summary>/);
  assert.match(html, /href="studio\.html">打开工作台<\/a>/);
  assert.match(html, /九份同源文件/);
  assert.doesNotMatch(source, /04 试玩与修订.*筹备中/);
});
