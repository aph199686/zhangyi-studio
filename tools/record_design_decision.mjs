import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { exportFiles, recordDesignDecision, validateProject } from '../nest/workbench-core.mjs';

const [projectFile, eventFile] = process.argv.slice(2);
if (!projectFile || !eventFile) throw new Error('用法：node tools/record_design_decision.mjs <项目记录.json> <本轮决定.json>');
const original = validateProject(JSON.parse(readFileSync(projectFile, 'utf8')));
const event = JSON.parse(readFileSync(eventFile, 'utf8'));
const updated = recordDesignDecision(original, event.topic, event.label, event.consequence, event.actor ?? 'user');
for (const file of exportFiles(updated)) writeFileSync(join(dirname(projectFile), file.name), file.content, 'utf8');
console.log(`项目记录 v${updated.version}：${event.topic} → ${event.label}`);
