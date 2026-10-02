// Tip 4 (10.0–12.5): WEIRD AI MOTION? / DEFINE THE PHYSICS.
// Slide-05 layout: a clean 2×2 of physics polaroids around a taped "PHYSICS + MOTION" note, four orange arrows feeding it.
// Lead: a shaded ball is thrown in from the right under real gravity, hits the note (big squash, the note dips on a
// spring, the arrows fire), bounces with energy loss and settles. Exit: the photos slide out sideways, note and ball drop.
import { E, el, place, polaroid, tape, hand, svg, path, arrow, rng, tipHeadline } from '../core.js';

export const meta = { box: { lines: ['DEFINE THE', 'PHYSICS.'] } };

// ---- layout ----
const PW = 340, PH = 360, COLS = [64, 600], ROWS = [790, 1200];
const NOTE = { w: 214, h: 128, cx: 502, cy: 1175 };
const NOTE_TOP = NOTE.cy - NOTE.h / 2;
const R = 54;
const YC = NOTE_TOP - R + 4;            // ball centre when resting on the note
const XL = NOTE.cx;                     // landing x

// ---- ball physics (closed form, pure functions of t) ----
const T0 = 10.0, T_HIT = 10.5;          // thrown in at 10.0, lands on the beat
const X0 = 1150, Y0 = 640, VY0 = -420;  // enters from beyond the right edge, slightly upward
const G = 2 * (YC - Y0 - VY0 * (T_HIT - T0)) / ((T_HIT - T0) ** 2);
const VX = (XL - X0) / (T_HIT - T0);
const V_HIT = VY0 + G * (T_HIT - T0);
// contacts: [impact time, dwell, impact speed]; flights in between hit the next beat
const CONTACTS = [[10.5, 0.13, V_HIT], [11.0, 0.08, 0], [11.25, 0.06, 0]];
const FLIGHTS = [];
for (let i = 0; i < CONTACTS.length - 1; i++) {
  const lift = CONTACTS[i][0] + CONTACTS[i][1], T = CONTACTS[i + 1][0] - lift, v = G * T / 2;
  FLIGHTS.push([lift, T, v]); CONTACTS[i + 1][2] = v;
}
const T_REST = CONTACTS[2][0] + CONTACTS[2][1];
const T_OUT = 12.0, OUT_D = 0.34;
const outE = gsap.parseEase('expo.in');
const exitY = t => (t <= T_OUT ? 0 : 1100 * outE(Math.min(1, (t - T_OUT) / OUT_D)));

function noteDip(t) {
  let d = 0;
  for (const [ti, , v] of CONTACTS) if (t >= ti) { const u = t - ti; d += 21 * (v / V_HIT) * Math.exp(-6 * u) * Math.sin(20 * u); }
  return d;
}
// returns centre y (without dip), squash amount (0..1), whether in contact
function ballAt(t) {
  if (t < T_HIT) { const d = t - T0; return { x: X0 + VX * d, y: Y0 + VY0 * d + 0.5 * G * d * d, vy: VY0 + G * d, sq: 0, contact: false }; }
  for (let i = 0; i < CONTACTS.length; i++) {
    const [ti, dw, v] = CONTACTS[i];
    if (t >= ti && t < ti + dw) { const u = (t - ti) / dw; return { x: XL, y: YC, vy: 0, sq: (v / V_HIT) * Math.sin(Math.PI * Math.min(1, u * 1.15)) ** 0.7, contact: true }; }
    const f = FLIGHTS[i];
    if (f && t >= f[0] && t < f[0] + f[1]) { const d = t - f[0]; return { x: XL, y: YC - f[2] * d + 0.5 * G * d * d, vy: -f[2] + G * d, sq: 0, contact: false }; }
  }
  return { x: XL, y: YC, vy: 0, sq: 0, contact: true };
}

export function build(ctx) {
  const { tl, layer, s, e, onFrame } = ctx;
  tipHeadline(ctx, ['WEIRD AI', 'MOTION?']);

  // everything in the visual pushes in slowly (3%)
  const grp = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '502px 1176px' }, layer);
  tl.fromTo(grp, { scale: 1 }, { scale: 1.03, duration: T_OUT - 10.3, ease: E.soft, immediateRender: false }, 10.3);

  // ---- the 2×2 grid ----
  const cells = [
    { src: 'weight', c: 0, r: 0, rot: -1.5, at: 9.9, label: 'WEIGHT', labAt: 10.75 },
    { src: 'wind', c: 1, r: 0, rot: 1.5, at: 10.0, label: 'WIND', labAt: 11.25 },
    { src: 'gravity', c: 0, r: 1, rot: 1, at: 10.1, pos: '82% 50%' },
    { src: 'coat', c: 1, r: 1, rot: -1.2, at: 10.2 },
  ];
  const pols = cells.map((c, i) => {
    const p = polaroid(grp, { x: COLS[c.c], y: ROWS[c.r], w: PW, h: PH, src: c.src, rot: c.rot, pad: 14, tapeRot: i % 2 ? 4 : -4 });
    p.root.style.paddingBottom = '64px';
    if (c.pos) p.img.style.objectPosition = c.pos;
    tl.fromTo(p.root, { opacity: 0, scale: 0.7, x: c.c ? 140 : -140, rotation: c.rot + (c.c ? 8 : -8) }, { opacity: 1, scale: 1, x: 0, rotation: c.rot, duration: 0.42, ease: E.land, immediateRender: true }, c.at);
    if (c.label) {
      const h = hand(p.root, c.label, { x: 20, y: PH - 58, size: 46, rot: -2, ul: true });
      h.style.position = 'absolute';
      tl.fromTo(h, { clipPath: 'inset(-30% 100% -30% 0%)' }, { clipPath: 'inset(-30% 0% -30% 0%)', duration: 0.3, ease: 'power2.out', immediateRender: true }, c.labAt);
    }
    return p;
  });
  // orange force arrows inside the photos draw on (weight & gravity down, wind & coat sideways)
  const inner = [[0, 'M230 70 V210', 'M214 192 L230 212 L246 192'], [2, 'M232 60 V200', 'M216 182 L232 202 L248 182'], [1, 'M90 120 Q160 100 230 112', 'M212 98 L232 112 L212 126'], [3, 'M60 150 Q120 140 180 150', 'M162 136 L182 150 L162 164']];
  inner.forEach(([i, d1, d2], k) => {
    const sv = svg(pols[i].root, { x: 14, y: 14, w: PW - 28, h: PH - 78, vb: `0 0 ${PW - 28} ${PH - 78}` });
    const a = path(sv, d1, { stroke: 'var(--orange)', width: 8 }), b = path(sv, d2, { stroke: 'var(--orange)', width: 8 });
    const L = a.getTotalLength(); a.style.strokeDasharray = `${L} ${L + 4}`; b.style.strokeDasharray = '60 62';
    tl.fromTo(a, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.22, ease: 'power2.out', immediateRender: true }, 11.5 + k * 0.05);
    tl.fromTo(b, { strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: 0.08, immediateRender: true }, 11.7 + k * 0.05);
  });

  // ---- four orange arrows into the note (fire on the two big impacts) ----
  const as = svg(grp, {});
  const nL = NOTE.cx - NOTE.w / 2, nR = NOTE.cx + NOTE.w / 2, nT = NOTE_TOP, nB = NOTE.cy + NOTE.h / 2;
  const arrs = [
    [[COLS[0] + PW - 6, ROWS[0] + 250, nL + 30, nT - 14, -0.25], 10.5],
    [[COLS[1] + 6, ROWS[0] + 250, nR - 30, nT - 14, 0.25], 10.55],
    [[COLS[0] + PW - 6, ROWS[1] + 70, nL - 12, nB - 30, 0.25], 11.0],
    [[COLS[1] + 6, ROWS[1] + 70, nR + 12, nB - 30, -0.25], 11.05],
  ].map(([[x1, y1, x2, y2, bow], at]) => {
    const a = arrow(as, x1, y1, x2, y2, { bow, width: 8, headLen: 24 });
    const L = a.shaft.getTotalLength();
    a.shaft.style.strokeDasharray = `${L} ${L + 4}`; a.head.style.strokeDasharray = '80 82';
    tl.fromTo(a.shaft, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.2, ease: 'power2.out', immediateRender: true }, at);
    tl.fromTo(a.head, { strokeDashoffset: 80 }, { strokeDashoffset: 0, duration: 0.07, ease: 'none', immediateRender: true }, at + 0.18);
    return a;
  });
  tl.to(as, { opacity: 0, duration: 0.18, ease: E.leave }, T_OUT - 0.05);

  // ---- the note ----
  const noteW = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px' }, grp);
  const note = el('div', 'tag', { width: NOTE.w + 'px', height: NOTE.h + 'px', padding: 0, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }, noteW);
  place(note, { x: NOTE.cx - NOTE.w / 2, y: NOTE_TOP });
  el('div', 'hand', { fontSize: '42px', lineHeight: '1.05', whiteSpace: 'normal' }, note, 'PHYSICS<br>+ MOTION');
  tape(note, { x: NOTE.w / 2 - 55, y: -22, w: 110, rot: 3 });
  // ink burst ticks either side of the note
  const bs = svg(noteW, {});
  const ticks = [];
  [[-1, -0.5], [-1, 0], [-1, 0.5], [1, -0.5], [1, 0], [1, 0.5]].forEach(([sd, k]) => {
    const x = NOTE.cx + sd * (NOTE.w / 2 + 22), y = NOTE.cy + k * 64;
    ticks.push(path(bs, `M${x} ${y} L${x + sd * 22} ${y + k * 18}`, { stroke: '#111', width: 5 }));
  });
  gsap.set(bs, { opacity: 0 });
  [10.5, 11.0, 11.65].forEach(t => {
    tl.fromTo(bs, { opacity: 1, scale: 0.8, svgOrigin: `${NOTE.cx} ${NOTE.cy}` }, { opacity: 0, scale: 1.25, svgOrigin: `${NOTE.cx} ${NOTE.cy}`, duration: 0.3, ease: 'power2.out', immediateRender: false }, t);
  });
  tl.fromTo(note, { opacity: 0, scale: 0.5, rotation: -10 }, { opacity: 1, scale: 1, rotation: -2, duration: 0.4, ease: E.pop, immediateRender: true }, 10.15);
  tl.fromTo(note, { scale: 1.1 }, { scale: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, 11.65);

  // ---- ball + contact shadow ----
  const shadow = el('div', 'abs', { width: '150px', height: '22px', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%, rgba(30,18,8,.5), rgba(30,18,8,0) 70%)' }, grp);
  const ball = el('div', 'abs', {
    width: 2 * R + 'px', height: 2 * R + 'px', borderRadius: '50%', transformOrigin: '50% 100%',
    background: 'radial-gradient(circle at 34% 28%, #FBF8F1 0%, #D2CCC1 13%, #9C958A 38%, #5C564E 68%, #26231F 100%)',
    boxShadow: 'inset -10px -14px 22px rgba(0,0,0,.35), inset 4px 6px 10px rgba(255,255,255,.18), 0 12px 20px -10px rgba(40,25,10,.45)',
  }, grp);

  // ---- exit: photos slide out sideways, note + ball drop ----
  pols.forEach((p, i) => tl.to(p.root, { x: cells[i].c ? 760 : -760, rotation: cells[i].c ? 10 : -10, duration: 0.34, ease: E.fast }, T_OUT + [0, 0.03, 0.05, 0.08][i]));

  onFrame(t => {
    const dip = noteDip(t), ex = exitY(t);
    noteW.style.transform = `translateY(${(dip + ex).toFixed(2)}px)`;
    const b = ballAt(t);
    let y = b.y + (b.contact ? dip : 0) + ex;
    // squash (several frames in contact) / stretch (in flight)
    let sx = 1, sy = 1;
    if (b.sq > 0) { sy = 1 - 0.42 * b.sq; sx = 1 + 0.36 * b.sq; }
    else { const st = Math.min(0.14, Math.abs(b.vy) / V_HIT * 0.14); sy = 1 + st; sx = 1 / sy; }
    const vis = t >= T0 && y < 2050;
    ball.style.visibility = vis ? 'visible' : 'hidden';
    ball.style.left = (b.x - R).toFixed(1) + 'px'; ball.style.top = (y - R).toFixed(1) + 'px';
    ball.style.transform = `scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
    const hgt = YC - b.y, k = b.x === XL ? Math.max(0, 1 - hgt / 400) : 0;
    shadow.style.visibility = vis && k > 0 ? 'visible' : 'hidden';
    shadow.style.left = (XL - 75) + 'px'; shadow.style.top = (NOTE_TOP - 10 + dip + ex).toFixed(1) + 'px';
    shadow.style.transform = `scale(${(0.45 + 0.6 * k).toFixed(3)}, 1)`; shadow.style.opacity = k.toFixed(3);
  });
}
