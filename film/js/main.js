// Root timeline: chrome, the persistent orange box, and every scene on one GSAP timeline.
import { W, H, SCENES, DURATION, E, el, place, tipBox, measure } from './core.js';
import * as cover from './scenes/cover.js';
import * as t1 from './scenes/t1.js';
import * as t2 from './scenes/t2.js';
import * as t3 from './scenes/t3.js';
import * as t4 from './scenes/t4.js';
import * as t5 from './scenes/t5.js';
import * as t6 from './scenes/t6.js';
import * as t7 from './scenes/t7.js';
import * as t8 from './scenes/t8.js';
import * as check from './scenes/check.js';
import * as cta from './scenes/cta.js';

const ORDER = [['cover', cover], ['t1', t1], ['t2', t2], ['t3', t3], ['t4', t4], ['t5', t5], ['t6', t6], ['t7', t7], ['t8', t8], ['check', check], ['cta', cta]];
const HEAD = {
  cover: ['FIELD NOTE 01', '01 / 11'], t1: ['TIP 01', '02 / 11'], t2: ['TIP 02', '03 / 11'], t3: ['TIP 03', '04 / 11'], t4: ['TIP 04', '05 / 11'],
  t5: ['TIP 05', '06 / 11'], t6: ['TIP 06', '07 / 11'], t7: ['TIP 07', '08 / 11'], t8: ['TIP 08', '09 / 11'], check: ['FIELD NOTE 10', '10 / 11'], cta: ['FIELD NOTE 11', '11 / 11'],
};

const root = document.getElementById('root');
const stage = document.getElementById('stage');
const frameFns = [];
const master = gsap.timeline({ paused: true });
const drawAll = () => { const t = master.time(); for (const f of frameFns) f(t); };

async function preload() {
  await document.fonts.ready;
  await Promise.all(['900 100px "Archivo PL"', '700 50px "Inter Tight PL"', '600 20px "Inter Tight PL"', '700 40px "Kalam PL"'].map(f => document.fonts.load(f)));
}

function chrome() {
  const c = el('div', '', null, root); c.id = 'chrome';
  const cm = [[40, 40, 'borderTopWidth', 'borderLeftWidth'], [W - 66, 40, 'borderTopWidth', 'borderRightWidth'], [40, H - 66, 'borderBottomWidth', 'borderLeftWidth'], [W - 66, H - 66, 'borderBottomWidth', 'borderRightWidth']];
  cm.forEach(([x, y, a, b]) => { const e = el('div', 'crop', { [a]: '2px', [b]: '2px' }, c); place(e, { x, y }); });
  // header: rolling labels
  const ids = ORDER.map(o => o[0]);
  const L = el('div', 'hdr', null, c); place(L, { x: 64, w: 300 });
  const R = el('div', 'hdr', { textAlign: 'right' }, c); place(R, { x: W - 64 - 200, w: 200 });
  const lr = el('div', 'roll', null, L), rr = el('div', 'roll', null, R);
  ids.forEach(id => { el('div', 'label', null, lr, HEAD[id][0]); el('div', 'label', null, rr, HEAD[id][1]); });
  const rule = el('div', 'rule', null, c); place(rule, { x: 290, y: 164, w: 320 });
  ids.forEach((id, i) => { if (!i) return; const b = SCENES[id][0]; master.to([lr, rr], { y: -30 * i, duration: 0.34, ease: E.move }, b - 0.17); });
  // footer
  const f = el('div', 'label abs', { fontSize: '21px', letterSpacing: '.24em', width: W + 'px', textAlign: 'center' }, c, 'POSSIBLE LABS &nbsp;·&nbsp; FIELD NOTES'); place(f, { x: 0, y: 1822 });
  [[64, 1834, 270], [W - 64 - 270, 1834, 270]].forEach(([x, y, w]) => { const r = el('div', 'rule', null, c); place(r, { x, y, w }); });
  // paper drift keeps the background alive the whole film
  master.fromTo('#paper', { x: 0, y: 0, rotation: 0 }, { x: -40, y: -34, rotation: 0.25, duration: DURATION, ease: 'none' }, 0);
}

// The persistent orange box. Geometry (left/top/width/height) is owned here; scenes may add transforms.
function buildBox(metas) {
  metas.forEach(([, m]) => {
    const b = m.box; if (!b) return;
    if (b.w == null) Object.assign(b, tipBox(b.lines));
    else if (b.fit) b.fs = Math.floor(b.fs * (b.w - 2 * (b.pad ?? 30) - 12) / Math.max(...b.lines.map(l => measure(l, b.fs))));
  });
  const box = el('div', '', null, stage); box.id = 'box';
  const texts = {};
  metas.forEach(([id, m]) => {
    const b = m.box; if (!b) return;
    const t = el('div', 'bt', { fontSize: b.fs + 'px', opacity: 0, ...(b.align ? { alignItems: b.align } : {}), ...(b.pad != null ? { padding: `0 ${b.pad}px` } : {}) }, box, b.lines.join('<br>'));
    texts[id] = t;
  });
  const withBox = metas.filter(([, m]) => m.box);
  const g0 = withBox[0][1].box;
  gsap.set(box, { left: g0.x, top: g0.y, width: g0.w, height: g0.h });
  gsap.set(texts[withBox[0][0]], { opacity: 1 });
  for (let i = 1; i < withBox.length; i++) {
    const [pid] = withBox[i - 1], [id, m] = withBox[i];
    const b = SCENES[id][0], g = m.box, tm = m.boxTiming || {};
    master.to(texts[pid], { opacity: 0, y: -24, duration: 0.18, ease: E.leave }, b - 0.30);
    master.to(box, { left: g.x, top: g.y, width: g.w, height: g.h, duration: tm.morph ?? 0.42, ease: E.move }, b - 0.22 + (tm.morphShift ?? 0));
    master.fromTo(texts[id], { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.4, ease: E.land, immediateRender: false }, b + 0.08 + (tm.textShift ?? 0));
  }
  return { box, texts };
}

async function start() {
  await preload();
  chrome();
  const { box, texts } = buildBox(ORDER.map(([id, mod]) => [id, mod.meta]));
  for (const [id, mod] of ORDER) {
    const [s, e] = SCENES[id];
    const layer = el('div', 'layer', null, stage); layer.dataset.scene = id;
    const pre = mod.meta.pre ?? 0.4, post = mod.meta.post ?? 0.4;
    if (s - pre <= 0) gsap.set(layer, { visibility: 'visible' }); else master.set(layer, { visibility: 'visible' }, s - pre);
    if (id !== 'cta') master.set(layer, { visibility: 'hidden' }, e + post);
    await mod.build({ tl: master, layer, s, e, box, boxText: texts[id], onFrame: f => frameFns.push(f) });
  }
  master.to({}, { duration: DURATION, onUpdate: drawAll }, 0);
  master.set({}, {}, DURATION); // pin duration
  master.eventCallback('onUpdate', drawAll);

  const lab = root.dataset.lab;
  let tl = master;
  if (lab) {
    const [a, b] = lab.split(',').map(Number);
    tl = gsap.timeline({ paused: true });
    tl.add(master.tweenFromTo(a, b, { ease: 'none' }), 0);
  }
  window.__master = master;
  window.__timelines = window.__timelines || {}; window.__timelines.root = tl;
  window.addEventListener('hf-seek', () => drawAll());
  master.seek(0); drawAll();
  window.__ready = true;
}
start();
