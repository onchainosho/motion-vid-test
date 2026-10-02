// Tip 6 (15.0–17.5): GOT ALL THE CONTEXT? / LET YOUR LLM STRUCTURE IT.
// Tip 5's orange line (y 1400) splits into three hand-drawn arrows that grow up to a big torn "YOUR LLM" tag.
// Three cards (REFERENCES, CAMERA, AUDIO) rise onto the arrows, then slide along them into the tag (fast exit,
// slow arrival, 0.15 s stagger). The tag itself morphs into the SEEDANCE PROMPT sheet, whose bars fill row by row.
import { E, el, place, img, tape, svg, path, rng, tipHeadline } from '../core.js';

export const meta = { box: { lines: ['LET YOUR LLM', 'STRUCTURE IT.'] } };

const LINE_Y = 1400;                                  // same line as t5's exit
const TAG = { x: 330, y: 745, w: 420, h: 150 };       // YOUR LLM tag (centre ≈ 540, 820)
const SHEET = { x: 140, y: 724, w: 800, h: 790 };     // the tag grows into this
const CW = 284, CH = 320;

// arrows: root on the line -> bottom of the tag
const ARROWS = [
  { x1: 206, x2: 432, y2: 902, bow: -0.2 },
  { x1: 532, x2: 540, y2: 908, bow: 0.02 },
  { x1: 858, x2: 648, y2: 902, bow: 0.2 },
].map(a => { const y1 = LINE_Y, mx = (a.x1 + a.x2) / 2, my = (y1 + a.y2) / 2, dx = a.x2 - a.x1, dy = a.y2 - y1; return { ...a, y1, cx: mx - dy * a.bow, cy: my + dx * a.bow }; });
const qpt = (a, u) => ({ x: (1 - u) ** 2 * a.x1 + 2 * u * (1 - u) * a.cx + u * u * a.x2, y: (1 - u) ** 2 * a.y1 + 2 * u * (1 - u) * a.cy + u * u * a.y2 });
const U0 = 0.31;                                      // card centre sits here on its arrow (y ≈ 1250)

const RISE = [15.2, 15.3, 15.4], RISE_D = 0.45;       // cards come up from below onto the arrows
const GO = [15.7, 15.85, 16.0], GO_D = 0.45;          // slide into the tag (expo.out)
const MORPH = 15.95, LIFT = 17.1;
const clamp01 = v => Math.max(0, Math.min(1, v));

// torn outline in px offsets so the edge stays fine at any size
function torn(e, seed, n = 14, d = 9) {
  const r = rng(seed), pts = [];
  for (let i = 0; i <= n; i++) pts.push(`${(i / n * 100).toFixed(1)}% ${(r() * d).toFixed(1)}px`);
  for (let i = 1; i < 6; i++) pts.push(`calc(100% - ${(r() * 4).toFixed(1)}px) ${(i / 6 * 100).toFixed(1)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n * 100).toFixed(1)}% calc(100% - ${(r() * d).toFixed(1)}px)`);
  for (let i = 5; i > 0; i--) pts.push(`${(r() * 4).toFixed(1)}px ${(i / 6 * 100).toFixed(1)}%`);
  e.style.clipPath = `polygon(${pts.join(',')})`;
}

function card(parent, title) {
  const c = el('div', 'card', { width: CW + 'px', height: CH + 'px', visibility: 'hidden', overflow: 'visible' }, parent);
  tape(c, { x: CW / 2 - 75, y: -20, rot: -3 });
  const t = el('div', 'label', { position: 'absolute', left: '22px', top: '30px', fontSize: '27px', letterSpacing: '.14em' }, c, title);
  const ul = el('div', '', { position: 'absolute', left: '22px', top: '68px', width: (CW - 44) + 'px', height: '6px', background: 'var(--orange)', transformOrigin: '0 50%' }, c);
  return { c, t, ul };
}

export function build(ctx) {
  const { tl, layer, s, e, onFrame } = ctx;
  tipHeadline(ctx, ['GOT ALL THE', 'CONTEXT?']);

  // ---- tip 5's line, split into three pieces that shrink into the arrow roots ----
  const ls = svg(layer, {});
  const cuts = [64, 369, 695, 1000];
  [0, 1, 2].forEach(i => {
    const root = ARROWS[i].x1;
    const p = path(ls, `M${cuts[i] + (i === 0 ? 4 : 0)} ${LINE_Y} L${cuts[i + 1] - (i === 2 ? 4 : 0)} ${LINE_Y}`, { stroke: 'var(--orange)', width: 8 });
    p.style.strokeLinecap = i === 1 ? 'butt' : 'round';
    gsap.set(p, { opacity: 0, svgOrigin: `${root} ${LINE_Y}` });
    tl.set(p, { opacity: 1 }, 15.0);
    tl.to(p, { scaleX: 0, duration: 0.35, ease: E.move }, 15.02);
    tl.set(p, { opacity: 0 }, 15.38);
  });

  // ---- arrows (driven per frame) ----
  const arrs = ARROWS.map(a => {
    const shaft = path(ls, `M${a.x1} ${a.y1} Q${a.cx} ${a.cy} ${a.x2} ${a.y2}`, { stroke: 'var(--orange)', width: 9 });
    const ang = Math.atan2(a.y2 - a.cy, a.x2 - a.cx), hl = 30;
    const head = path(ls, `M${a.x2 + Math.cos(ang + 2.6) * hl} ${a.y2 + Math.sin(ang + 2.6) * hl} L${a.x2} ${a.y2} L${a.x2 + Math.cos(ang - 2.6) * hl} ${a.y2 + Math.sin(ang - 2.6) * hl}`, { stroke: 'var(--orange)', width: 9 });
    const L = shaft.getTotalLength();
    shaft.style.strokeDasharray = `${L} ${L + 4}`; head.style.strokeDasharray = '100 102';
    return { shaft, head, L };
  });

  // ---- the cards ----
  const ref = card(layer, 'REFERENCES');
  [['pin3', 14, 92, -6, 150, 112], ['location', 118, 112, 5, 152, 108], ['city-car', 46, 184, -2, 186, 120]].forEach(([src, x, y, rot, w, h], i) => {
    const m = el('div', '', { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', background: '#F6F1E8', padding: '7px', boxSizing: 'border-box', boxShadow: '0 6px 12px -4px rgba(40,25,10,.4)' }, ref.c);
    const ph = el('div', '', { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }, m);
    img(src, ph, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' });
    gsap.set(m, { rotation: rot });
    tl.fromTo(m, { scale: 0, rotation: rot - 20 }, { scale: 1, rotation: rot, duration: 0.3, ease: E.pop, immediateRender: true }, RISE[0] + 0.15 + i * 0.07);
  });
  const cam = card(layer, 'CAMERA');
  const cs = svg(cam.c, { x: 0, y: 0, w: CW, h: CH, vb: `0 0 ${CW} ${CH}` });
  path(cs, 'M80 150 H108 L120 128 H164 L176 150 H204 Q216 150 216 162 V256 Q216 268 204 268 H80 Q68 268 68 256 V162 Q68 150 80 150 Z', { stroke: '#111', width: 8 });
  const lens = path(cs, 'M142 174 a34 34 0 1 0 0.01 0 Z', { stroke: '#111', width: 8 });
  path(cs, 'M86 172 h18', { stroke: '#111', width: 7 });
  const orbit = path(cs, 'M40 262 C20 170 86 112 148 116 C210 120 252 156 250 214', { stroke: 'var(--orange)', width: 8 });
  const orbitHead = path(cs, 'M234 196 L250 216 L266 194', { stroke: 'var(--orange)', width: 8 });
  const oL = orbit.getTotalLength(); orbit.style.strokeDasharray = `${oL} ${oL + 4}`; orbitHead.style.strokeDasharray = '60 62';
  tl.fromTo(orbit, { strokeDashoffset: oL }, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.inOut', immediateRender: true }, RISE[1] + 0.2);
  tl.fromTo(orbitHead, { strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: 0.1, immediateRender: true }, RISE[1] + 0.53);
  tl.fromTo(lens, { scale: 0.5, svgOrigin: '142 208' }, { scale: 1, svgOrigin: '142 208', duration: 0.3, ease: E.pop, immediateRender: true }, RISE[1] + 0.22);
  const aud = card(layer, 'AUDIO');
  const as = svg(aud.c, { x: 0, y: 0, w: CW, h: CH, vb: `0 0 ${CW} ${CH}` });
  path(as, 'M44 122 Q44 104 62 104 H70 Q88 104 88 122 V188 Q88 206 70 206 H62 Q44 206 44 188 Z', { stroke: '#111', width: 8, fill: '#111' });
  path(as, 'M28 176 Q28 232 66 232 Q104 232 104 176 M66 232 V262 M44 268 H88', { stroke: '#111', width: 8 });
  const wbars = [];
  for (let i = 0; i < 8; i++) wbars.push(el('div', '', { position: 'absolute', left: (128 + i * 18) + 'px', top: '185px', width: '11px', height: '110px', marginTop: '-55px', borderRadius: '6px', background: i % 3 === 1 ? 'var(--orange)' : '#2B2723' }, aud.c));
  const cards = [ref, cam, aud];
  cards.forEach(({ ul }, i) => tl.fromTo(ul, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out', immediateRender: true }, RISE[i] + 0.22));

  // ---- the tag, which becomes the sheet ----
  const shWrap = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', filter: 'drop-shadow(0 14px 16px rgba(40,25,10,.32))', zIndex: 4 }, layer);
  const sh = el('div', 'abs', { background: '#ECE2D0', overflow: 'hidden', transformOrigin: '50% 30%' }, shWrap);
  place(sh, TAG); torn(sh, 606);
  const tagTxt = el('div', 'hand', { position: 'absolute', left: 0, top: 0, width: TAG.w + 'px', height: TAG.h + 'px', fontSize: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '8px', boxSizing: 'border-box' }, sh, 'YOUR LLM');
  gsap.set(shWrap, { opacity: 0 });
  tl.fromTo(shWrap, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'none', immediateRender: false }, 14.95);
  tl.fromTo(sh, { scale: 0.3, rotation: -12 }, { scale: 1, rotation: -2, duration: 0.42, ease: E.pop, immediateRender: true }, 14.95);
  // gulps each card as it arrives
  GO.forEach((g, i) => tl.fromTo(sh, { scale: 1.07 }, { scale: 1, duration: 0.2, ease: 'power2.out', immediateRender: false }, g + 0.22));
  // morph: the tag grows straight into the sheet
  tl.to(sh, { left: SHEET.x, top: SHEET.y, width: SHEET.w, height: SHEET.h, rotation: 0.6, backgroundColor: '#F7F2E9', duration: 0.42, ease: E.land }, MORPH);
  tl.to(tagTxt, { opacity: 0, y: -40, duration: 0.14, ease: E.leave }, MORPH);
  // sheet contents (laid out for the final size)
  const content = el('div', '', { position: 'absolute', left: 0, top: 0, width: SHEET.w + 'px', height: SHEET.h + 'px', opacity: 0 }, sh);
  const ds = svg(content, { x: 60, y: 62, w: 80, h: 100, vb: '0 0 64 80' });
  path(ds, 'M6 4 H42 L58 20 V76 H6 Z M42 4 V20 H58', { stroke: '#111', width: 5 });
  path(ds, 'M16 38 H48 M16 50 H48 M16 62 H38', { stroke: 'var(--orange)', width: 5 });
  el('div', 'label', { position: 'absolute', left: '168px', top: '92px', fontSize: '44px', letterSpacing: '.12em' }, content, 'SEEDANCE PROMPT');
  const rule = el('div', '', { position: 'absolute', left: '60px', top: '196px', width: '680px', height: '7px', background: 'var(--orange)', transformOrigin: '0 50%' }, content);
  const r = rng(616), rows = [];
  for (let i = 0; i < 7; i++) {
    const row = el('div', '', { position: 'absolute', left: '60px', top: (252 + i * 72) + 'px', width: '680px', height: '34px', transformOrigin: '0 50%' }, content);
    const total = i === 6 ? 0.46 : 0.64 + r() * 0.34;
    const oStart = r() < 0.6 ? 0.1 + r() * 0.4 : -1, oLen = 0.14 + r() * 0.16;
    const segs = oStart < 0 ? [[0, total, '#CFC6B6']] : [[0, oStart, '#CFC6B6'], [oStart + 0.02, Math.min(total, oStart + oLen), 'var(--orange)'], [Math.min(total, oStart + oLen) + 0.02, total, '#CFC6B6']];
    segs.forEach(([a, b, c]) => { if (b - a > 0.02) el('div', '', { position: 'absolute', left: (a * 100) + '%', width: ((b - a) * 100) + '%', top: 0, bottom: 0, borderRadius: '17px', background: c }, row); });
    rows.push(row);
  }
  tl.to(content, { opacity: 1, duration: 0.15, ease: 'none' }, MORPH + 0.12);
  tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: 'power2.out', immediateRender: true }, MORPH + 0.15);
  rows.forEach((row, i) => tl.fromTo(row, { scaleX: 0 }, { scaleX: 1, duration: 0.14, ease: 'power2.out', immediateRender: true }, MORPH + 0.18 + i * 0.08));
  tl.fromTo(shWrap, { scale: 1 }, { scale: 1.03, transformOrigin: '540px 1120px', duration: LIFT - MORPH - 0.3, ease: E.soft, immediateRender: false }, MORPH + 0.3); // 3% push
  // exit: the sheet lifts up fast
  tl.to(sh, { y: -1700, rotation: -5, duration: 0.3, ease: E.fast }, LIFT);

  // ---- per-frame: arrows, cards along their arrows, audio bars ----
  const riseE = gsap.parseEase('expo.out'), goE = gsap.parseEase('expo.out');
  onFrame(t => {
    ARROWS.forEach((a, i) => {
      const { shaft, head, L } = arrs[i];
      if (t < 15.02 || t >= GO[i] + GO_D) { shaft.style.opacity = 0; head.style.opacity = 0; return; }
      const grow = clamp01((t - 15.02 - i * 0.04) / 0.38), gq = 1 - (1 - grow) ** 3;
      shaft.style.opacity = 1; head.style.opacity = 1;
      if (t < GO[i]) shaft.style.strokeDashoffset = (L * (1 - gq)).toFixed(1);
      else { const u = U0 + (1 - U0) * goE(clamp01((t - GO[i]) / GO_D)); shaft.style.strokeDashoffset = (-L * Math.max(0, u - 0.06)).toFixed(1); }
      head.style.strokeDashoffset = (100 * (1 - clamp01((t - 15.36 - i * 0.04) / 0.08))).toFixed(1);
    });
    cards.forEach(({ c }, i) => {
      const a = ARROWS[i];
      if (t < RISE[i] || t >= GO[i] + GO_D) { c.style.visibility = 'hidden'; return; }
      const home = qpt(a, U0);
      let x, y, sc = 1, rot, op = 1;
      if (t < GO[i]) { const q = riseE(clamp01((t - RISE[i]) / RISE_D)); x = home.x; y = home.y + 620 * (1 - q); rot = [-3, 2, 3][i] * (1 + 2 * (1 - q)) + 0.6 * Math.sin((t - RISE[i]) * 5 + i); }
      else { const q = goE(clamp01((t - GO[i]) / GO_D)); const p = qpt(a, U0 + (1 - U0) * q); x = p.x; y = p.y - 40 * q; sc = 1 - 0.7 * q; rot = [-3, 2, 3][i] * (1 - q); op = 1 - clamp01((q - 0.8) / 0.2); }
      c.style.visibility = 'visible';
      c.style.left = (x - CW / 2).toFixed(1) + 'px'; c.style.top = (y - CH / 2).toFixed(1) + 'px';
      c.style.transform = `rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`; c.style.opacity = op.toFixed(3);
    });
    wbars.forEach((b, i) => { const v = 0.3 + 0.7 * Math.abs(Math.sin(t * 9 + i * 1.3) * Math.cos(t * 4.1 + i * 0.7)); b.style.transform = `scaleY(${v.toFixed(3)})`; });
  });
}
