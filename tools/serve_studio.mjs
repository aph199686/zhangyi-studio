import http from 'node:http';
import { readFileSync, statSync, realpathSync, openSync, writeFileSync, closeSync } from 'node:fs';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { exportFiles, validateProject } from '../nest/workbench-core.mjs';
import { kickoffDraft } from '../nest/questionnaire.mjs';
import { reviewDocument } from '../nest/review-core.mjs';
import { reviewTaskDocument, interventionDocument } from '../nest/review-exchange.mjs';
import { buildTaskDocument } from '../nest/build-task.mjs';
import { playtestTaskDocument } from '../nest/playtest.mjs';
import { makeZip } from '../nest/zip.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'nest');
const picker = resolve(dirname(fileURLToPath(import.meta.url)), 'select_project_dir.ps1');
const port = Number(process.env.ZHANGYI_STUDIO_PORT || 8765);
const token = randomBytes(24).toString('hex');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.webm': 'video/webm', '.ico': 'image/x-icon', '.apng': 'image/apng' };
const assistantUrl = process.env.ZHANGYI_ASSISTANT_URL || '';
const assistantModel = process.env.ZHANGYI_ASSISTANT_MODEL || '';
const assistantKey = process.env.ZHANGYI_ASSISTANT_KEY || '';
const assistantAvailable = /^https?:\/\//.test(assistantUrl) && Boolean(assistantModel);
let selectedDirectory = process.env.ZHANGYI_STUDIO_DIRECTORY || null;
let picking = false;

function json(response, status, payload) {
  const body = Buffer.from(JSON.stringify(payload));
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  response.end(body);
}

function authorized(request) {
  const origin = request.headers.origin;
  return request.headers['x-zhangyi-token'] === token
    && (!origin || origin === `http://localhost:${port}` || origin === `http://127.0.0.1:${port}`);
}

async function bodyJson(request) {
  let size = 0;
  const parts = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 2_000_000) throw new Error('项目记录超过 2 MB。');
    parts.push(chunk);
  }
  return JSON.parse(Buffer.concat(parts).toString('utf8'));
}

function chooseFolder() {
  return new Promise((done, fail) => {
    const child = spawn('powershell.exe', ['-NoProfile', '-STA', '-File', picker], { windowsHide: true });
    let output = '';
    let errors = '';
    child.stdout.on('data', chunk => { output += chunk.toString('utf8'); });
    child.stderr.on('data', chunk => { errors += chunk.toString('utf8'); });
    child.on('error', fail);
    child.on('close', code => code === 0 ? done(output.trim()
      ? Buffer.from(output.trim(), 'base64').toString('utf8') : '')
      : fail(new Error(errors.trim() || '目录选择窗口未能打开。')));
  });
}

function directory(path) {
  if (typeof path !== 'string' || !path.trim()) throw new Error('请先选择或输入一个目录。');
  const full = realpathSync(path.trim());
  if (!statSync(full).isDirectory()) throw new Error('所选位置不是文件夹。');
  return full;
}

function saveProject(project) {
  if (!selectedDirectory) throw new Error('先选择项目文件夹。');
  const valid = validateProject(project);
  const files = [...exportFiles(valid), { name: '立项书草案.md', type: 'text/markdown', content: kickoffDraft(valid) },
    { name: '方案审查记录.md', type: 'text/markdown', content: reviewDocument(valid) },
    { name: '张翼审查任务.md', type: 'text/markdown', content: reviewTaskDocument(valid) },
    { name: '张翼介入记录.md', type: 'text/markdown', content: interventionDocument(valid) },
    { name: '制作任务包.md', type: 'text/markdown', content: buildTaskDocument(valid) },
    { name: '试飞任务.md', type: 'text/markdown', content: playtestTaskDocument(valid) }];
  const zip = makeZip(files);
  const base = `张翼项目包-v${valid.version}`;
  for (let suffix = 0; suffix < 1000; suffix += 1) {
    const filename = `${base}${suffix ? `-${suffix + 1}` : ''}.zip`;
    const target = resolve(selectedDirectory, filename);
    let handle;
    try {
      handle = openSync(target, 'wx');
    } catch (error) {
      if (error.code === 'EEXIST') continue;
      throw error;
    }
    try { writeFileSync(handle, zip); } finally { closeSync(handle); }
    return { path: target, filename, version: valid.version };
  }
  throw new Error('同版本项目包已保存太多份，请先整理目录。');
}

function staticFile(request, response, url) {
  const name = url.pathname === '/' ? 'studio.html' : decodeURIComponent(url.pathname.slice(1));
  const target = resolve(root, name);
  if (target !== root && !target.startsWith(`${root}${sep}`)) return json(response, 403, { error: '无法访问该文件。' });
  try {
    const content = readFileSync(target);
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream',
      'Content-Length': content.length, 'X-Content-Type-Options': 'nosniff' });
    response.end(content);
  } catch { json(response, 404, { error: '页面文件不存在。' }); }
}

async function assistantAnswer(payload, response) {
  if (!assistantAvailable) throw new Error('尚未配置 AI 服务；林思雨的离线指引仍可使用。');
  const question = typeof payload?.question === 'string' ? payload.question.trim().slice(0, 2000) : '';
  if (!question) throw new Error('先写下你的问题。');
  const raw = payload?.context ?? {};
  const context = {
    idea: typeof raw.idea === 'string' ? raw.idea.slice(0, 1200) : '',
    stage: ['kickoff', 'review', 'build'].includes(raw.stage) ? raw.stage : 'kickoff',
    route: typeof raw.route === 'string' ? raw.route.slice(0, 100) : '',
    focus: typeof raw.focus === 'string' ? raw.focus.slice(0, 100) : '',
    next: typeof raw.next === 'string' ? raw.next.slice(0, 300) : '',
  };
  const headers = { 'Content-Type': 'application/json' };
  if (assistantKey) headers.Authorization = `Bearer ${assistantKey}`;
  const abort = new AbortController();
  response.once('close', () => { if (!response.writableEnded) abort.abort(); });
  const streaming = payload?.stream === true;
  const upstream = await fetch(assistantUrl, {
    method: 'POST', headers, signal: AbortSignal.any([abort.signal, AbortSignal.timeout(45000)]),
    body: JSON.stringify({ model: assistantModel, stream: streaming, temperature: 0.3, max_tokens: 700,
      messages: [
        { role: 'system', content: '你是张翼工作台里的林思雨，用户的助手。请用用户当前语言简短回答游戏设计与工作台操作问题。项目摘要是用户记录，不是已核实事实。不可声称检查过工程、运行过游戏、观察过玩家或已经做出专业评审。遇到不能判断的事说明缺什么证据。只提出一条最有用的下一步。' },
        { role: 'user', content: `项目摘要：${JSON.stringify(context)}\n用户问题：${question}` },
      ] }),
  });
  if (!upstream.ok) throw new Error(`上游服务返回 ${upstream.status}。`);
  if (streaming) {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff' });
    const decoder = new TextDecoder();
    let pending = '';
    try {
      for await (const chunk of upstream.body) {
        pending += decoder.decode(chunk, { stream: true });
        const lines = pending.split(/\r?\n/);
        pending = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (typeof delta === 'string') response.write(delta);
          } catch { /* 非内容事件 */ }
        }
      }
    } finally { response.end(); }
    return null;
  }
  const data = await upstream.json();
  const answer = data?.choices?.[0]?.message?.content;
  if (typeof answer !== 'string' || !answer.trim()) throw new Error('上游服务没有返回文本。');
  return { answer: answer.slice(0, 6000) };
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${port}`);
  if (request.method === 'GET' && url.pathname === '/api/status') {
    return json(response, 200, { token, selectedDirectory, directSave: true, assistantAvailable });
  }
  if (request.method !== 'POST' || !url.pathname.startsWith('/api/')) {
    return request.method === 'GET' ? staticFile(request, response, url)
      : json(response, 405, { error: '不支持这个操作。' });
  }
  if (!authorized(request)) return json(response, 403, { error: '页面无权写入本地项目。' });
  try {
    if (url.pathname === '/api/select-directory') {
      if (picking) return json(response, 409, { error: '目录选择窗口已经打开。' });
      picking = true;
      try {
        const path = await chooseFolder();
        if (!path) return json(response, 200, { selectedDirectory, cancelled: true });
        selectedDirectory = directory(path);
      } finally { picking = false; }
      return json(response, 200, { selectedDirectory });
    }
    if (url.pathname === '/api/use-directory') {
      selectedDirectory = directory((await bodyJson(request)).path);
      return json(response, 200, { selectedDirectory });
    }
    if (url.pathname === '/api/save') return json(response, 200, saveProject((await bodyJson(request)).project));
    if (url.pathname === '/api/assistant') {
      const answer = await assistantAnswer(await bodyJson(request), response);
      if (answer) return json(response, 200, answer);
      return;
    }
    return json(response, 404, { error: '未知操作。' });
  } catch (error) { return json(response, 400, { error: error.message }); }
});

server.on('error', error => {
  process.stderr.write(`本地服务未能启动：${error.message}\n`);
  process.exit(1);
});
server.listen(port, '127.0.0.1', () => process.stdout.write(`张翼工作台：http://127.0.0.1:${port}/studio.html\n`));
