import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProject, exportFiles } from '../nest/workbench-core.mjs';
import { importEvidence, buildTaskDocument } from '../nest/build-task.mjs';
import { makeZip } from '../nest/zip.mjs';
import { setLocale, uiText, t } from '../nest/i18n.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const record = overrides => ({ type: 'build', source: 'log', note: '测试数据：构建退出码 0', at: '2026-09-30', ...overrides });
const payload = (project, records, overrides = {}) =>
  ({ schemaVersion: 1, projectCreatedAt: project.createdAt, baseVersion: project.version, records, ...overrides });

test('证据导入拒绝：9 条、schemaVersion、createdAt、baseVersion', () => {
  const project = createProject();
  const nine = Array.from({ length: 9 }, () => record());
  assert.throws(() => importEvidence(project, payload(project, nine)), /1—8 条/);
  assert.throws(() => importEvidence(project, payload(project, [record()], { schemaVersion: 2 })), /版本不一致/);
  assert.throws(() => importEvidence(project, payload(project, [record()], { projectCreatedAt: '2020-01-01T00:00:00.000Z' })), /版本不一致/);
  assert.throws(() => importEvidence(project, payload(project, [record()], { baseVersion: project.version + 1 })), /版本不一致/);
});

test('证据导入拒绝：来源枚举、note 缺失或超长、日期缺失或超长', () => {
  const project = createProject();
  assert.throws(() => importEvidence(project, payload(project, [record({ source: 'friend' })])), /来源无效/);
  assert.throws(() => importEvidence(project, payload(project, [record({ note: '   ' })])), /验证方式缺失/);
  assert.throws(() => importEvidence(project, payload(project, [record({ note: '长'.repeat(801) })])), /验证方式缺失或过长/);
  assert.throws(() => importEvidence(project, payload(project, [record({ at: '  ' })])), /日期缺失/);
  assert.throws(() => importEvidence(project, payload(project, [record({ at: '超'.repeat(41) })])), /日期缺失或过长/);
});

test('证据导入：降级计数写入历史摘要，条目 id 与版本推进', () => {
  const project = createProject();
  const next = importEvidence(project, payload(project, [
    record(),
    { type: 'playtest', source: 'user', note: '测试数据：缺三要素', at: '2026-09-30' },
  ]));
  assert.equal(next.version, project.version + 1);
  assert.deepEqual(next.evidence.map(item => item.id),
    [`evidence-${next.version}-1`, `evidence-${next.version}-2`]);
  assert.equal(next.evidence[0].degraded, false);
  assert.equal(next.evidence[1].degraded, true);
  const last = next.history[next.history.length - 1];
  assert.equal(last.type, 'evidence_imported');
  assert.match(last.summary, /导入可玩证据 2 条（其中 1 条真人试玩缺样本三要素，降级为自述）/);
  const full = importEvidence(project, payload(project, [
    { type: 'playtest', source: 'user', note: '测试数据：三要素齐全', at: '2026-09-30',
      sample: { origin: '验证用·朋友 2 人', size: '2', caliber: '各 10 分钟' } },
  ]));
  assert.doesNotMatch(full.history[full.history.length - 1].summary, /降级为自述/);
});

test('制作任务包的已有证据段随记录变化', () => {
  const project = createProject();
  assert.match(buildTaskDocument(project), /## 已有证据\s+- 尚无。/s);
  const next = importEvidence(project, payload(project, [record()]));
  const doc = buildTaskDocument(next);
  assert.match(doc, /\[构建通过\] 测试数据：构建退出码 0（日志或文件，2026-09-30）/);
});

test('ZIP 项目包可用系统解包工具还原且内容逐字一致', { skip: process.platform !== 'win32' }, async () => {
  const project = createProject();
  const files = [...exportFiles(project).map(file => ({ name: file.name, content: file.content })),
    { name: '立项书草案.md', content: '# 立项书草案\n\n测试数据\n' },
    { name: '方案审查记录.md', content: '# 方案审查记录\n\n测试数据\n' },
    { name: '张翼审查任务.md', content: '# 张翼审查任务\n\n测试数据\n' },
    { name: '张翼介入记录.md', content: '# 张翼介入记录\n\n测试数据\n' },
    { name: '制作任务包.md', content: buildTaskDocument(project) }];
  assert.equal(files.length, 8);
  const zip = makeZip(files);
  const dir = mkdtempSync(join(tmpdir(), 'zhangyi-zip-'));
  try {
    const zipPath = join(dir, 'pkg.zip');
    writeFileSync(zipPath, zip);
    const out = join(dir, 'out');
    mkdirSync(out, { recursive: true });
    const exit = await new Promise(done => {
      const p = spawn('C:/Windows/System32/tar.exe', ['-xf', zipPath, '-C', out], { windowsHide: true });
      p.once('close', done);
      p.once('error', () => done(-1));
    });
    assert.equal(exit, 0, 'bsdtar 解包失败');
    const extracted = readdirSync(out).sort();
    assert.deepEqual(extracted, files.map(f => f.name).sort());
    for (const file of files) {
      assert.equal(readFileSync(join(out, file.name), 'utf8'), file.content, `${file.name} 内容不一致`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('i18n：t 回退与 uiText 全部模式族各命中一次', () => {
  setLocale('en');
  assert.equal(t('不存在的键'), '不存在的键');
  assert.equal(t('mentor.questions', { count: 3 }), '3 questions remain for this route. Answer only what could change the first round.');
  const cases = [
    ['当前保存位置：C:\\项目', 'Current save location: C:\\项目'],
    ['判断依据：旧证据已过期', 'Basis: 旧证据已过期'],
    ['从文字暂推：增量挂机/放置。如果不对，请在上方改选。', 'Inferred from your idea: 增量挂机/放置. Change it above if that is wrong.'],
    ['张翼建议（包预设）：活过第一夜。压力要少而精。', 'Zhangyi suggests (包预设): 活过第一夜. 压力要少而精。'],
    ['第 2 条证据类型无效（只能 build / run / playthrough / playtest）。', 'Evidence record 2 has an invalid type. Use build, run, playthrough or playtest.'],
    ['第 3 条证据来源无效（只能 user / ai / log）。', 'Evidence record 3 has an invalid source. Use user, ai or log.'],
    ['已有 3 项确认决定；当前还有 2 项可补，1 项预设暂拟。', '3 confirmed decisions; 2 questions to answer; 1 provisional presets.'],
    ['已有 3 项确认决定；当前还有 2 项可补。', '3 confirmed decisions; 2 questions to answer.'],
    ['已带入 4 道题的答案，点开查看', '4 answers carried forward · expand to view'],
    ['7 次', '7 changes'],
    ['待核对：威胁可读', 'Check: 威胁可读'],
    ['必要题还有 2 项未定', '2 required questions remain'],
    ['包括：首局目标、复用意图。先补足会改变第一份作品的答案。', 'Including: 首局目标、复用意图. Answer these before the first playable build.'],
    ['已交给浏览器下载项目包 v5；保存位置由浏览器决定。', 'Project package v5 sent to your browser downloads.'],
    ['已保存项目包 v5：C:\\pkg', 'Project package v5 saved: C:\\pkg'],
    ['已导入项目记录 v6。请检查当前路线和需复核项。', 'Project v6 imported. Review the route and flagged decisions.'],
    ['“首局目标”只作暂拟，尚非你确认的决定。', '“首局目标” is provisional, not a confirmed decision.'],
    ['已记下“首局目标”。可随时在已带入的决定中查看。', '“首局目标” saved. You can review it among carried-forward decisions.'],
    ['旧答案“活过第一夜”需复核，请重新选择。', 'Review the earlier answer “活过第一夜” and choose again.'],
    ['导入失败：证据应为 1—8 条记录。', 'Import failed: Evidence must contain 1–8 records.'],
    ['导入失败：这个选项与当前项目不匹配。', 'Import failed: This option does not fit the current project.'],
    ['导出失败：未选择文件夹', 'Export failed: 未选择文件夹'],
    ['直接保存失败：服务未连接。可用“浏览器下载”。', 'Direct save failed: 服务未连接. Use browser download.'],
    ['选择窗口未完成：超时。可在右侧粘贴文件夹路径。', 'Folder picker did not finish: 超时. Paste a path instead.'],
    ['目录未选定：不是文件夹', 'Folder not selected: 不是文件夹'],
  ];
  for (const [zh, en] of cases) assert.equal(uiText(zh), en, `模式未命中：${zh}`);
  setLocale('zh-CN');
  assert.equal(uiText('保存项目包'), '保存项目包');
});

test('i18n：运行时骨架词与证据行在英文界面可译', () => {
  setLocale('en');
  assert.equal(uiText('当前：'), 'Now: ');
  assert.equal(uiText(' · 需复核'), ' · needs re-check');
  assert.equal(uiText(' · 缺样本三要素，降级为自述'), ' · missing sample source, size and method; counted as self-report');
  assert.equal(uiText('（依据项目 v5）'), ' (basis: project v5)');
  assert.equal(uiText('构建通过'), 'Build passed');
  assert.equal(uiText('需要重新确认'), ' needs re-confirmation');
  setLocale('zh-CN');
});
