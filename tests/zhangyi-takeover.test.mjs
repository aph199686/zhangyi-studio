import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = join(root, 'skills', 'zhangyi-takeover');
const skillPath = join(skillDir, 'SKILL.md');

test('zhangyi-takeover/SKILL.md 存在且 frontmatter 合规', () => {
  assert.ok(existsSync(skillPath), 'SKILL.md 不存在');
  const text = readFileSync(skillPath, 'utf8').replace(/\r\n/g, '\n');
  const m = text.match(/^---\n(.*?)\n---\n/s);
  assert.ok(m, 'frontmatter 缺失或格式不对');
  assert.match(m[1], /^name:\s*\S+/m, '缺少 name');
  const d = m[1].match(/^description:\s*"(.*)"/ms);
  assert.ok(d, 'description 必须双引号包裹');
  assert.match(d[1], /[一-鿿]/, 'description 缺中文触发词');
  assert.match(d[1], /[A-Za-z]{4,}/, 'description 缺英文触发词');
  assert.ok(d[1].length <= 600, 'description 超过 600 字符');
  assert.ok(text.split('\n').length <= 500, 'SKILL.md 超过 500 行');
});

test('六个文件齐备且 references 全部被 SKILL.md 引用', () => {
  const refs = ['接管流程.md', '框架理解与目录整理.md', '任务编排与完成标准.md', '接续台账模板.md', '项目维基.md', '项目维基模板.md'];
  const skill = readFileSync(skillPath, 'utf8');
  for (const r of refs) {
    assert.ok(existsSync(join(skillDir, 'references', r)), `references/${r} 不存在`);
    assert.ok(skill.includes(`references/${r}`), `SKILL.md 未引用 references/${r}`);
  }
  // SKILL.md 引用的每个 references/ 链接都必须真实存在（与 validate.py 同口径）
  for (const mm of skill.matchAll(/\]\((references\/[^)]+)\)/g)) {
    assert.ok(existsSync(join(skillDir, mm[1])), `引用了不存在的 ${mm[1]}`);
  }
});

test('SKILL.md 含关键纪律词', () => {
  const t = readFileSync(skillPath, 'utf8');
  for (const w of ['只读', '免立项', '先列清单', '不删除', '备份', '每批 2~3 条',
    '完成标准', '已砍', '五态', 'ledger']) {
    assert.ok(t.includes(w), `缺少纪律词：${w}`);
  }
});

test('目录整理段含授权前置与打标签边界', () => {
  const t = readFileSync(skillPath, 'utf8');
  assert.ok(t.includes('授权前置'), '缺授权前置');
  assert.ok(t.includes('打标签边界'), '缺打标签边界');
  assert.ok(t.includes('显式') && t.includes('允许'), '缺显式允许');
  assert.ok(t.includes('禁止') && t.includes('注释头'), '缺禁止源码内打标');
});

test('与 relay / kickoff 的划界关键词存在', () => {
  const t = readFileSync(skillPath, 'utf8');
  for (const w of ['跨会话', '接管管理', '方向已定', '方向未定']) {
    assert.ok(t.includes(w), `缺少划界词：${w}`);
  }
});

test('templates/接续台账.md 存在且为指向内置版的指针 stub', () => {
  const stubPath = join(root, 'templates', '接续台账.md');
  assert.ok(existsSync(stubPath), 'templates/接续台账.md 不存在');
  const stub = readFileSync(stubPath, 'utf8');
  assert.ok(stub.includes('skills/zhangyi-takeover/references/接续台账模板.md'),
    'stub 未指向内置事实源');
  assert.ok(stub.includes('两处同步'), 'stub 缺两处同步提醒');
});

test('项目维基模块：分工、蒸馏与回馏纪律齐全', () => {
  const wiki = readFileSync(join(skillDir, 'references', '项目维基.md'), 'utf8');
  for (const w of ['工程知识', '设计理由', '世界与内容', '验证证据', '蒸馏', '回馏', '脱敏',
    '不搬运', '0~3 条', '已废弃']) {
    assert.ok(wiki.includes(w), `项目维基.md 缺少：${w}`);
  }
  const skill = readFileSync(skillPath, 'utf8');
  assert.ok(skill.includes('references/项目维基.md'), 'SKILL.md 未引用项目维基.md');
  const stub = readFileSync(join(root, 'templates', '项目维基.md'), 'utf8');
  assert.ok(stub.includes('skills/zhangyi-takeover/references/项目维基模板.md'), 'stub 未指向内置事实源');
  const orchestration = readFileSync(join(skillDir, 'references', '任务编排与完成标准.md'), 'utf8');
  assert.ok(orchestration.includes('wiki/'), '任务编排未接线每批收尾蒸馏');
});

test('三处路由已接线', () => {
  const main = readFileSync(join(root, 'skills', 'zhangyi', 'SKILL.md'), 'utf8');
  assert.ok(main.includes('zhangyi-takeover'), '主 SKILL.md 路由表缺 takeover');
  const stage = readFileSync(join(root, 'skills', 'zhangyi', 'references', '阶段识别表.md'), 'utf8');
  assert.ok(stage.includes('zhangyi-takeover'), '阶段识别表缺 takeover 小节');
  const rite = readFileSync(join(root, 'skills', 'zhangyi', 'references', '授翼仪式.md'), 'utf8');
  assert.ok(rite.includes('免授翼分支') && rite.includes('zhangyi-takeover'), '授翼仪式缺免授翼分支');
});
