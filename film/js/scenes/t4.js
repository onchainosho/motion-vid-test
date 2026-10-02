// Tip 4 (10.0–12.5): WEIRD AI MOTION? / DEFINE THE PHYSICS.
// A shaded ball falls under real gravity (y = y0 + ½gt²), squashes on the floor and bounces with energy loss
// (closed-form arcs), while a 2×2 grid of physics polaroids pops in on the beats.
import { E, el, place, polaroid, hand, svg, path, tipHeadline } from '../core.js';

export const meta = { box: { lines: ['DEFINE THE', 'PHYSICS.'] } };

// ---- physics (pure functions of master time) ----
const FLOOR = 1440, R = 62;            // floor line y, ball radius
const X0 = 626, Y0 = 806, VX = 300;     // release point (centre) and horizontal speed (px/s)
const T_IN = 10.0, T_REL = 10.5, T_HIT = 11.0; // pop-in, release, first impact (all on beats)
const REST = 0.75;                      // restitution: each bounce keeps 75% of the speed
const G = 2 * (FLOOR - R - Y0) / ((T_HIT - T_REL) ** 2); // px/s², so the first fall lasts exactly 0.5 s
const YC = FLOOR - R;                   // centre height at contact
const V_HIT = G * (T_HIT - T_REL);
// impact times: 11.0, 11.75, 12.3125 ...
const IMPACTS = (() => { const a = [[T_HIT, V_HIT]]; let t = T_HIT, v = V_HIT * REST; for (let i = 0; i < 6; i++) { t += 2 * v / G; a.push([t, v]); v *= REST; } return a; })();
const T_END = 12.45; // ball is far off the right edge by now

function ballAt(t) {
  const x = X0 + VX * Math.max(0, t - T_REL);
  if (t < T_REL) { // hover after the pop-in: rises slightly and comes to rest at the release point (velocity 0 at release)
    const p = Math.min(1, Math.max(0, (t - T_IN) / (T_REL - T_IN)));
    return { x, y: Y0 + 18 * (1 - p) * (1 - p), vy: 0, last: null };
  }
  if (t < T_HIT) { const d = t - T_REL; return { x, y: Y0 + 0.5 * G * d * d, vy: G * d, last: null }; }
  let ti = T_HIT, v = V_HIT * REST;
  for (let i = 0; i < 8; i++) {
    const T = 2 * v / G;
    if (t < ti + T) { const d = t - ti; return { x, y: YC - v * d + 0.5 * G * d * d, vy: -v + G * d, last: ti, vImp: v / REST }; }
    ti += T; v *= REST;
  }
  return { x, y: YC, vy: 0, last: ti };
}

export function build(ctx) {
  const { tl, layer, s, e, onFrame } = ctx;
  tipHeadline(ctx, ['WEIRD AI', 'MOTION?']);

  // ---- floor line (ink) with a dip under the ball on impact ----
  const fs = svg(layer, {});
  const floor = path(fs, `M64 ${FLOOR} L1000 ${FLOOR}`, { stroke: '#111', width: 5 });
  floor.style.strokeDasharray = '1100 2400';
  tl.fromTo(floor, { strokeDashoffset: 1100 }, { strokeDashoffset: 0, duration: 0.5, ease: E.land2, immediateRender: true }, 9.95);
  tl.to(floor, { strokeDashoffset: -1100, duration: 0.32, ease: E.fast }, 12.2);
  // impact strokes (orange), redrawn per frame
  const bursts = [0, 1, 2, 3, 4, 5].map(() => path(fs, 'M0 0', { stroke: 'var(--orange)', width: 6 }));

  // ---- dashed orange trail of the real trajectory ----
  const trail = path(fs, 'M0 0', { stroke: 'var(--orange)', width: 6 });
  trail.style.strokeDasharray = '16 16';
  tl.to(trail, { opacity: 0, duration: 0.3, ease: E.leave }, 12.05);

  // ---- 2×2 polaroid grid (left column, standing above the floor) ----
  const grid = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px' }, layer);
  const CW = 224, CH = 300;
  const cells = [
    { src: 'weight', x: 64, y: 756, rot: -4, label: 'WEIGHT', at: 10.25 },
    { src: 'gravity', x: 306, y: 772, rot: 3, at: 10.5 },
    { src: 'wind', x: 70, y: 1084, rot: 2.5, label: 'WIND', at: 10.75 },
    { src: 'coat', x: 306, y: 1096, rot: -3, at: 11.0 },
  ];
  const pols = cells.map((c, i) => {
    const p = polaroid(grid, { x: c.x, y: c.y, w: CW, h: CH, src: c.src, rot: c.rot, pad: 12, tapeRot: i % 2 ? 4 : -4 });
    p.root.style.paddingBottom = '58px';
    if (c.src === 'gravity') p.img.style.objectPosition = '88% 50%';
    gsap.set(p.root, { opacity: 0 });
    tl.fromTo(p.root, { opacity: 0, scale: 0.55, rotation: c.rot - 10, y: 30 }, { opacity: 1, scale: 1, rotation: c.rot, y: 0, duration: 0.38, ease: E.pop, immediateRender: false }, c.at);
    if (c.label) {
      const h = hand(p.root, c.label, { x: 16, y: CH - 52, size: 38, rot: -2 });
      h.style.position = 'absolute';
      tl.fromTo(h, { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.3, ease: 'power2.out', immediateRender: true }, c.at + 0.2);
    }
    return p.root;
  });
  // the floor shakes the grid on each impact (a visible result of the hit)
  [[T_HIT, 9], [IMPACTS[1][0], 5]].forEach(([t, a]) => {
    tl.to(grid, { y: a, duration: 0.05, ease: 'power2.out' }, t);
    tl.to(grid, { y: 0, duration: 0.4, ease: 'elastic.out(1,0.35)' }, t + 0.05);
  });
  // small idle sway so the grid never freezes
  pols.forEach((p, i) => tl.to(p, { rotation: `+=${i % 2 ? -1.5 : 1.5}`, duration: 0.9, ease: E.soft }, 11.2 + i * 0.05));
  // exit: the grid drops out fast
  pols.forEach((p, i) => tl.to(p, { y: 1300, rotation: `+=${i % 2 ? 14 : -12}`, duration: 0.4, ease: E.fast }, 12.0 + [0, 0.06, 0.03, 0.09][i]));

  // ---- the ball ----
  const shadow = el('div', 'abs', { width: '170px', height: '26px', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%, rgba(30,18,8,.55), rgba(30,18,8,0) 70%)', opacity: 0 }, layer);
  const ball = el('div', 'abs', {
    width: 2 * R + 'px', height: 2 * R + 'px', borderRadius: '50%', transformOrigin: '50% 100%',
    background: 'radial-gradient(circle at 34% 28%, #FBF8F1 0%, #D2CCC1 13%, #9C958A 38%, #5C564E 68%, #26231F 100%)',
    boxShadow: 'inset -10px -14px 22px rgba(0,0,0,.35), inset 4px 6px 10px rgba(255,255,255,.18)', visibility: 'hidden',
  }, layer);
  const popE = gsap.parseEase('back.out(2.2)');

  onFrame(t => {
    // ball
    if (t < T_IN || t > T_END) { ball.style.visibility = 'hidden'; shadow.style.opacity = 0; }
    else {
      const b = ballAt(t);
      const pop = popE(Math.min(1, Math.max(0, (t - T_IN) / 0.36)));
      let sx = 1, sy = 1;
      const st = Math.min(0.1, Math.abs(b.vy) / V_HIT * 0.1); sy = 1 + st; sx = 1 / sy; // stretch along speed
      if (b.last != null && t - b.last < 0.09) { // squash on impact, scaled by impact speed
        const k = 1 - (t - b.last) / 0.09, amt = 0.36 * (b.vImp / V_HIT) * k * k;
        sy = 1 - amt; sx = 1 + amt * 0.85;
      }
      ball.style.visibility = 'visible';
      ball.style.left = (b.x - R) + 'px'; ball.style.top = (b.y - R) + 'px';
      ball.style.transform = `scale(${sx * pop}, ${sy * pop})`;
      const hgt = YC - b.y, k = Math.max(0, 1 - hgt / 760);
      shadow.style.left = (b.x - 85) + 'px'; shadow.style.top = (FLOOR - 13) + 'px';
      shadow.style.transform = `scale(${(0.45 + 0.65 * k) * Math.min(1, pop)}, 1)`;
      shadow.style.opacity = (0.2 + 0.8 * k) * Math.min(1, pop);
    }
    // floor dip under the ball right after an impact
    let dip = 0, dx = X0;
    for (const [ti, v] of IMPACTS.slice(0, 2)) if (t >= ti && t - ti < 0.3) { const k = 1 - (t - ti) / 0.3; dip = 16 * (v / V_HIT) * k * k; dx = X0 + VX * (ti - T_REL); }
    if (dip > 0.2) { const a = Math.max(70, dx - 150), c = Math.min(994, dx + 150); floor.setAttribute('d', `M64 ${FLOOR} L${a} ${FLOOR} Q${dx} ${FLOOR + 2 * dip} ${c} ${FLOOR} L1000 ${FLOOR}`); }
    else floor.setAttribute('d', `M64 ${FLOOR} L1000 ${FLOOR}`);
    // impact strokes: three short lines either side of the contact point
    let bd = null;
    for (const [ti, v] of IMPACTS.slice(0, 2)) if (t >= ti && t - ti < 0.28) bd = [ti, v];
    bursts.forEach((p, i) => {
      if (!bd) { p.setAttribute('d', 'M0 0'); p.style.opacity = 0; return; }
      const [ti, v] = bd, q = (t - ti) / 0.28, side = i < 3 ? -1 : 1, ang = [-0.2, -0.55, -0.9][i % 3];
      const cx = X0 + VX * (ti - T_REL), r0 = 92 + 50 * q, r1 = r0 + 34 * (1 - q) * (v / V_HIT);
      const ca = Math.cos(ang), sa = Math.sin(ang);
      p.setAttribute('d', `M${cx + side * ca * r0} ${FLOOR - 6 + sa * r0 * 0.7} L${cx + side * ca * r1} ${FLOOR - 6 + sa * r1 * 0.7}`);
      p.style.opacity = 1 - q * q;
    });
    // trail: the real trajectory from release to now
    if (t <= T_REL) trail.setAttribute('d', 'M0 0');
    else {
      const t1 = Math.min(t, T_END); let d = '';
      for (let u = T_REL; u <= t1 + 1e-6; u += 1 / 60) { const b = ballAt(u); d += (d ? 'L' : 'M') + b.x.toFixed(1) + ' ' + b.y.toFixed(1); }
      const b = ballAt(t1); d += 'L' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
      trail.setAttribute('d', d);
    }
  });
}
