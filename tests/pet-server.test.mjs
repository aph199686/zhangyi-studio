import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const listen = server => new Promise(done => server.listen(0, '127.0.0.1', () => done(server.address().port)));

test('local pet chat requires a session token and forwards only a short project context', async () => {
  let seen;
  const upstream = createServer(async (request, response) => {
    let body = '';
    for await (const chunk of request) body += chunk;
    seen = { authorization: request.headers.authorization, body: JSON.parse(body) };
    if (seen.body.stream) {
      response.writeHead(200, { 'Content-Type': 'text/event-stream' });
      response.write('data: {"choices":[{"delta":{"content":"先做一局"}}]}\n\n');
      response.end('data: {"choices":[{"delta":{"content":"短局。"}}]}\n\ndata: [DONE]\n\n');
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ choices: [{ message: { content: '先做一局能看到结果的短局。' } }] }));
    }
  });
  const upstreamPort = await listen(upstream);
  const probe = createServer();
  const studioPort = await listen(probe);
  await new Promise(done => probe.close(done));
  const child = spawn(process.execPath, ['tools/serve_studio.mjs'], {
    cwd: root,
    env: { ...process.env, ZHANGYI_STUDIO_PORT: String(studioPort),
      ZHANGYI_ASSISTANT_URL: `http://127.0.0.1:${upstreamPort}/chat/completions`,
      ZHANGYI_ASSISTANT_MODEL: 'test-model', ZHANGYI_ASSISTANT_KEY: 'test-secret' },
    stdio: 'ignore',
  });
  try {
    let status;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      try { status = await (await fetch(`http://127.0.0.1:${studioPort}/api/status`)).json(); break; }
      catch { await new Promise(done => setTimeout(done, 75)); }
    }
    assert.ok(status?.token, 'local server started');
    assert.equal(status.assistantAvailable, true);
    assert.equal(JSON.stringify(status).includes('test-secret'), false);
    const apng = await fetch(`http://127.0.0.1:${studioPort}/assets/lin-siyu/idle.apng`);
    assert.equal(apng.headers.get('content-type'), 'image/apng');
    const denied = await fetch(`http://127.0.0.1:${studioPort}/api/assistant`, { method: 'POST' });
    assert.equal(denied.status, 403);
    const answer = await fetch(`http://127.0.0.1:${studioPort}/api/assistant`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Zhangyi-Token': status.token },
      body: JSON.stringify({ question: '下一步？', context: { idea: '桥上的战棋', stage: 'kickoff', secret: 'should-not-forward' } }),
    });
    assert.equal(answer.status, 200);
    assert.equal((await answer.json()).answer, '先做一局能看到结果的短局。');
    assert.equal(seen.authorization, 'Bearer test-secret');
    assert.equal(seen.body.model, 'test-model');
    assert.ok(seen.body.messages[1].content.includes('桥上的战棋'));
    assert.ok(!seen.body.messages[1].content.includes('should-not-forward'));
    const streamed = await fetch(`http://127.0.0.1:${studioPort}/api/assistant`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Zhangyi-Token': status.token },
      body: JSON.stringify({ question: '下一步？', context: { idea: '桥上的战棋' }, stream: true }),
    });
    assert.equal(streamed.headers.get('content-type'), 'text/plain; charset=utf-8');
    assert.equal(await streamed.text(), '先做一局短局。');
  } finally {
    child.kill();
    await new Promise(done => upstream.close(done));
  }
});
