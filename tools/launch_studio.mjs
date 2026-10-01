import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const firstPort = Number(process.env.ZHANGYI_STUDIO_PORT || 8765);

function portIsFree(port) {
  // 与 serve_studio 的实际绑定地址保持一致：探测 0.0.0.0 会漏判"127.0.0.1 已被占用"的情况
  // （Windows 允许通配与具体地址并存绑定，曾导致第二个实例选中被占端口后服务崩溃）。
  return new Promise(done => {
    const probe = createServer();
    probe.once('error', () => done(false));
    probe.listen(port, '127.0.0.1', () => probe.close(() => done(true)));
  });
}

if (!Number.isInteger(firstPort) || firstPort < 1024 || firstPort > 65500) {
  process.stderr.write('工作台端口设置无效。\n');
  process.exit(1);
}

let port;
for (let candidate = firstPort; candidate < Math.min(firstPort + 35, 65536); candidate++) {
  if (await portIsFree(candidate)) { port = candidate; break; }
}
if (!port) {
  process.stderr.write('没有找到可用的本地端口。请关闭多余的工作台窗口后重试。\n');
  process.exit(1);
}

const url = `http://127.0.0.1:${port}/studio.html`;
const server = spawn(process.execPath, [resolve(root, 'tools', 'serve_studio.mjs')], {
  cwd: root,
  env: { ...process.env, ZHANGYI_STUDIO_PORT: String(port) },
  stdio: ['inherit', 'pipe', 'pipe'],
});
server.stderr.pipe(process.stderr);
server.once('error', error => process.stderr.write(`本地服务启动失败：${error.message}\n`));

let ready = false;
createInterface({ input: server.stdout }).on('line', line => {
  process.stdout.write(`${line}\n`);
  if (ready || !line.includes(url)) return;
  ready = true;
  process.stdout.write('请保持此窗口打开。关闭窗口后，工作台页面将无法保存到项目文件夹。\n');
  if (process.env.ZHANGYI_STUDIO_NO_OPEN === '1') return;
  const browser = spawn('powershell.exe', ['-NoProfile', '-Command',
    `Start-Process -FilePath '${url}'`], { windowsHide: true, stdio: 'ignore' });
  browser.once('error', error => process.stderr.write(`浏览器未自动打开：${error.message}。请手动访问 ${url}\n`));
  browser.once('exit', code => {
    if (code !== 0) process.stderr.write(`浏览器未自动打开。请手动访问 ${url}\n`);
  });
});
server.once('exit', code => {
  if (!ready) process.stderr.write('本地服务未能启动，请查看上面的错误信息。\n');
  process.exitCode = code || (ready ? 0 : 1);
});
