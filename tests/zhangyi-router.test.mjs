import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const mainSkill = readFileSync(join(root, 'skills', 'zhangyi', 'SKILL.md'), 'utf8');

test('路由表覆盖全部 zhangyi-* 阶段 skill，不说谎', () => {
  const stageSkills = readdirSync(join(root, 'skills'))
    .filter(name => /^zhangyi-.+/.test(name));
  assert.ok(stageSkills.length >= 8, '阶段 skill 数量异常');
  for (const name of stageSkills) {
    assert.ok(mainSkill.includes(`\`${name}\``), `主路由表漏了 ${name}（路由器不许说谎）`);
  }
  assert.ok(mainSkill.includes('主流程'), '阶段路由缺主流程视图');
});

test('阶段识别表覆盖全部阶段 skill，AGENTS.md 有同步铁律', () => {
  const stage = readFileSync(join(root, 'skills', 'zhangyi', 'references', '阶段识别表.md'), 'utf8');
  const stageSkills = readdirSync(join(root, 'skills'))
    .filter(name => /^zhangyi-.+/.test(name));
  for (const name of stageSkills) {
    assert.ok(stage.includes(name), `阶段识别表漏了 ${name}（路由器不许说谎）`);
  }
  const agents = readFileSync(join(root, 'AGENTS.md'), 'utf8');
  assert.ok(agents.includes('路由器不许说谎'), 'AGENTS.md 缺路由同步铁律');
});
