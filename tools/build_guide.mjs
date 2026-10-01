import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(root, 'docs', '产品说明书.md'), 'utf8').replace(/\r/g, '');
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = value => escape(value)
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, name, rawHref) => {
    const href = rawHref === '../nest/studio.html' ? 'studio.html' : rawHref;
    return /^(https?:\/\/|[.\/])/.test(href) ? `<a href="${escape(href)}">${name}</a>` : name;
  })
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>');

const lines = source.split('\n');
const title = lines.shift()?.replace(/^# /, '') || '张翼产品说明书';
const body = [];
const toc = [];
let paragraph = [];
let list = null;
let currentHeading = '';
const flushParagraph = () => {
  if (paragraph.length) body.push(`<p>${inline(paragraph.join(' '))}</p>`);
  paragraph = [];
};
const closeList = () => {
  if (list) body.push(`</${list}>`);
  list = null;
};
for (const line of lines) {
  if (!line.trim()) { flushParagraph(); closeList(); continue; }
  const heading = /^(#{2,3}) (.+)$/.exec(line);
  if (heading) {
    flushParagraph(); closeList();
    const level = heading[1].length;
    if (level === 2) currentHeading = heading[2];
    const id = `part-${toc.length + 1}`;
    if (level === 2) toc.push({ id, title: heading[2] });
    body.push(`<h${level} id="${id}">${inline(heading[2])}</h${level}>`);
    continue;
  }
  const bullet = /^- (.+)$/.exec(line);
  const numbered = /^\d+\. (.+)$/.exec(line);
  if (bullet || numbered) {
    flushParagraph();
    const kind = bullet ? 'ul' : 'ol';
    if (list !== kind) { closeList(); body.push(`<${kind}${kind === 'ol' && currentHeading === '一分钟上手' ? ' class="steps"' : ''}>`); list = kind; }
    body.push(`<li>${inline((bullet || numbered)[1])}</li>`);
    continue;
  }
  if (line.startsWith('> ')) {
    flushParagraph(); closeList();
    body.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
    continue;
  }
  paragraph.push(line);
}
flushParagraph(); closeList();

const arranged = ['<div class="guide-lead">'];
let sectionOpen = false;
let referenceOpen = false;
for (const block of body) {
  if (block.startsWith('<h2 ')) {
    if (referenceOpen) { arranged.push('</details>'); referenceOpen = false; }
    arranged.push(sectionOpen ? '</section>' : '</div>');
    const isReference = block.includes('进阶参考：内容包与证据边界');
    arranged.push(`<section class="guide-section${isReference ? ' guide-reference' : ''}">`, block);
    sectionOpen = true;
    if (isReference) { arranged.push('<details><summary>展开内容包细节与证据边界</summary>'); referenceOpen = true; }
  } else arranged.push(block);
}
if (referenceOpen) arranged.push('</details>');
arranged.push(sectionOpen ? '</section>' : '</div>');

const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="assets/zhangyi/logo.ico" sizes="any"><link rel="icon" type="image/png" href="assets/zhangyi/logo-64.png">
<title>${escape(title)} · 张翼</title><style>
:root{--canvas:#151d21;--paper:#fffdf7;--ink:#263137;--soft:#586369;--line:#cfd5d0;--red:#b63829;--blue:#263943;font-family:"Microsoft YaHei","PingFang SC","Noto Sans CJK SC",sans-serif;color:var(--ink);background:var(--canvas)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}a{color:#8c2b22;text-underline-offset:3px}a:focus-visible{outline:3px solid #176b8a;outline-offset:3px}.top{background:#10181c;color:#f4f4ec;padding:18px max(4vw,24px);display:flex;align-items:center;gap:18px;border-bottom:4px solid var(--red)}.brand{color:inherit;text-decoration:none;font-weight:700;font-size:19px;display:flex;align-items:center;gap:10px}.mark{display:grid;place-items:center;width:33px;height:33px;border-radius:50%;overflow:hidden;transform:rotate(-4deg);box-shadow:0 2px 0 rgba(0,0,0,.35),0 0 0 1px rgba(217,168,69,.45)}.mark img{width:100%;height:100%;display:block;object-fit:cover}.top nav{margin-left:auto}.top nav a{color:#e9eeee;font-size:13px}.hero{background:#1f2d34;color:#f8f6ee;padding:60px max(4vw,24px) 66px}.hero-inner{max-width:1160px;margin:auto}.hero p{font-size:13px;color:#b9c4c4;margin:0 0 15px}.hero h1{font:700 clamp(38px,5vw,67px)/1.2 "Noto Serif CJK SC","Songti SC",serif;margin:0;max-width:820px;color:#f2efe6}.hero a{display:inline-block;background:var(--red);color:white;padding:13px 20px;margin-top:30px;text-decoration:none;font-weight:700}.layout{max-width:1220px;margin:0 auto;padding:43px 24px 90px;display:grid;grid-template-columns:225px minmax(0,1fr);gap:42px;align-items:start}.toc{position:sticky;top:24px;border-top:3px solid var(--red);padding-top:16px}.toc strong{font-size:13px;color:#f2efe6}.toc a{display:block;padding:9px 0;color:#a9b6b6;text-decoration:none;font-size:12px;line-height:1.5;border-bottom:1px solid #2c3a40}.toc a:hover{color:#e0765f}article{background:var(--paper);border:1px solid var(--line);padding:clamp(24px,4vw,58px);box-shadow:0 4px 0 rgba(0,0,0,.35);line-height:1.85;font-size:14px}article>*{max-width:760px}article h2{font:700 26px/1.4 "Noto Serif CJK SC","Songti SC",serif;margin:45px 0 15px;padding-top:13px;border-top:2px solid var(--blue);scroll-margin-top:20px}article h3{font-size:18px;margin:30px 0 10px}article p{margin:0 0 18px}article blockquote{margin:0 0 24px;padding:12px 17px;border-left:4px solid var(--red);background:#f3eee5;color:var(--soft)}article ul,article ol{padding-left:1.55em;margin:0 0 24px}article li{margin:7px 0}article li::marker{color:var(--red)}article code{font:13px/1.6 Consolas,monospace;background:#edf1ee;padding:2px 5px;overflow-wrap:anywhere}article strong{color:var(--blue)}article h2:first-of-type{margin-top:32px}footer{text-align:center;padding:0 20px 35px;color:var(--soft);font-size:12px}@media(max-width:820px){.layout{grid-template-columns:minmax(0,1fr);padding:20px 15px 60px;gap:20px}.toc{position:static;display:flex;gap:8px;flex-wrap:wrap}.toc strong{width:100%}.toc a{border:1px solid var(--line);padding:7px 9px}.hero{padding:40px 20px 45px}article{padding:25px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
/* 外壳 HUD 皮肤（v0.4.7 三页统一；只加装饰，不动正文排版与打印） */
html::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(214,232,235,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(214,232,235,.045) 1px,transparent 1px);background-size:30px 30px,30px 30px;-webkit-mask-image:radial-gradient(120% 90% at 50% 0%,#000 35%,transparent 100%);mask-image:radial-gradient(120% 90% at 50% 0%,#000 35%,transparent 100%)}
body{position:relative;z-index:1}
.top{position:relative;background:linear-gradient(180deg,#0d181c,#0a1216);border-bottom:1px solid #2f4148;font-family:ui-monospace,"Cascadia Mono",Consolas,monospace;letter-spacing:.04em}
.top::before{content:"";position:absolute;left:0;right:0;bottom:2px;height:1px;background:linear-gradient(90deg,transparent,var(--red) 12%,var(--red) 88%,transparent);opacity:.85}
.top::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:5px;pointer-events:none;background-image:repeating-linear-gradient(90deg,#2f4148 0 1px,transparent 1px 14px);opacity:.5}
.hero{position:relative;background:linear-gradient(180deg,#22323a,#1a262c)}
.hero::before{content:"";position:absolute;left:max(4vw,24px);top:34px;width:46px;height:2px;background:var(--red)}
.toc{font-family:ui-monospace,"Cascadia Mono",Consolas,monospace}
.toc a{letter-spacing:.02em}
article{position:relative}
article::after{content:"";position:absolute;right:0;top:0;width:14px;height:14px;pointer-events:none;background:linear-gradient(90deg,transparent 0 9px,#c9b39a 9px 14px) 0 0/14px 1px no-repeat,linear-gradient(180deg,#c9b39a 0 5px,transparent 5px) 0 0/1px 14px no-repeat}
footer{font-family:ui-monospace,"Cascadia Mono",Consolas,monospace;letter-spacing:.06em;border-top:1px solid #22303760;margin:0 max(3vw,22px);padding-top:16px}
*{scrollbar-width:thin;scrollbar-color:#3d4f56 #121a1e}
*::-webkit-scrollbar{width:10px;height:10px}*::-webkit-scrollbar-track{background:#121a1e}*::-webkit-scrollbar-thumb{background:#394a51;border:2px solid #121a1e}*::-webkit-scrollbar-thumb:hover{background:#4a8494}
.hero{padding-top:38px;padding-bottom:42px}.hero h1{font-size:clamp(38px,4.2vw,57px)}.hero-path{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.hero-path span{border:1px solid #567078;background:#1a2a30;padding:7px 11px;color:#cfe1df;font:12px/1.3 ui-monospace,Consolas,monospace}.hero-path span::first-letter{color:#e27c68}.hero a{margin-top:20px}
.guide-lead{padding:0 0 16px;border-bottom:1px solid #d4dad2;margin-bottom:24px}.guide-lead p:first-child{font-size:18px;line-height:1.75;color:#20323a}.guide-section{padding:8px 0 22px;content-visibility:auto;contain-intrinsic-size:auto 520px}.guide-section+.guide-section{border-top:1px solid #e2e3dc}.guide-section h2{border-top:0;margin-top:20px;padding-top:0}.guide-section h2::before{content:"";display:block;width:34px;height:3px;background:var(--red);margin-bottom:12px}.steps{list-style:none;counter-reset:guide-step;padding:0!important;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px;margin:22px 0 30px!important}.steps li{position:relative;counter-increment:guide-step;margin:0;background:#f5f3eb;border:1px solid #d9dbd0;border-left:3px solid #a93c2f;padding:22px 19px 20px 56px;line-height:1.72}.steps li::before{content:counter(guide-step,decimal-leading-zero);position:absolute;left:16px;top:20px;color:#aa3d31;font:700 21px/1 ui-monospace,Consolas,monospace}.steps li:last-child{grid-column:1/-1}.guide-reference{background:#f7f7f1;border:1px solid #d4d9d1;padding:20px 24px;margin:20px -24px}.guide-reference h2{margin:0 0 10px}.guide-reference details{border-top:1px solid #d4d9d1;padding-top:10px}.guide-reference summary{cursor:pointer;list-style:none;color:#8c2b22;font-weight:700;padding:8px 0}.guide-reference summary::before{content:"+ ";font:700 19px ui-monospace,Consolas,monospace}.guide-reference details[open] summary::before{content:"− "}.guide-reference details>p{max-width:760px}.guide-reference details>p:first-of-type{color:var(--soft);font-size:13px}.guide-section li{max-width:760px}.guide-section p{overflow-wrap:anywhere}.toc a{transition:color .15s ease,padding-left .15s ease}.toc a:hover{padding-left:5px}@media(max-width:820px){.steps{grid-template-columns:1fr}.steps li:last-child{grid-column:auto}.guide-reference{margin:16px -10px;padding:16px}.guide-lead p:first-child{font-size:16px}}@media print{.hero-path,.toc{display:none}.guide-reference details{display:block}.guide-reference details>*{display:block}article{box-shadow:none;border:0}.guide-section{content-visibility:visible}}
</style></head><body><header class="top"><a class="brand" href="studio.html"><span class="mark"><img src="assets/zhangyi/logo-64.png" alt="张翼徽章：金环白底上的金翼，翼尖五根红色羽毛"></span>张翼工作台</a><nav><a href="studio.html">回到工作台</a></nav></header>
<div class="hero"><div class="hero-inner"><p>给第一次想做游戏的人</p><h1>${escape(title)}</h1><div class="hero-path" aria-label="工作台步骤"><span>01 理清想法</span><span>02 审方案</span><span>03 派活验收</span></div><a href="studio.html">打开工作台</a></div></div>
<main class="layout"><nav class="toc" aria-label="本页目录"><strong>阅读目录</strong>${toc.map(item => `<a href="#${item.id}">${escape(item.title)}</a>`).join('')}</nav><article>${arranged.join('\n')}</article></main><footer>—— 张翼 Spread the Pinions · 产品说明书</footer></body></html>
`;
writeFileSync(resolve(root, 'nest', 'guide.html'), html, 'utf8');
process.stdout.write(`已生成 nest/guide.html（${Buffer.byteLength(html)} 字节）\n`);
