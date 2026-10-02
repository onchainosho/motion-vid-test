// Tip 5 (12.5–15.0): USING SEEDANCE AUDIO? / PROMPT IT TOO.
// The station polaroid; under it a waveform strip. A playhead sweeps (easing to a stop over each tag), the bars it
// passes turn orange and rise, DIALOGUE then AMBIENCE light up, a speaker pops on the photo. Exit: the waveform
// collapses into one orange line at y = LINE_Y, which tip 6 picks up at 15.0.
import { E, el, place, polaroid, tag, svg, path, rng, tipHeadline } from '../core.js';

export const meta = { box: { lines: ['PROMPT IT TOO.'] } };

const LINE_Y = 1410;                     // shared with t6 (literal there too)
const X1 = 64, X2 = 940, N = 44, STEP = 20, BW = 12;
const TAGS = [['DIALOGUE', 252, -3, 13.25], ['AMBIENCE', 772, 2.5, 14.0]]; // text, centre x, rot, light-up time (beats)
const P0 = 13.0, P1 = 14.25;

// playhead x(t): eased segments that come to rest over each tag on its beat
const KEYS = [[P0, X1], [TAGS[0][3], TAGS[0][1]], [TAGS[1][3], TAGS[1][1]], [P1, X2]];
const segE = gsap.parseEase('power1.inOut');
function phX(t) {
  if (t <= KEYS[0][0]) return X1;
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [ta, xa] = KEYS[i], [tb, xb] = KEYS[i + 1];
    if (t < tb) return xa + (xb - xa) * segE((t - ta) / (tb - ta));
  }
  return X2;
}
const x2t = x => { let lo = P0, hi = P1; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (phX(m) < x) lo = m; else hi = m; } return hi; };

function torn(e, seed) {
  const r = rng(seed), pts = [], n = 9;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n * 100).toFixed(1)}% ${(r() * 7).toFixed(1)}%`);
  for (let i = 0; i <= 5; i++) pts.push(`${(100 - r() * 3).toFixed(1)}% ${(i / 5 * 100).toFixed(1)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n * 100).toFixed(1)}% ${(100 - r() * 7).toFixed(1)}%`);
  for (let i = 5; i >= 0; i--) pts.push(`${(r() * 3).toFixed(1)}% ${(i / 5 * 100).toFixed(1)}%`);
  e.style.clipPath = `polygon(${pts.join(',')})`;
}

export function build(ctx) {
  const { tl, layer, s, e, onFrame } = ctx;
  tipHeadline(ctx, ['USING SEEDANCE', 'AUDIO?']);

  // ---- station polaroid (inside x 64–940 even at full push) ----
  const P = { x: 140, y: 708, w: 760, h: 540 };
  const pol = polaroid(layer, { ...P, src: 'station', rot: -1.5, tapeRot: 3 });
  tl.fromTo(pol.root, { opacity: 0, y: 220, rotation: 5, scale: 0.9 }, { opacity: 1, y: 0, rotation: -1.5, scale: 1, duration: 0.6, ease: E.land, immediateRender: true }, 12.45);
  tl.to(pol.root, { scale: 1.035, rotation: -0.5, duration: 1.45, ease: E.soft }, 13.05); // slow push
  tl.to(pol.img, { scale: 1.06, duration: 1.5, ease: E.soft }, 13.0);

  // speaker sticker on the photo (≤ x 860)
  const spk = el('div', 'abs', { left: '560px', top: '34px', width: '150px', height: '150px', borderRadius: '50%', background: '#F6F1E8', boxShadow: '0 10px 22px -8px rgba(40,25,10,.45)', opacity: 0 }, pol.root);
  const ss = svg(spk, { x: 0, y: 0, w: 150, h: 150, vb: '0 0 150 150' });
  path(ss, 'M30 60 H52 L80 36 V114 L52 90 H30 Z', { stroke: '#111', width: 7, fill: '#111' });
  const wv = [path(ss, 'M94 58 Q106 75 94 92', { stroke: 'var(--orange)', width: 8 }), path(ss, 'M108 44 Q130 75 108 106', { stroke: 'var(--orange)', width: 8 })];
  const T_SPK = 13.5;
  tl.fromTo(spk, { opacity: 0, scale: 0.2, rotation: -20 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.35, ease: E.pop, immediateRender: false }, T_SPK);
  wv.forEach((p, i) => { p.style.strokeDasharray = '80 82'; tl.fromTo(p, { strokeDashoffset: 80 }, { strokeDashoffset: 0, duration: 0.18, ease: 'power2.out', immediateRender: true }, T_SPK + 0.12 + i * 0.08); });
  // the sticker throbs on the following beats
  [14.0, 14.25].forEach(t => tl.fromTo(spk, { scale: 1.14 }, { scale: 1, duration: 0.24, ease: 'power2.out', immediateRender: false }, t));

  // ---- waveform strip (±110 px when risen) ----
  const strip = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px' }, layer);
  const r = rng(505), bars = [];
  for (let i = 0; i < N; i++) {
    const x = X1 + i * STEP, xc = x + BW / 2;
    let h;
    if (xc < 520) { const env = Math.pow(Math.abs(Math.sin(i * 0.52 + 0.4)), 0.8); h = 30 + 140 * env * (0.55 + 0.45 * r()); } // dialogue bursts
    else h = 34 + 56 * (0.5 + 0.5 * Math.sin(i * 0.33)) * (0.65 + 0.35 * r());                                              // ambience bed
    h = Math.round(h);
    const b = el('div', 'abs', { left: x + 'px', top: (LINE_Y - h / 2) + 'px', width: BW + 'px', height: h + 'px', borderRadius: '6px', background: '#2B2723' }, strip);
    bars.push({ b, x, xc, h });
  }
  bars.forEach(({ b, xc }, i) => {
    tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: E.land2, immediateRender: true }, 12.6 + i * 0.008);
    tl.to(b, { backgroundColor: '#EC6327', scaleY: 1.29, duration: 0.24, ease: E.pop }, x2t(xc));
  });
  // collapse into one orange line
  bars.forEach(({ b, x, h }, i) => {
    tl.to(b, { scaleY: 8 / h, width: i === N - 1 ? X2 - x : STEP + 1, borderRadius: 0, backgroundColor: '#EC6327', duration: 0.25, ease: 'power3.in' }, 14.5 + Math.abs(i - N / 2) * 0.002);
  });
  tl.set(strip, { visibility: 'hidden' }, 14.75);
  const ls = svg(layer, {});
  const line = path(ls, `M${X1 + 4} ${LINE_Y} L${X2 - 4} ${LINE_Y}`, { stroke: 'var(--orange)', width: 8 });
  gsap.set(line, { opacity: 0 });
  tl.set(line, { opacity: 1 }, 14.75);
  tl.set(line, { opacity: 0 }, 15.0); // tip 6 draws the identical line from 15.0

  // ---- playhead (driven per frame by phX) ----
  const ph = el('div', 'abs', { left: '0px', top: (LINE_Y - 118) + 'px', width: '6px', height: '236px', background: '#111', borderRadius: '3px', transformOrigin: '50% 50%' }, layer);
  const knob = svg(ph, { x: -13, y: -24, w: 32, h: 28, vb: '0 0 32 28' });
  path(knob, 'M2 2 H30 L16 26 Z', { stroke: '#111', width: 3, fill: 'var(--orange)' });
  tl.fromTo(ph, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.25, ease: E.land, immediateRender: true }, 12.78);
  tl.to(ph, { scaleY: 0, opacity: 0, duration: 0.18, ease: E.leave }, P1 + 0.05);
  onFrame(t => { ph.style.left = (phX(t) - 3).toFixed(1) + 'px'; });

  // ---- tags: DIALOGUE, AMBIENCE (~90 px tall) ----
  const tags = TAGS.map(([txt, cx, rot, at], i) => {
    const w = el('div', 'abs', { left: 0, top: 0, filter: 'drop-shadow(0 8px 10px rgba(40,25,10,.3))' }, layer);
    const t = tag(w, txt, { x: 0, y: 0, size: 60, rot: 0 });
    t.style.boxShadow = 'none'; t.style.padding = '16px 28px'; t.style.position = 'relative'; torn(t, 77 + i);
    const tw = t.offsetWidth;
    place(w, { x: cx - tw / 2, y: 1196 + i * 6 });
    gsap.set(w, { rotation: rot, transformOrigin: '50% 50%' });
    const txtEl = t.firstChild;
    tl.fromTo(w, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.4, ease: E.land, immediateRender: true }, 12.7 + i * 0.1);
    // lights up in one frame: paper -> orange, ink -> cream, then a pulse to 1.15
    tl.set(t, { backgroundColor: '#EC6327' }, at);
    tl.set(txtEl, { color: '#F7F0E6' }, at);
    tl.to(w, { scale: 1.15, duration: 0.1, ease: 'power2.out' }, at);
    tl.to(w, { scale: 1, duration: 0.32, ease: 'back.out(2)' }, at + 0.1);
    return w;
  });

  // ---- exit: photo and tags drop fast behind the strip ----
  tl.to(pol.root, { y: 1400, rotation: 7, duration: 0.4, ease: E.fast }, 14.5);
  tags.forEach((w, i) => tl.to(w, { y: 900, rotation: i ? 14 : -12, duration: 0.36, ease: E.fast }, 14.52 + i * 0.04));
}
