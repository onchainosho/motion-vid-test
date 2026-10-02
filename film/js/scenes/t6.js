// Tip 6 (15.0–17.5): GOT ALL THE CONTEXT? / LET YOUR LLM STRUCTURE IT.
// Tip 5's orange line (y 1390) splits into three hand-drawn arrows; three taped cards ride them into the
// torn "YOUR LLM" tag, which unfolds into a SEEDANCE PROMPT sheet whose bars fill line by line.
import { E, el, place, img, hand, tape, svg, path, rng, tipHeadline } from '../core.js';

export const meta = { box: { lines: ['LET YOUR LLM', 'STRUCTURE IT.'] } };

const LINE_Y = 1390;            // same line as t5's exit
const TAG = { x: 540, y: 850 }; // centre of the YOUR LLM tag

// arrows: root on the line -> end at the tag. Same control-point rule as core.arrow().
const ARROWS = [
  { x1: 150, y1: LINE_Y, x2: 428, y2: 884, bow: -0.25, u0: 0.45 },
  { x1: 930, y1: LINE_Y, x2: 652, y2: 884, bow: 0.25, u0: 0.45 },
  { x1: 540, y1: LINE_Y, x2: 540, y2: 912, bow: 0.06, u0: 0.31 },
].map(a => { const mx = (a.x1 + a.x2) / 2, my = (a.y1 + a.y2) / 2, dx = a.x2 - a.x1, dy = a.y2 - a.y1; return { ...a, cx: mx - dy * a.bow, cy: my + dx * a.bow }; });
const qpt = (a, u) => ({ x: (1 - u) ** 2 * a.x1 + 2 * u * (1 - u) * a.cx + u * u * a.x2, y: (1 - u) ** 2 * a.y1 + 2 * u * (1 - u) * a.cy + u * u * a.y2 });

// timing (cards: REFERENCES, CAMERA, AUDIO)
const LAND = [15.15, 15.3, 15.45], LAND_D = 0.45;
const GO = [15.9, 16.0, 16.1], GO_D = 0.35;   // arrive 16.25 / 16.35 / 16.45
const OPEN = 16.5;                             // the tag opens into the sheet on the beat
const LIFT = 17.25;

const clamp01 = v => Math.max(0, Math.min(1, v));

function torn(e, seed) {
  const r = rng(seed), pts = [], n = 10;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n * 100).toFixed(1)}% ${(r() * 8).toFixed(1)}%`);
  for (let i = 0; i <= 5; i++) pts.push(`${(100 - r() * 3).toFixed(1)}% ${(i / 5 * 100).toFixed(1)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n * 100).toFixed(1)}% ${(100 - r() * 8).toFixed(1)}%`);
  for (let i = 5; i >= 0; i--) pts.push(`${(r() * 3).toFixed(1)}% ${(i / 5 * 100).toFixed(1)}%`);
  e.style.clipPath = `polygon(${pts.join(',')})`;
}

function card(parent, title) {
  const c = el('div', 'card', { width: '290px', height: '250px', visibility: 'hidden' }, parent);
  tape(c, { x: 70, y: -18, rot: -3 });
  const h = hand(c, title, { x: 20, y: 18, size: 38, ul: true });
  h.style.position = 'absolute'; h.style.setProperty('--ul', '0%');
  return { c, h };
}

export function build(ctx) {
  const { tl, layer, s, e, onFrame } = ctx;
  tipHeadline(ctx, ['GOT ALL THE', 'CONTEXT?']);

  // ---- tip 5's line, split in three pieces that shrink into the arrow roots ----
  const ls = svg(layer, {});
  const cuts = [64, 345, 735, 1000];
  const segs = [0, 1, 2].map(i => {
    const root = [150, 540, 930][i];
    const p = path(ls, `M${cuts[i] + (i ? 0 : 4)} ${LINE_Y} L${cuts[i + 1] - (i === 2 ? 4 : 0)} ${LINE_Y}`, { stroke: 'var(--orange)', width: 8 });
    p.style.strokeLinecap = i === 0 ? 'round' : 'butt'; if (i === 2) p.style.strokeLinecap = 'round';
    gsap.set(p, { opacity: 0, svgOrigin: `${root} ${LINE_Y}` });
    tl.set(p, { opacity: 1 }, 15.0);
    tl.to(p, { scaleX: 0, duration: 0.35, ease: E.move }, 15.02);
    tl.set(p, { opacity: 0 }, 15.38);
    return p;
  });

  // ---- arrows (fully driven per frame) ----
  const arrs = ARROWS.map(a => {
    const shaft = path(ls, `M${a.x1} ${a.y1} Q${a.cx} ${a.cy} ${a.x2} ${a.y2}`, { stroke: 'var(--orange)', width: 7 });
    const ang = Math.atan2(a.y2 - a.cy, a.x2 - a.cx), hl = 24;
    const head = path(ls, `M${a.x2 + Math.cos(ang + 2.6) * hl} ${a.y2 + Math.sin(ang + 2.6) * hl} L${a.x2} ${a.y2} L${a.x2 + Math.cos(ang - 2.6) * hl} ${a.y2 + Math.sin(ang - 2.6) * hl}`, { stroke: 'var(--orange)', width: 7 });
    const L = shaft.getTotalLength();
    shaft.style.strokeDasharray = `${L} ${L + 4}`; head.style.strokeDasharray = '80 82';
    return { shaft, head, L };
  });

  // ---- the YOUR LLM tag ----
  const tagW = el('div', 'abs', { left: 0, top: 0, filter: 'drop-shadow(0 10px 12px rgba(40,25,10,.35))', zIndex: 4 }, layer);
  const tagE = el('div', '', { background: '#ECE2D0', padding: '18px 34px' }, tagW);
  el('div', 'hand', { fontSize: '54px' }, tagE, 'YOUR LLM');
  torn(tagE, 606);
  const tw = tagE.offsetWidth, th = tagE.offsetHeight;
  place(tagW, { x: TAG.x - tw / 2, y: TAG.y - th / 2 });
  gsap.set(tagW, { rotation: -2, opacity: 0 });
  tl.fromTo(tagW, { opacity: 0, scale: 0.3, rotation: -14 }, { opacity: 1, scale: 1, rotation: -2, duration: 0.4, ease: E.pop, immediateRender: false }, 15.0);
  // gulps each card on arrival
  GO.forEach((g, i) => tl.fromTo(tagW, { scale: 1.12 + 0.03 * i }, { scale: 1, duration: 0.22, ease: 'power2.out', immediateRender: false }, g + GO_D));
  // opens: flips away as the sheet unfolds from it
  tl.to(tagW, { rotationX: 90, opacity: 0, duration: 0.16, ease: 'power2.in' }, OPEN);

  // ---- the cards ----
  const ref = card(layer, 'REFERENCES');
  [['pin3', 16, 88, -7], ['location', 96, 104, 4], ['city-car', 170, 82, -3]].forEach(([src, x, y, rot], i) => {
    const m = el('div', '', { position: 'absolute', left: x + 'px', top: y + 'px', width: '108px', height: '100px', background: '#F6F1E8', padding: '6px', boxSizing: 'border-box', boxShadow: '0 6px 12px -4px rgba(40,25,10,.4)' }, ref.c);
    const ph = el('div', '', { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }, m);
    img(src, ph, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' });
    gsap.set(m, { rotation: rot });
    tl.fromTo(m, { scale: 0, rotation: rot - 20 }, { scale: 1, rotation: rot, duration: 0.3, ease: E.pop, immediateRender: true }, LAND[0] + 0.15 + i * 0.08);
  });
  const cam = card(layer, 'CAMERA');
  const cs = svg(cam.c, { x: 0, y: 0, w: 290, h: 250, vb: '0 0 290 250' });
  path(cs, 'M92 132 H118 L128 116 H162 L172 132 H198 Q206 132 206 140 V206 Q206 214 198 214 H92 Q84 214 84 206 V140 Q84 132 92 132 Z', { stroke: '#111', width: 7 });
  const lens = path(cs, 'M145 150 a24 24 0 1 0 0.01 0 Z', { stroke: '#111', width: 7 });
  path(cs, 'M104 146 h12', { stroke: '#111', width: 6 });
  const orbit = path(cs, 'M58 196 C40 132 96 92 152 98 C204 104 238 132 236 176', { stroke: 'var(--orange)', width: 7 });
  const orbitHead = path(cs, 'M222 160 L236 178 L250 158', { stroke: 'var(--orange)', width: 7 });
  const oL = orbit.getTotalLength(); orbit.style.strokeDasharray = `${oL} ${oL + 4}`; orbitHead.style.strokeDasharray = '50 52';
  tl.fromTo(orbit, { strokeDashoffset: oL }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut', immediateRender: true }, LAND[1] + 0.2);
  tl.fromTo(orbitHead, { strokeDashoffset: 50 }, { strokeDashoffset: 0, duration: 0.12, immediateRender: true }, LAND[1] + 0.58);
  tl.fromTo(lens, { scale: 0.6, svgOrigin: '145 174' }, { scale: 1, svgOrigin: '145 174', duration: 0.3, ease: E.pop, immediateRender: true }, LAND[1] + 0.25);
  const aud = card(layer, 'AUDIO');
  const as = svg(aud.c, { x: 0, y: 0, w: 290, h: 250, vb: '0 0 290 250' });
  path(as, 'M52 96 Q52 84 64 84 H72 Q84 84 84 96 V146 Q84 158 72 158 H64 Q52 158 52 146 Z', { stroke: '#111', width: 7, fill: '#111' });
  path(as, 'M38 136 Q38 176 68 176 Q98 176 98 136 M68 176 V202 M50 206 H86', { stroke: '#111', width: 7 });
  const wbars = [];
  for (let i = 0; i < 9; i++) { const b = el('div', '', { position: 'absolute', left: (124 + i * 16) + 'px', top: '146px', width: '9px', height: '60px', marginTop: '-30px', borderRadius: '5px', background: i % 3 === 1 ? 'var(--orange)' : '#2B2723' }, aud.c); wbars.push(b); }
  const cards = [ref, cam, aud];
  cards.forEach(({ h }, i) => tl.fromTo(h, { '--ul': '0%' }, { '--ul': '100%', duration: 0.3, ease: 'power2.out', immediateRender: true }, LAND[i] + 0.2));

  // ---- the SEEDANCE PROMPT sheet ----
  const SH = { x: 200, y: 744, w: 680, h: 720 };
  const sheet = el('div', 'card', { background: '#F7F2E9', visibility: 'hidden', transformOrigin: `50% ${TAG.y - SH.y}px`, zIndex: 5 }, layer); place(sheet, SH);
  tape(sheet, { x: SH.w / 2 - 75, y: -20, rot: 2 });
  const ds = svg(sheet, { x: 48, y: 52, w: 64, h: 80, vb: '0 0 64 80' });
  path(ds, 'M6 4 H42 L58 20 V76 H6 Z M42 4 V20 H58', { stroke: '#111', width: 5 });
  path(ds, 'M16 38 H48 M16 50 H48 M16 62 H38', { stroke: 'var(--orange)', width: 5 });
  el('div', 'label', { position: 'absolute', left: '134px', top: '72px', fontSize: '34px', letterSpacing: '.14em' }, sheet, 'SEEDANCE PROMPT');
  const rule = el('div', '', { position: 'absolute', left: '48px', top: '160px', width: '584px', height: '5px', background: 'var(--orange)', transformOrigin: '0 50%' }, sheet);
  const r = rng(616), rows = [];
  for (let i = 0; i < 9; i++) {
    const y = 202 + i * 54, row = el('div', '', { position: 'absolute', left: '48px', top: y + 'px', width: '584px', height: '24px', transformOrigin: '0 50%' }, sheet);
    const total = i === 8 ? 0.42 : 0.62 + r() * 0.36;
    const oStart = r() < 0.55 ? 0.12 + r() * 0.4 : -1, oLen = 0.14 + r() * 0.16;
    const segs = oStart < 0 ? [[0, total, '#CFC6B6']] : [[0, oStart, '#CFC6B6'], [oStart + 0.02, Math.min(total, oStart + oLen), 'var(--orange)'], [Math.min(total, oStart + oLen) + 0.02, total, '#CFC6B6']];
    segs.forEach(([a, b, c]) => { if (b - a > 0.02) el('div', '', { position: 'absolute', left: (a * 100) + '%', width: ((b - a) * 100) + '%', top: 0, bottom: 0, borderRadius: '12px', background: c }, row); });
    rows.push(row);
  }
  tl.set(sheet, { visibility: 'visible' }, OPEN + 0.08);
  tl.fromTo(sheet, { scaleX: 0.36, scaleY: 0.1, rotation: -2, opacity: 0.6 }, { scaleX: 1, scaleY: 1, rotation: 0.8, opacity: 1, duration: 0.45, ease: E.land, immediateRender: true }, OPEN + 0.08);
  tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out', immediateRender: true }, OPEN + 0.25);
  rows.forEach((row, i) => tl.fromTo(row, { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: 'power2.out', immediateRender: true }, OPEN + 0.3 + i * 0.05));
  tl.to(sheet, { rotation: -0.6, duration: 0.5, ease: E.soft }, OPEN + 0.55);
  // exit: the sheet lifts up fast
  tl.to(sheet, { y: -1500, rotation: -6, duration: 0.36, ease: E.fast }, LIFT);

  // ---- per-frame: arrows, card travel, audio bars ----
  const landE = gsap.parseEase('expo.out'), goE = gsap.parseEase('power3.in');
  onFrame(t => {
    ARROWS.forEach((a, i) => {
      const { shaft, head, L } = arrs[i];
      // grow out of the line, then erase behind the travelling card
      const grow = clamp01((t - 15.05 - i * 0.04) / 0.4), gq = 1 - (1 - grow) ** 3;
      const g = clamp01((t - GO[i]) / GO_D), uCard = a.u0 + (1 - a.u0) * goE(g);
      const hide = t >= GO[i] ? L * Math.max(0, uCard - 0.08) : 0;
      if (t < 15.05) { shaft.style.opacity = 0; head.style.opacity = 0; return; }
      shaft.style.opacity = g >= 1 ? 0 : 1;
      shaft.style.strokeDashoffset = t >= GO[i] ? -hide : L * (1 - gq);
      head.style.opacity = g >= 0.98 ? 0 : 1;
      head.style.strokeDashoffset = 80 * (1 - clamp01((t - 15.4 - i * 0.04) / 0.1));
    });
    cards.forEach(({ c }, i) => {
      const a = ARROWS[i];
      if (t < LAND[i] || t >= GO[i] + GO_D) { c.style.visibility = 'hidden'; return; }
      let u, sc, rot, op = 1;
      if (t < GO[i]) { const q = landE(clamp01((t - LAND[i]) / LAND_D)); u = 0.02 + (a.u0 - 0.02) * q; sc = 0.3 + 0.7 * q; rot = [-5, 5, -2][i] * (1 - q) + [-3, 3, 1.5][i] + 0.8 * Math.sin((t - LAND[i]) * 4 + i); }
      else { const q = goE(clamp01((t - GO[i]) / GO_D)); u = a.u0 + (1 - a.u0) * q; sc = 1 - 0.85 * q; rot = [-3, 3, 1.5][i] * (1 - q); op = 1 - clamp01((q - 0.75) / 0.25); }
      const p = qpt(a, u);
      c.style.visibility = 'visible';
      c.style.left = (p.x - 145) + 'px'; c.style.top = (p.y - 125) + 'px';
      c.style.transform = `rotate(${rot}deg) scale(${sc})`; c.style.opacity = op;
    });
    wbars.forEach((b, i) => { const v = 0.35 + 0.65 * Math.abs(Math.sin(t * 9 + i * 1.3) * Math.cos(t * 4.1 + i * 0.7)); b.style.transform = `scaleY(${v.toFixed(3)})`; });
  });
}
