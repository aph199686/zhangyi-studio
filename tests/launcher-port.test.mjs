import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const portFree = port => new Promise(done => {
  const probe = createServer();
  probe.once('error', () => done(false));
  probe.listen(port, '127.0.0.1', () => probe.close(() => done(true)));
});

// 回归：探测地址与 serve_studio 的实际绑定地址（127.0.0.1）不一致时，
// Windows 允许通配+具体并存绑定，第二个实例会误判 8765 空闲后崩在 EADDRINUSE。
test('启动器在 127.0.0.1 端口被占用时顺延并正常起服务', { skip: process.platform !== 'win32', timeout: 60_000 }, async () => {
  let base = 0;
  for (let p = 9365; p < 9400; p++) {
    if (await portFree(p) && await portFree(p + 1)) { base = p; break; }
  }
  assert.ok(base, '找不到连续两个空闲端口');

  const occupier = createServer();
  await new Promise(done => occupier.listen(base, '127.0.0.1', done));

  const child = spawn(process.execPath, [resolve(root, 'tools', 'launch_studio.mjs')], {
    env: { ...process.env, ZHANGYI_STUDIO_PORT: String(base), ZHANGYI_STUDIO_NO_OPEN: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let out = '';
  child.stdout.on('data', chunk => { out += chunk; });
  child.stderr.on('data', chunk => { out += chunk; });

  const target = base + 1;
  let alive = false;
  for (let i = 0; i < 80 && !alive; i++) {
    await new Promise(r => setTimeout(r, 250));
    try { alive = (await fetch(`http://127.0.0.1:${target}/studio.html`)).ok; } catch { /* 尚未就绪 */ }
  }
  try {
    assert.ok(alive, `顺延端口 ${target} 未就绪；launcher 输出：${out.slice(0, 500)}`);
    assert.ok(out.includes(`127.0.0.1:${target}/studio.html`), `应打印顺延后的地址；输出：${out.slice(0, 500)}`);
  } finally {
    child.kill();
    // launcher 退出不级联其子服务进程，按监听端口找 PID 清理，避免污染后续测试
    await new Promise(done => {
      const ns = spawn('netstat', ['-ano'], { windowsHide: true });
      let buf = '';
      ns.stdout.on('data', chunk => { buf += chunk; });
      ns.once('close', () => {
        const line = buf.split(/\r?\n/).find(l => l.includes(`:${target} `) && l.includes('LISTENING'));
        if (line) {
          const pid = line.trim().split(/\s+/).pop();
          spawn('taskkill', ['/F', '/PID', pid], { windowsHide: true });
        }
        done();
      });
    });
    await new Promise(done => occupier.close(done));
  }
});
