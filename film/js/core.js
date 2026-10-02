// Shared pieces for every scene. All motion is a pure function of timeline time.
export const W = 1080, H = 1920, FPS = 60, BPM = 120, BEAT = 60 / BPM;
export const M = 72; // left/right content margin
// Reels UI: key content below y≈1000 stays at x ≤ 940 (right-side buttons); nothing key below y 1560.
export const SAFE = { right: 940, bottom: 1560 };

// Scene windows (seconds). Every boundary is on a beat.
export const SCENES = {
  cover: [0.0, 2.5], t1: [2.5, 5.0], t2: [5.0, 7.5], t3: [7.5, 10.0], t4: [10.0, 12.5],
  t5: [12.5, 15.0], t6: [15.0, 17.5], t7: [17.5, 20.0], t8: [20.0, 22.5], check: [22.5, 26.5], cta: [26.5, 30.0],
};
export const DURATION = 30.0;

// Eases: land slowly, leave fast.
export const E = { land: 'expo.out', land2: 'power3.out', leave: 'power3.in', fast: 'expo.in', move: 'power3.inOut', soft: 'sine.inOut', pop: 'back.out(2.2)' };

// seeded random (mulberry32)
export function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export function el(tag, cls, style, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (style) Object.assign(e.style, style);
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
export const px = v => (typeof v === 'number' ? v + 'px' : v);
export function place(e, { x, y, w, h }) { if (x != null) e.style.left = px(x); if (y != null) e.style.top = px(y); if (w != null) e.style.width = px(w); if (h != null) e.style.height = px(h); return e; }

const IMG = 'assets/photos/';
export function img(name, parent, style) { const i = el('img', '', style, parent); i.src = IMG + name + '.jpg'; i.decoding = 'sync'; return i; }

// Taped polaroid with a photo. Returns { root, ph, img }
export function polaroid(parent, { x, y, w, h, src, rot = 0, pad = 16, tape = true, tapeRot = -3 }) {
  const root = el('div', 'polaroid', { padding: pad + 'px' }, parent); place(root, { x, y, w, h });
  const ph = el('div', 'ph', null, root);
  const im = src ? img(src, ph) : null;
  if (tape) { const t = el('div', 'tape', { left: (w / 2 - 75) + 'px', top: '-20px', transform: `rotate(${tapeRot}deg)` }, root); }
  gsap.set(root, { rotation: rot, transformOrigin: '50% 50%' });
  return { root, ph, img: im };
}
export function tape(parent, { x, y, w = 150, rot = 0 }) { const t = el('div', 'tape', { width: w + 'px', transform: `rotate(${rot}deg)` }, parent); place(t, { x, y }); return t; }

// Handwritten label (Kalam). opts: size, rot, ul (orange underline), color
export function hand(parent, text, { x, y, size = 40, rot = 0, ul = false, color } = {}) {
  const e = el('div', 'hand' + (ul ? ' ul' : ''), { fontSize: size + 'px', ...(color ? { color } : {}) }, parent, text);
  place(e, { x, y }); gsap.set(e, { rotation: rot, transformOrigin: '0% 50%' }); return e;
}
// Paper tag (torn-label look) with hand text
export function tag(parent, text, { x, y, size = 40, rot = 0 }) {
  const t = el('div', 'tag', null, parent); place(t, { x, y });
  el('div', 'hand', { fontSize: size + 'px', position: 'relative' }, t, text);
  gsap.set(t, { rotation: rot }); return t;
}

// Display headline: one span per line. Returns array of line elements.
export function headline(parent, lines, { x = M, y, size = 150, stretch = 78, color } = {}) {
  const box = el('div', 'disp abs', { fontSize: size + 'px', fontStretch: stretch + '%', ...(color ? { color } : {}) }, parent); place(box, { x, y });
  return lines.map(t => el('span', 'ln', null, box, t));
}
export function sans(parent, html, { x = M, y, size = 56, w } = {}) { const e = el('div', 'sans abs', { fontSize: size + 'px' }, parent, html); place(e, { x, y, w }); return e; }

// SVG helpers ----------------------------------------------------------
const NS = 'http://www.w3.org/2000/svg';
export function svg(parent, { x = 0, y = 0, w = W, h = H, vb } = {}) {
  const s = document.createElementNS(NS, 'svg'); s.setAttribute('class', 'draw abs'); s.setAttribute('width', w); s.setAttribute('height', h);
  s.setAttribute('viewBox', vb || `0 0 ${w} ${h}`); s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.overflow = 'visible'; parent.appendChild(s); return s;
}
export function path(s, d, { stroke = 'var(--orange)', width = 7, fill = 'none' } = {}) {
  const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('stroke', stroke); p.setAttribute('stroke-width', width); p.setAttribute('fill', fill); s.appendChild(p); return p;
}
// Prepare a path to be drawn on: returns its length; tween 'strokeDashoffset' from len to 0.
export function prepDraw(p) { const L = p.getTotalLength(); p.style.strokeDasharray = L + ' ' + (L + 2); p.style.strokeDashoffset = L; return L; }
export function drawOn(tl, p, t, dur = 0.35, ease = 'power2.out') { prepDraw(p); tl.to(p.style ? p : p, { strokeDashoffset: 0, duration: dur, ease }, t); }
// Orange tick mark (drawn). Returns the path.
export function tick(parent, { x, y, s = 1, color = 'var(--orange)', width = 12 }) {
  const g = svg(parent, { x, y, w: 90 * s, h: 80 * s, vb: '0 0 90 80' });
  return path(g, 'M8 42 L34 66 L82 10', { stroke: color, width });
}
// Hand-drawn arrow from (x1,y1) to (x2,y2) with a bow. Returns {shaft, head}
export function arrow(s, x1, y1, x2, y2, { bow = 0.2, width = 6, color = 'var(--orange)', headLen = 22 } = {}) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
  const cx = mx - dy * bow, cy = my + dx * bow;
  const shaft = path(s, `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, { stroke: color, width });
  const a = Math.atan2(y2 - cy, x2 - cx), a1 = a + 2.6, a2 = a - 2.6;
  const head = path(s, `M${x2 + Math.cos(a1) * headLen} ${y2 + Math.sin(a1) * headLen} L${x2} ${y2} L${x2 + Math.cos(a2) * headLen} ${y2 + Math.sin(a2) * headLen}`, { stroke: color, width });
  return { shaft, head };
}

// Standard headline entrance/exit: lines from opposite sides, decelerating landing.
export function linesIn(tl, lines, t, { dist = 1100, dur = 0.55, stagger = 0.06 } = {}) {
  lines.forEach((l, i) => tl.fromTo(l, { x: i % 2 ? dist : -dist }, { x: 0, duration: dur, ease: E.land }, t + i * stagger));
}
// Lines leave in the SAME direction the next headline travels (line 0 → right, line 1 → left), and are gone before it arrives,
// so outgoing and incoming titles never cross or splice.
export function linesOut(tl, lines, t, { dist = 1200, dur = 0.24, stagger = 0.03 } = {}) {
  lines.forEach((l, i) => tl.to(l, { x: i % 2 ? -dist : dist, duration: dur, ease: E.fast }, t + i * stagger));
}

// ---- Fixed text block for tips 1–8 (storyboard v2) ----------------------
export const TIP = { x: 64, y: 220, size: 176, maxW: 952, boxY: 544, boxH1: 132, boxH2: 214, boxFs1: 100, boxFs2: 92, boxPad: 30 };
// Measure rendered width of display text at a size.
export function measure(text, size, stretch = 78) {
  const s = el('span', 'disp', { position: 'absolute', visibility: 'hidden', fontSize: size + 'px', fontStretch: stretch + '%' }, document.body, text);
  const w = s.getBoundingClientRect().width; s.remove(); return w;
}
// Box geometry for a tip answer (1 or 2 lines), width fitted to the text.
export function tipBox(lines) {
  const fs = lines.length > 1 ? TIP.boxFs2 : TIP.boxFs1;
  const tw = Math.max(...lines.map(l => measure(l, fs)));
  return { x: TIP.x, y: TIP.boxY, w: Math.ceil(tw + TIP.boxPad * 2 + 10), h: lines.length > 1 ? TIP.boxH2 : TIP.boxH1, fs, lines };
}
// Headline for a tip: auto-fit both lines to maxW at one shared size; standard in/out.
export function tipHeadline(ctx, lines, { inAt, outAt } = {}) {
  const { tl, layer, s, e } = ctx;
  const size = Math.min(TIP.size, Math.floor(TIP.size * TIP.maxW / Math.max(...lines.map(l => measure(l, TIP.size)))));
  const ls = headline(layer, lines, { x: TIP.x, y: TIP.y + (TIP.size - size) * 0.86, size });
  linesIn(tl, ls, inAt ?? s - 0.06);
  linesOut(tl, ls, outAt ?? e - 0.36);
  return ls;
}
// Pixel-exact handoffs between scenes (outer geometry of the carried element).
export const HANDOFF = {
  // tip 1's desert polaroid → tip 2's first wall photo (at 5.0 s)
  t1t2: { x: 96, y: 800, w: 470, h: 360, rot: -5 },
  // tip 7's TEST 01 frame → tip 8's phone screen (at 20.0 s)
  t7t8: { x: 352, y: 742, w: 376, h: 668, rot: 0 },
};
