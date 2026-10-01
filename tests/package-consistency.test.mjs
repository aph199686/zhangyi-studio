import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createProject, exportFiles } from '../nest/workbench-core.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// 工作台有两处拼装项目包：exportFiles 产出 3 份，本地直存服务再追加 6 份。
// serve_studio 会在导入时起服务，不能直接 import，因此从源码里取它追加的文件名——
// 这样将来新增第 10 份文件时，本测试会连同说明书"九份"的措辞一起拦住。
const serveAdded = [...read('tools/serve_studio.mjs').matchAll(/name: '([^']+\.md)'/g)].map(m => m[1]);

const packageNames = () => [...exportFiles(createProject()).map(file => file.name), ...serveAdded];

test('项目包文件名在导出模块、工作台列表、帮助页与说明书四处一致', () => {
  const names = packageNames();

  assert.equal(names.length, 9, '项目包应为九份；若有意增减，需同批更新说明书与帮助页措辞');
  assert.equal(new Set(names).size, names.length, '项目包文件名不得重复');
  assert.deepEqual(names.slice(0, 3), ['zhangyi.project.json', '项目总览.md', '开发交接.md']);

  const html = read('nest/studio.html');
  const listBlock = html.match(/<div class="file-list">([\s\S]*?)<\/div>/);
  assert.ok(listBlock, 'studio.html 应有项目包文件清单');
  const uiNames = [...listBlock[1].matchAll(/<span>([^<]+)<\/span>/g)].map(m => m[1]);
  assert.deepEqual(uiNames, names, '工作台列出的文件名与顺序须与真实导出一致');

  const guide = read('nest/guide.html');
  const missingInGuide = names.filter(name => !guide.includes(name));
  assert.deepEqual(missingInGuide, [], '帮助页应列出全部项目包文件');

  const source = read('docs/产品说明书.md');
  const missingInDoc = names.filter(name => !source.includes(name));
  assert.deepEqual(missingInDoc, [], '说明书应列出全部项目包文件');
  assert.match(source, /里面有九份同源文件/, '说明书声明的份数须与实际份数一致');
});

test('工作台四页与阶段导航的说法与说明书一致', () => {
  const html = read('nest/studio.html');
  assert.match(html, /01 立项/);
  assert.match(html, /02 审方案/);
  assert.match(html, /03 做出来/);
  assert.match(html, /04 试玩与修订/);

  const source = read('docs/产品说明书.md');
  assert.match(source, /01 帮你理清想法，02 帮你把关方案，03 帮你派活验收，04 帮你看真人玩/);
  assert.doesNotMatch(source, /04 试玩与修订.*筹备中/);
  assert.match(source, /工作台不会生成可玩的游戏/);
});

test('说明书版本号在页首与页尾一致，且帮助页由同一版本生成', () => {
  const source = read('docs/产品说明书.md');
  const head = source.match(/适用版本：v(\d+\.\d+\.\d+)/)?.[1];
  assert.ok(head, '说明书应有适用版本');
  assert.match(source, new RegExp(`产品说明书 v${head.replace(/\./g, '\\.')}$`, 'm'), '页尾版本须与页首一致');

  // 帮助页不含版本声明，但应出现当前版本号（说明它由当前说明书生成）
  const guide = read('nest/guide.html');
  assert.ok(guide.includes(`v${head}`), '帮助页应体现当前说明书版本');
});
