// Tip 6 (15.0–17.5): GOT ALL THE CONTEXT? / LET YOUR LLM STRUCTURE IT.
// Tip 5's orange line (y 1410) pulls into a big torn "YOUR LLM" tag (bottom-right of a 2×2), and three hand-drawn
// arrows grow out of it to where three big cards land (REFERENCES, CAMERA, AUDIO). The cards then slide along the
// arrows into the tag (fast exit, slow arrival, 0.15 s stagger), and the tag morphs into a full-width SEEDANCE PROMPT
// sheet whose bars fill row by row. Exit: the sheet drops down out of frame.
import { E, el, place, img, tape, svg, path, rng, tipHeadline } from '../core.js';

export const meta = { box: { lines: ['LET YOUR LLM', 'STRUCTURE IT.'] } };

const LINE_Y = 1410, LX1 = 64, LX2 = 940;            // same line as t5's exit
const CW = 380, CH = 340;
const SLOTS = [{ x: 64, y: 792 }, { x: 560, y: 792 }, { x: 64, y: 1218 }]; // REFERENCES, CAMERA, AUDIO
const TAG = { x: 560, y: 1262, w: 380, h: 250 };      // YOUR LLM (centre 750, 1387)
const TC = { x: TAG.x + TAG.w / 2, y: TAG.y + TAG.h / 2 };
const SHEET = { x: 64, y: 792, w: 876, h: 766 };

// arrows: start at the card edge, end (head) on the tag edge
const ARROWS = [
  { x1: 420, y1: 1118, x2: 588, y2: 1272, bow: 0.18 },
  { x1: 750, y1: 1142, x2: 750, y2: 1254, bow: 0.0 },
  { x1: 452, y1: 1388, x2: 548, y2: 1388, bow: -0.25 },
].map(a => { const mx = (a.x1 + a.x2) / 2, my = (a.y1 + a.y2) / 2, dx = a.x2 - a.x1, dy = a.y2 - a.y1; return { ...a, cx: mx - dy * a.bow, cy: my + dx * a.bow }; });
const qpt = (a, u) => ({ x: (1 - u) ** 2 * a.x1 + 2 * u * (1 - u) * a.cx + u * u * a.x2, y: (1 - u) ** 2 * a.y1 + 2 * u * (1 - u) * a.cy + u * u * a.y2 });

const LAND = [15.25, 15.35, 15.45], LAND_D = 0.45;
const GO = [15.85, 16.0, 16.15], GO_D = 0.45;
const MORPH = 16.15, LIFT = 17.1;
const clamp01 = v => Math.max(0, Math.min(1, v));

function torn(e, seed, n = 16, d = 10) {
  const r = rng(seed), pts = [];
  for (let i = 0; i <= n; i++) pts.push(`${(i / n * 100).toFixed(1)}% ${(r() * d).toFixed(1)}px`);
  for (let i = 1; i < 6; i++) pts.push(`calc(100% - ${(r() * 5).toFixed(1)}px) ${(i / 6 * 100).toFixed(1)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n * 100).toFixed(1)}% calc(100% - ${(r() * d).toFixed(1)}px)`);
  for (let i = 5; i > 0; i--) pts.push(`${(r() * 5).toFixed(1)}px ${(i / 6 * 100).toFixed(1)}%`);
  e.style.clipPath = `polygon(${pts.join(',')})`;
}

function card(parent, title) {
  const c = el('div', 'card', { width: CW + 'px', height: CH + 'px', visibility: 'hidden' }, parent);
  tape(c, { x: CW / 2 - 75, y: -20, rot: -3 });
  el('div', 'label', { position: 'absolute', left: '26px', top: '30px', fontSize: '30px', letterSpacing: '.14em' }, c, title);
  const ul = el('div', '', { position: 'absolute', left: '26px', top: '72px', width: (CW - 52) + 'px', height: '6px', background: 'var(--orange)', transformOrigin: '0 50%' }, c);
  return { c, ul };
}

export function build(ctx) {
  const { tl, layer, s, e, onFrame } = ctx;
  tipHeadline(ctx, ['GOT ALL THE', 'CONTEXT?']);

  // ---- tip 5's line: both halves pull into the tag centre ----
  const ls = svg(layer, {});
  [[LX1 + 4, TC.x], [TC.x, LX2 - 4]].forEach(([a, b]) => {
    const p = path(ls, `M${a} ${LINE_Y} L${b} ${LINE_Y}`, { stroke: 'var(--orange)', width: 8 });
    gsap.set(p, { opacity: 0, svgOrigin: `${TC.x} ${LINE_Y}` });
    tl.set(p, { opacity: 1 }, 15.0);
    tl.to(p, { scaleX: 0, duration: 0.3, ease: E.move }, 15.02);
    tl.set(p, { opacity: 0 }, 15.33);
  });

  // ---- arrows: grow out of the tag towards the cards (per frame) ----
  const arrs = ARROWS.map(a => {
    const shaft = path(ls, `M${a.x1} ${a.y1} Q${a.cx} ${a.cy} ${a.x2} ${a.y2}`, { stroke: 'var(--orange)', width: 10 });
    const ang = Math.atan2(a.y2 - a.cy, a.x2 - a.cx), hl = 30;
    const head = path(ls, `M${a.x2 + Math.cos(ang + 2.6) * hl} ${a.y2 + Math.sin(ang + 2.6) * hl} L${a.x2} ${a.y2} L${a.x2 + Math.cos(ang - 2.6) * hl} ${a.y2 + Math.sin(ang - 2.6) * hl}`, { stroke: 'var(--orange)', width: 10 });
    const L = shaft.getTotalLength();
    shaft.style.strokeDasharray = `${L} ${L + 4}`;
    return { shaft, head, L };
  });

  // ---- cards ----
  const ref = card(layer, 'REFERENCES');
  [['pin3', 22, 98, -6, 176, 132], ['location', 186, 112, 5, 172, 124], ['city-car', 86, 196, -2, 214, 132]].forEach(([src, x, y, rot, w, h], i) => {
    const m = el('div', '', { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', background: '#F6F1E8', padding: '8px', boxSizing: 'border-box', boxShadow: '0 6px 12px -4px rgba(40,25,10,.4)' }, ref.c);
    const ph = el('div', '', { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }, m);
    img(src, ph, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' });
    gsap.set(m, { rotation: rot });
    tl.fromTo(m, { scale: 0, rotation: rot - 20 }, { scale: 1, rotation: rot, duration: 0.3, ease: E.pop, immediateRender: true }, LAND[0] + 0.12 + i * 0.08);
  });
  const cam = card(layer, 'CAMERA');
  const cs = svg(cam.c, { x: 0, y: 80, w: CW, h: CH - 90, vb: '20 96 244 196' });
  path(cs, 'M80 150 H108 L120 128 H164 L176 150 H204 Q216 150 216 162 V256 Q216 268 204 268 H80 Q68 268 68 256 V162 Q68 150 80 150 Z', { stroke: '#111', width: 8 });
  const lens = path(cs, 'M142 174 a34 34 0 1 0 0.01 0 Z', { stroke: '#111', width: 8 });
  path(cs, 'M86 172 h18', { stroke: '#111', width: 7 });
  const orbit = path(cs, 'M40 262 C20 170 86 112 148 116 C210 120 252 156 250 214', { stroke: 'var(--orange)', width: 8 });
  const orbitHead = path(cs, 'M234 196 L250 216 L266 194', { stroke: 'var(--orange)', width: 8 });
  const oL = orbit.getTotalLength(); orbit.style.strokeDasharray = `${oL} ${oL + 4}`; orbitHead.style.strokeDasharray = '60 62';
  tl.fromTo(orbit, { strokeDashoffset: oL }, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.inOut', immediateRender: true }, LAND[1] + 0.18);
  tl.fromTo(orbitHead, { strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: 0.1, immediateRender: true }, LAND[1] + 0.51);
  tl.fromTo(lens, { scale: 0.5, svgOrigin: '142 208' }, { scale: 1, svgOrigin: '142 208', duration: 0.3, ease: E.pop, immediateRender: true }, LAND[1] + 0.2);
  const aud = card(layer, 'AUDIO');
  const au = svg(aud.c, { x: 0, y: 80, w: 150, h: CH - 90, vb: '20 96 100 186' });
  path(au, 'M44 122 Q44 104 62 104 H70 Q88 104 88 122 V188 Q88 206 70 206 H62 Q44 206 44 188 Z', { stroke: '#111', width: 8, fill: '#111' });
  path(au, 'M28 176 Q28 232 66 232 Q104 232 104 176 M66 232 V262 M44 268 H88', { stroke: '#111', width: 8 });
  const wbars = [];
  for (let i = 0; i < 9; i++) wbars.push(el('div', '', { position: 'absolute', left: (166 + i * 22) + 'px', top: '208px', width: '13px', height: '140px', marginTop: '-70px', borderRadius: '7px', background: i % 3 === 1 ? 'var(--orange)' : '#2B2723' }, aud.c));
  const cards = [ref, cam, aud];
  cards.forEach(({ ul }, i) => tl.fromTo(ul, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out', immediateRender: true }, LAND[i] + 0.2));

  // ---- the tag, which becomes the sheet ----
  const shWrap = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', filter: 'drop-shadow(0 14px 16px rgba(40,25,10,.32))', zIndex: 4, transformOrigin: '502px 1175px' }, layer);
  const sh = el('div', 'abs', { background: '#ECE2D0', overflow: 'hidden' }, shWrap);
  place(sh, TAG); torn(sh, 606);
  const tagTxt = el('div', 'hand', { position: 'absolute', left: 0, top: 0, width: TAG.w + 'px', height: TAG.h + 'px', fontSize: '92px', lineHeight: '0.95', whiteSpace: 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '8px', boxSizing: 'border-box' }, sh, 'YOUR<br>LLM');
  gsap.set(shWrap, { opacity: 0 });
  tl.fromTo(shWrap, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none', immediateRender: false }, 15.02);
  tl.fromTo(sh, { scale: 0.3, rotation: -12 }, { scale: 1, rotation: -1.5, duration: 0.42, ease: E.pop, immediateRender: true }, 15.02);
  GO.forEach(g => tl.fromTo(sh, { scale: 1.06 }, { scale: 1, duration: 0.2, ease: 'power2.out', immediateRender: false }, g + 0.2));
  // morph: text leaves first (no ghosting), then the tag grows into the sheet
  tl.to(tagTxt, { opacity: 0, scale: 0.7, duration: 0.1, ease: E.leave }, MORPH - 0.02);
  tl.set(tagTxt, { visibility: 'hidden' }, MORPH + 0.08);
  tl.to(sh, { left: SHEET.x, top: SHEET.y, width: SHEET.w, height: SHEET.h, rotation: 0.5, backgroundColor: '#F7F2E9', duration: 0.42, ease: E.land }, MORPH);
  const content = el('div', '', { position: 'absolute', left: 0, top: 0, width: SHEET.w + 'px', height: SHEET.h + 'px', opacity: 0 }, sh);
  const ds = svg(content, { x: 64, y: 60, w: 88, h: 110, vb: '0 0 64 80' });
  path(ds, 'M6 4 H42 L58 20 V76 H6 Z M42 4 V20 H58', { stroke: '#111', width: 5 });
  path(ds, 'M16 38 H48 M16 50 H48 M16 62 H38', { stroke: 'var(--orange)', width: 5 });
  el('div', 'label', { position: 'absolute', left: '180px', top: '92px', fontSize: '52px', letterSpacing: '.1em' }, content, 'SEEDANCE PROMPT');
  const rule = el('div', '', { position: 'absolute', left: '64px', top: '204px', width: '748px', height: '8px', background: 'var(--orange)', transformOrigin: '0 50%' }, content);
  const r = rng(616), rows = [];
  for (let i = 0; i < 7; i++) {
    const row = el('div', '', { position: 'absolute', left: '64px', top: (262 + i * 70) + 'px', width: '748px', height: '38px', transformOrigin: '0 50%' }, content);
    const total = i === 6 ? 0.46 : 0.64 + r() * 0.34;
    const oStart = r() < 0.6 ? 0.1 + r() * 0.4 : -1, oLen = 0.14 + r() * 0.16;
    const segs = oStart < 0 ? [[0, total, '#CFC6B6']] : [[0, oStart, '#CFC6B6'], [oStart + 0.02, Math.min(total, oStart + oLen), 'var(--orange)'], [Math.min(total, oStart + oLen) + 0.02, total, '#CFC6B6']];
    segs.forEach(([a, b, c]) => { if (b - a > 0.02) el('div', '', { position: 'absolute', left: (a * 100) + '%', width: ((b - a) * 100) + '%', top: 0, bottom: 0, borderRadius: '19px', background: c }, row); });
    rows.push(row);
  }
  tl.to(content, { opacity: 1, duration: 0.12, ease: 'none' }, MORPH + 0.16);
  tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: 'power2.out', immediateRender: true }, MORPH + 0.2);
  rows.forEach((row, i) => tl.fromTo(row, { scaleX: 0 }, { scaleX: 1, duration: 0.14, ease: 'power2.out', immediateRender: true }, MORPH + 0.25 + i * 0.08));
  // doc icon nods when the sheet is full, then a 3% push carries the hold
  tl.fromTo(ds, { rotation: 0 }, { rotation: -8, duration: 0.12, yoyo: true, repeat: 1, ease: 'sine.inOut', svgOrigin: '32 76', immediateRender: false }, 16.9);
  tl.fromTo(shWrap, { scale: 1 }, { scale: 1.03, duration: LIFT - MORPH - 0.3, ease: E.soft, immediateRender: false }, MORPH + 0.3);
  // exit: down and out of frame (never up through the text)
  tl.to(sh, { y: 1250, rotation: 6, duration: 0.3, ease: E.fast }, LIFT);

  // ---- per frame: arrows, cards along their arrows, audio bars ----
  const landE = gsap.parseEase('expo.out'), goE = gsap.parseEase('expo.out');
  onFrame(t => {
    ARROWS.forEach((a, i) => {
      const { shaft, head, L } = arrs[i];
      if (t < 15.15 || t >= GO[i] + GO_D) { shaft.style.opacity = 0; head.style.opacity = 0; return; }
      shaft.style.opacity = 1; head.style.opacity = 1;
      if (t < GO[i]) { const g = clamp01((t - 15.15 - i * 0.05) / 0.3), gq = 1 - (1 - g) ** 3; shaft.style.strokeDashoffset = (-L * (1 - gq)).toFixed(1); } // grows from the tag end
      else { const u = goE(clamp01((t - GO[i]) / GO_D)); shaft.style.strokeDashoffset = (-L * u).toFixed(1); }                 // erased behind the card
    });
    cards.forEach(({ c }, i) => {
      const a = ARROWS[i], sl = SLOTS[i];
      if (t < LAND[i] || t >= GO[i] + GO_D) { c.style.visibility = 'hidden'; return; }
      let dx = 0, dy = 0, sc = 1, rot, op = 1;
      if (t < GO[i]) {
        const q = landE(clamp01((t - LAND[i]) / LAND_D));
        const from = [[-420, 40], [420, 40], [-420, 120]][i];
        dx = from[0] * (1 - q); dy = from[1] * (1 - q); sc = 0.85 + 0.15 * q;
        rot = [-2, 2, 1.5][i] + [-10, 10, -8][i] * (1 - q) + 0.5 * Math.sin((t - LAND[i]) * 5 + i);
      } else {
        const q = goE(clamp01((t - GO[i]) / GO_D)), p = qpt(a, q);
        dx = (p.x - a.x1) + (TC.x - a.x2) * q * 0.6; dy = (p.y - a.y1) + (TC.y - a.y2) * q * 0.6;
        sc = 1 - 0.7 * q; rot = [-2, 2, 1.5][i] * (1 - q); op = 1 - clamp01((q - 0.8) / 0.2);
      }
      c.style.visibility = 'visible';
      c.style.left = (sl.x + dx).toFixed(1) + 'px'; c.style.top = (sl.y + dy).toFixed(1) + 'px';
      c.style.transformOrigin = `${a.x1 - sl.x}px ${a.y1 - sl.y}px`;
      c.style.transform = `rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`; c.style.opacity = op.toFixed(3);
    });
    wbars.forEach((b, i) => { const v = 0.3 + 0.7 * Math.abs(Math.sin(t * 9 + i * 1.3) * Math.cos(t * 4.1 + i * 0.7)); b.style.transform = `scaleY(${v.toFixed(3)})`; });
  });
}
