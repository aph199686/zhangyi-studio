import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => readFileSync(join(root, ...p), 'utf8');
const stageSkills = readdirSync(join(root, 'skills'))
  .filter(name => /^zhangyi-(kickoff|systems|narrative|probe|playtest|review)$/.test(name));

test('三个共享原语齐备且含核心纪律词', () => {
  const ask = read('skills', 'zhangyi', 'references', '选择题与拍板.md');
  assert.ok(ask.includes('共享原语·追问'), '追问原语未声明');
  const card = read('skills', 'zhangyi', 'references', '原语·引卡.md');
  for (const w of ['≤6 张', '纯推演', '不许伪造引用', '见识，不是指令', '冲突点']) {
    assert.ok(card.includes(w), `原语·引卡缺：${w}`);
  }
  const verdict = read('skills', 'zhangyi', 'references', '原语·落判.md');
  for (const w of ['过 / 缓 / 否', 'verdicts/', 'No.NNN', '否决清单', '撤回', '装饰章', '诚实声明']) {
    assert.ok(verdict.includes(w), `原语·落判缺：${w}`);
  }
  const main = read('skills', 'zhangyi', 'SKILL.md');
  for (const w of ['原语·引卡', '原语·落判', '共享原语']) {
    assert.ok(main.includes(w), `主 skill 未接入：${w}`);
  }
});

test('六个阶段 skill 引用原语且不再重复书写纪律', () => {
  for (const name of stageSkills) {
    const text = read('skills', name, 'SKILL.md');
    assert.ok(text.includes('原语·引卡'), `${name} 未引用原语·引卡`);
    assert.ok(text.includes('原语·落判'), `${name} 未引用原语·落判`);
    assert.ok(!text.includes('单次评审 ≤6 张'), `${name} 仍重复书写引卡纪律`);
    assert.ok(!text.includes('编号递增，页脚带张翼水印'), `${name} 仍重复书写落判纪律`);
  }
});

test('原语文件在阶段 skill 中的相对路径真实存在', () => {
  for (const name of stageSkills) {
    assert.ok(existsSync(join(root, 'skills', name, '..', 'zhangyi', 'references', '原语·引卡.md')));
    assert.ok(existsSync(join(root, 'skills', name, '..', 'zhangyi', 'references', '原语·落判.md')));
  }
});
