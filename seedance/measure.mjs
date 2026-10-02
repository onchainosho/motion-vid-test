// Measures the composition with real fonts loaded and bakes the result into index.html:
//  - fit:   per-line font-stretch (%) so every line fits its column at one type size
//  - rects: each orange box's pixel rect at the moment the orange field leaves or lands on it
// Run after any copy change:  node seedance/measure.mjs
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(dir, 'index.html');
const src = fs.readFileSync(file, 'utf8');
const empty = src.replace(/\/\*LAYOUT\*\/.*?\/\*END\*\//s, '/*LAYOUT*/{"fit":{},"size":{},"rects":{}}/*END*/');
const tmp = path.join(dir, '.measure.html');
fs.writeFileSync(tmp, empty);

const browser = await puppeteer.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--allow-file-access-from-files'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920 });
await page.goto('file://' + tmp, { waitUntil: 'load' });
const layout = await page.evaluate(async () => {
  await document.fonts.ready;
  // one type size per block; condense the width axis no further than 84%, then step the size down
  const fit = {}, size = {};
  const blocks = [...document.querySelectorAll('.hl, .box, .then')];
  blocks.forEach((b, k) => b.dataset.b = k);
  const maxOf = el => el.closest('.box') ? 936 - 12 - 58 : 936;
  const w = el => el.getBoundingClientRect().width;
  for (const b of blocks) {
    const ins = [...b.querySelectorAll('.in')];
    let fs = parseFloat(getComputedStyle(b).fontSize);
    const fitAt = () => ins.every(el => { el.style.fontStretch = '84%'; return w(el) <= maxOf(el); });
    while (!fitAt()) { fs -= 2; b.style.fontSize = fs + 'px'; size[b.dataset.b] = fs; }
    for (const el of ins) {
      el.style.fontStretch = '100%';
      if (w(el) <= maxOf(el)) continue;
      let lo = 84, hi = 100;
      for (let n = 0; n < 12; n++) { const mid = (lo + hi) / 2; el.style.fontStretch = mid + '%'; if (w(el) <= maxOf(el)) lo = mid; else hi = mid; }
      el.style.fontStretch = lo + '%';
      fit[el.dataset.k] = Math.floor(lo * 10) / 10;
    }
  }
  const at = { box0: 2.46, box1: 3.37, box8: 22.96, box9: 23.82, box10: 28.45 };
  const rects = {};
  const tl = window.__timelines.root;
  for (const [id, t] of Object.entries(at)) {
    tl.seek(t, false);
    const r = document.getElementById(id).getBoundingClientRect();
    rects[id] = { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  }
  return { fit, size, rects };
});
await browser.close();
fs.unlinkSync(tmp);
fs.writeFileSync(file, src.replace(/\/\*LAYOUT\*\/.*?\/\*END\*\//s, '/*LAYOUT*/' + JSON.stringify(layout) + '/*END*/'));
console.log(JSON.stringify(layout, null, 1));
