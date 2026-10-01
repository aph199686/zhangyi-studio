import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'tools', 'select_project_dir.ps1');

// 用异步 spawn 而不是 spawnSync：部分受限环境会拦截同步建进程（spawnSync 直接抛 EBUSY），
// 那会让这条测试假失败、误报"脚本有问题"；异步建进程在这些环境里照常可用。
function run(exe, args) {
  return new Promise(done => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    let guard;
    const finish = value => {
      if (settled) return;
      settled = true;
      clearTimeout(guard);
      done(value);
    };
    let child;
    try {
      child = spawn(exe, args, { windowsHide: true });
    } catch (error) {
      finish({ error });
      return;
    }
    child.stdout.on('data', chunk => { stdout += chunk.toString('utf8'); });
    child.stderr.on('data', chunk => { stderr += chunk.toString('utf8'); });
    child.once('error', error => finish({ error }));
    child.once('close', status => finish({ status, stdout, stderr }));
    guard = setTimeout(() => {
      try { child.kill(); } catch { /* 已自行退出 */ }
      finish({ error: new Error('解析超时（30 秒）') });
    }, 30_000);
  });
}

test('Windows folder picker is UTF-8 BOM encoded and parses in Windows PowerShell', { skip: process.platform !== 'win32' }, async () => {
  const bytes = readFileSync(path);
  assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]);

  const quotedPath = `'${path.replaceAll("'", "''")}'`;
  const command = '$tokens=$null; $errors=$null; '
    + `[System.Management.Automation.Language.Parser]::ParseFile(${quotedPath}, [ref]$tokens, [ref]$errors) | Out-Null; `
    + 'if ($errors.Count) { $errors | Format-List | Out-String; exit 1 }';
  const result = await run('powershell.exe', ['-NoProfile', '-Command', command]);

  const why = result.error
    ? `无法启动 Windows PowerShell（${result.error.code ?? result.error.message}）`
    : (result.stderr || result.stdout);
  assert.equal(result.status, 0, why);
});
