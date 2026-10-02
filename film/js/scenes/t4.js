// Tip 4 (10.0–12.5): WEIRD AI MOTION? / DEFINE THE PHYSICS.
// A full-size shaded ball drops from above the frame under constant acceleration (y = y0 + ½gt²) onto the WEIGHT
// polaroid, which dips on a spring. It bounces with energy loss (closed-form arcs) and settles. Each other polaroid
// pops in on a beat and fires an orange arrow at the ball. Exit: the grid drops away and the ball falls with it.
import { E, el, polaroid, tape, hand, svg, path, arrow, tipHeadline } from '../core.js';

export const meta = { box: { lines: ['DEFINE THE', 'PHYSICS.'] } };

// ---- grid geometry (2×2, ~860 wide, y 750–1500) ----
const CW = 416, CH = 362, GX = [80, 520], GY = [752, 1138];
const R = 70;                           // ball radius
const BX = GX[1] + CW / 2;              // ball x: centre of the WEIGHT polaroid (top-right)
const TOP = GY[0];                      // its top edge: the ball lands here
const YC = TOP - R;                     // ball centre at contact
const Y0 = -R - 20, T_DROP = 10.0, T_HIT = 10.5; // dropped from rest just above the frame; first impact on the beat
const G = 2 * (YC - Y0) / ((T_HIT - T_DROP) ** 2);
const V_HIT = G * (T_HIT - T_DROP);
const REST = 0.5;                       // bounce 1 lasts 0.5 s -> second impact at 11.0
const T_OUT = 11.9;                     // support drops away; ball free-falls from rest
const IMPACTS = (() => { const a = [[T_HIT, V_HIT]]; let t = T_HIT, v = V_HIT * REST; for (let i = 0; i < 5; i++) { t += 2 * v / G; a.push([t, v]); v *= REST; } return a; })();
const T_SETTLE = IMPACTS[IMPACTS.length - 1][0];

// spring dip of the WEIGHT polaroid (px, positive = down)
function dipAt(t) {
  let d = 0;
  for (const [ti, v] of IMPACTS) if (t >= ti && t < T_OUT) { const u = t - ti; d += 19 * (v / V_HIT) * Math.exp(-7 * u) * Math.sin(24 * u); }
  return d;
}
function ballAt(t) {
  if (t < T_HIT) { const d = t - T_DROP; return { y: Y0 + 0.5 * G * d * d, vy: G * d, last: null }; }
  if (t >= T_OUT) { const d = t - T_OUT; return { y: YC + 0.5 * G * d * d, vy: G * d, last: null, free: true }; }
  let ti = T_HIT, v = V_HIT * REST;
  for (let i = 0; i < IMPACTS.length - 1; i++) {
    const T = 2 * v / G;
    if (t < ti + T) { const d = t - ti; return { y: YC - v * d + 0.5 * G * d * d, vy: -v + G * d, last: ti, vImp: v / REST }; }
    ti += T; v *= REST;
  }
  return { y: YC, vy: 0, last: ti, vImp: v / REST, rest: true };
}

export function build(ctx) {
  const { tl, layer, s, e, onFrame } = ctx;
  tipHeadline(ctx, ['WEIRD AI', 'MOTION?']);

  // ---- the grid ----
  const cells = [
    { src: 'gravity', c: 0, r: 0, rot: -2.5, at: 10.25, pos: '85% 50%' },
    { src: 'weight', c: 1, r: 0, rot: 0, at: 9.9, label: 'WEIGHT' },
    { src: 'wind', c: 0, r: 1, rot: 2, at: 10.75, label: 'WIND' },
    { src: 'coat', c: 1, r: 1, rot: -2, at: 11.25 },
  ];
  const wraps = [], pols = [];
  cells.forEach((c, i) => {
    const w = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px' }, layer);
    const p = polaroid(w, { x: GX[c.c], y: GY[c.r], w: CW, h: CH, src: c.src, rot: c.rot, pad: 14, tape: false });
    p.root.style.paddingBottom = '66px';
    if (c.pos) p.img.style.objectPosition = c.pos;
    tape(p.root, { x: c.src === 'weight' ? 12 : 30, y: -18, rot: -7 });
    tape(p.root, { x: CW - (c.src === 'weight' ? 162 : 180), y: -18, rot: 6 });
    tl.fromTo(p.root, { opacity: 0, scale: 0.6, rotation: c.rot - 9, y: 40 }, { opacity: 1, scale: 1, rotation: c.rot, y: 0, duration: 0.4, ease: E.pop, immediateRender: true }, c.at);
    if (c.label) {
      const h = hand(p.root, c.label, { x: 22, y: CH - 60, size: 48, rot: -2 });
      h.style.position = 'absolute';
      tl.fromTo(h, { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.3, ease: 'power2.out', immediateRender: true }, c.src === 'weight' ? 10.55 : 11.5);
    }
    wraps.push(w); pols.push(p.root);
  });
  const weightWrap = wraps[1];
  // the other photos twitch on each hit (they share the board)
  [[T_HIT, 6], [IMPACTS[1][0], 3.5]].forEach(([t, a]) => [0, 2, 3].forEach(i => {
    tl.to(wraps[i], { y: a * (i === 0 ? 1 : 0.6), duration: 0.05, ease: 'power2.out' }, t);
    tl.to(wraps[i], { y: 0, duration: 0.42, ease: 'elastic.out(1,0.35)' }, t + 0.05);
  }));

  // ---- orange arrows: each photo fires at the ball as it lands ----
  const as = svg(layer, {});
  const arrows = [
    { a: arrow(as, 380, GY[0] + 4, BX - R - 18, YC - 34, { bow: -0.28, width: 7, headLen: 26 }), at: 10.5 },        // gravity -> ball
    { a: arrow(as, GX[0] + CW - 40, GY[1] + 10, BX - R - 10, YC + 40, { bow: -0.18, width: 7, headLen: 26 }), at: 11.0 }, // wind -> ball
    { a: arrow(as, GX[1] + CW - 30, GY[1] + 6, BX + R + 14, YC + 20, { bow: 0.25, width: 7, headLen: 26 }), at: 11.5 },   // coat -> ball
  ];
  arrows.forEach(({ a, at }) => {
    const L = a.shaft.getTotalLength();
    a.shaft.style.strokeDasharray = `${L} ${L + 4}`; a.head.style.strokeDasharray = '80 82';
    tl.fromTo(a.shaft, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.24, ease: 'power2.out', immediateRender: true }, at - 0.1);
    tl.fromTo(a.head, { strokeDashoffset: 80 }, { strokeDashoffset: 0, duration: 0.08, ease: 'none', immediateRender: true }, at + 0.12);
  });
  tl.to(as, { opacity: 0, duration: 0.2, ease: E.leave }, T_OUT - 0.1);

  // ---- dashed trail of the fall ----
  const ts = svg(layer, {});
  const trail = path(ts, 'M0 0', { stroke: 'var(--orange)', width: 7 });
  trail.style.strokeDasharray = '18 16';
  tl.to(ts, { opacity: 0, duration: 0.25, ease: E.leave }, 11.4);

  // ---- ball + contact shadow (on the polaroid's top edge) ----
  const shadow = el('div', 'abs', { width: '190px', height: '24px', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%, rgba(30,18,8,.5), rgba(30,18,8,0) 70%)' }, layer);
  const ball = el('div', 'abs', {
    width: 2 * R + 'px', height: 2 * R + 'px', borderRadius: '50%', transformOrigin: '50% 100%',
    background: 'radial-gradient(circle at 34% 28%, #FBF8F1 0%, #D2CCC1 13%, #9C958A 38%, #5C564E 68%, #26231F 100%)',
    boxShadow: 'inset -10px -14px 22px rgba(0,0,0,.35), inset 4px 6px 10px rgba(255,255,255,.18), 0 14px 22px -10px rgba(40,25,10,.4)',
  }, layer);

  // ---- exit: the grid drops away, the ball falls with it ----
  pols.forEach((p, i) => tl.to(p, { y: 1250, rotation: `+=${i % 2 ? 12 : -10}`, duration: 0.42, ease: E.fast }, T_OUT + [0.04, 0, 0.08, 0.05][i]));

  onFrame(t => {
    const dip = dipAt(t);
    weightWrap.style.transform = `translateY(${dip.toFixed(2)}px)`;
    // ball
    const b = ballAt(t);
    let y = b.y;
    if (b.rest || (b.last != null && t - b.last < 0.05)) y += Math.max(0, dip);
    let sx = 1, sy = 1;
    const st = Math.min(0.12, Math.abs(b.vy) / V_HIT * 0.12); sy = 1 + st; sx = 1 / sy;
    if (b.last != null && t - b.last < 0.09) { const k = 1 - (t - b.last) / 0.09, amt = 0.34 * (b.vImp / V_HIT) * k * k; sy = 1 - amt; sx = 1 + amt * 0.85; }
    const vis = t >= T_DROP - 0.01 && y < 2000;
    ball.style.visibility = vis ? 'visible' : 'hidden';
    ball.style.left = (BX - R) + 'px'; ball.style.top = (y - R) + 'px';
    ball.style.transform = `scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
    // contact shadow on the polaroid top edge (only while the polaroid is there)
    const hgt = YC - b.y, k = Math.max(0, 1 - hgt / 700);
    shadow.style.visibility = vis && t < T_OUT && t > T_DROP + 0.15 ? 'visible' : 'hidden';
    shadow.style.left = (BX - 95) + 'px'; shadow.style.top = (TOP - 12 + dip) + 'px';
    shadow.style.transform = `scale(${(0.4 + 0.7 * k).toFixed(3)}, 1)`; shadow.style.opacity = (0.15 + 0.85 * k).toFixed(3);
    // trail: from the top of the frame down to the ball (the fall line)
    if (t <= T_DROP + 0.05) trail.setAttribute('d', 'M0 0');
    else { const yTop = 200, yEnd = Math.min(b.y, YC) - R + 6; trail.setAttribute('d', yEnd > yTop ? `M${BX} ${yTop} L${BX} ${yEnd}` : 'M0 0'); }
  });
}
