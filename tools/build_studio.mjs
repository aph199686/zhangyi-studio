import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFileSync(resolve(root, 'nest', name), 'utf8');
const core = read('workbench-core.mjs')
  .replace(/^import \{ genrePackTopics, inferGenreFromIdea \} from '\.\/content-packs\.mjs';\r?\n/, '')
  .replace(/^export /gm, '');
const contentPacks = read('content-packs.mjs').replace(/^export /gm, '');
const questionnaire = read('questionnaire.mjs')
  .replace(/^import \{ focusOptions, intakeGuidance, intakeProfile, recordDesignDecision \} from '\.\/workbench-core\.mjs';\r?\n/, '')
  .replace(/^import \{ activeGenrePack, genrePackRecommendation, genrePackPlan, stylePackPlan, enginePackPlan \} from '\.\/content-packs\.mjs';\r?\n/, '')
  .replace(/^export /gm, '');
const buildTask = read('build-task.mjs')
  .replace(/^import \{ intakeProfile, intakeGuidance, validateProject \} from '\.\/workbench-core\.mjs';\r?\n/, '')
  .replace(/^import \{ genrePackPlan, enginePackPlan, activeGenrePack \} from '\.\/content-packs\.mjs';\r?\n/, '')
  .replace(/^export /gm, '');
const playtest = read('playtest.mjs')
  .replace(/^import \{ validateProject \} from '\.\/workbench-core\.mjs';\r?\n/, '')
  .replace(/^import \{ evidenceLevel, evidenceBoardLabel \} from '\.\/build-task\.mjs';\r?\n/, '')
  .replace(/^export /gm, '');
const review = read('review-core.mjs')
  .replace(/^import \{ intakeProfile, recordDesignDecision \} from '\.\/workbench-core\.mjs';\r?\n/, '')
  .replace(/^import \{ reviewIssues, questionnaireView \} from '\.\/questionnaire\.mjs';\r?\n/, '')
  .replace(/^import \{ activeGenrePack \} from '\.\/content-packs\.mjs';\r?\n/, '')
  .replace(/^import \{ evidenceBoardLabel \} from '\.\/build-task\.mjs';\r?\n/, '')
  .replace(/^export /gm, '');
const exchange = read('review-exchange.mjs')
  .replace(/^import \{ recordDesignDecision, validateProject \} from '\.\/workbench-core\.mjs';\r?\n/, '')
  .replace(/^export /gm, '');
const zip = read('zip.mjs').replace(/^export /gm, '');
const i18n = read('i18n.mjs').replace(/^export /gm, '');
const mentor = read('mentor.mjs').replace(/^export /gm, '');
let studio = read('studio.mjs');
const imports = [
  /^import \{[\s\S]*?\} from '\.\/workbench-core\.mjs';\r?\n/,
  /^import \{ makeZip \} from '\.\/zip\.mjs';\r?\n/,
  /^import \{[\s\S]*?\} from '\.\/questionnaire\.mjs';\r?\n/,
  /^import \{[\s\S]*?\} from '\.\/review-core\.mjs';\r?\n/,
  /^import \{[\s\S]*?\} from '\.\/review-exchange\.mjs';\r?\n/,
  /^import \{[\s\S]*?\} from '\.\/build-task\.mjs';\r?\n/,
  /^import \{[\s\S]*?\} from '\.\/playtest\.mjs';\r?\n/,
  /^import \{ getLocale, setLocale, t, uiText, translateUI, setUiText \} from '\.\/i18n\.mjs';\r?\n/,
  /^import \{ mentorSignal, mentorProgress, mentorCue \} from '\.\/mentor\.mjs';\r?\n/,
];
for (const pattern of imports) {
  if (!pattern.test(studio)) throw new Error(`studio.mjs 的导入格式已变化：${pattern}`);
  studio = studio.replace(pattern, '');
}
if (/^import |^export /m.test(`${core}\n${contentPacks}\n${questionnaire}\n${buildTask}\n${playtest}\n${review}\n${exchange}\n${zip}\n${i18n}\n${mentor}\n${studio}`)) {
  throw new Error('发现未打包的模块语法。');
}
const output = `/* 由 node tools/build_studio.mjs 生成；请编辑 .mjs 源文件。 */\n(() => {\n'use strict';\n${core}\n${contentPacks}\n${questionnaire}\n${buildTask}\n${playtest}\n${review}\n${exchange}\n${zip}\n${i18n}\n${mentor}\n${studio}\n})();\n`;
writeFileSync(resolve(root, 'nest', 'studio.bundle.js'), output, 'utf8');
process.stdout.write(`已生成 nest/studio.bundle.js（${Buffer.byteLength(output)} 字节）\n`);
await import('./build_guide.mjs');
