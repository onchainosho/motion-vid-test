// Tip 5 (12.5–15.0): USING SEEDANCE AUDIO? / PROMPT IT TOO.
// The station polaroid; under it a waveform strip. A playhead sweeps, the bars it passes turn orange and rise,
// DIALOGUE then AMBIENCE light up, a speaker pops. Exit: the waveform collapses into one orange line (y = LINE_Y),
// which tip 6 picks up at 15.0.
import { E, el, place, polaroid, tag, svg, path, rng, tipHeadline } from '../core.js';

export const meta = { box: { lines: ['PROMPT IT TOO.'] } };

export const LINE_Y = 1390;              // shared with t6 (kept as a literal there too)
const X1 = 64, X2 = 1000, N = 47, STEP = 20, BW = 12;
const P0 = 13.0, P1 = 14.25;             // playhead sweep (linear)
const px2t = x => P0 + (x - X1) / (X2 - X1) * (P1 - P0);

// torn-paper outline for a tag
function torn(e, seed) {
  const r = rng(seed), pts = [];
  const n = 9;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n * 100).toFixed(1)}% ${(r() * 7).toFixed(1)}%`);
  for (let i = 0; i <= 5; i++) pts.push(`${(100 - r() * 3).toFixed(1)}% ${(i / 5 * 100).toFixed(1)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n * 100).toFixed(1)}% ${(100 - r() * 7).toFixed(1)}%`);
  for (let i = 5; i >= 0; i--) pts.push(`${(r() * 3).toFixed(1)}% ${(i / 5 * 100).toFixed(1)}%`);
  e.style.clipPath = `polygon(${pts.join(',')})`;
}

export function build(ctx) {
  const { tl, layer, s, e } = ctx;
  tipHeadline(ctx, ['USING SEEDANCE', 'AUDIO?']);

  // ---- station polaroid ----
  const P = { x: 136, y: 648, w: 808, h: 590 };
  const pol = polaroid(layer, { ...P, src: 'station', rot: -1.5, tapeRot: 3 });
  tl.fromTo(pol.root, { opacity: 0, y: 220, rotation: 5, scale: 0.9 }, { opacity: 1, y: 0, rotation: -1.5, scale: 1, duration: 0.6, ease: E.land, immediateRender: true }, 12.45);
  tl.to(pol.img, { scale: 1.06, duration: 1.6, ease: E.soft }, 12.9);

  // speaker sticker (pops when the sweep ends)
  const spk = el('div', 'abs', { left: '612px', top: '34px', width: '150px', height: '150px', borderRadius: '50%', background: '#F6F1E8', boxShadow: '0 10px 22px -8px rgba(40,25,10,.45)', opacity: 0 }, pol.root);
  const ss = svg(spk, { x: 0, y: 0, w: 150, h: 150, vb: '0 0 150 150' });
  path(ss, 'M30 60 H52 L80 36 V114 L52 90 H30 Z', { stroke: '#111', width: 7, fill: '#111' });
  const wv = [path(ss, 'M94 58 Q106 75 94 92', { stroke: 'var(--orange)', width: 8 }), path(ss, 'M108 44 Q130 75 108 106', { stroke: 'var(--orange)', width: 8 })];
  tl.fromTo(spk, { opacity: 0, scale: 0.2, rotation: -20 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.35, ease: E.pop, immediateRender: false }, P1);
  wv.forEach((p, i) => { p.style.strokeDasharray = '80 82'; tl.fromTo(p, { strokeDashoffset: 80 }, { strokeDashoffset: 0, duration: 0.18, ease: 'power2.out', immediateRender: true }, P1 + 0.12 + i * 0.08); });
  // waves pulse once more
  tl.fromTo(wv, { opacity: 1 }, { opacity: 0.35, duration: 0.12, yoyo: true, repeat: 1, ease: 'none', immediateRender: false }, P1 + 0.42);

  // ---- waveform strip ----
  const strip = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px' }, layer);
  const r = rng(505);
  const bars = [];
  for (let i = 0; i < N; i++) {
    const x = X1 + i * STEP, xc = x + BW / 2;
    let h;
    if (xc < 560) { const env = Math.pow(Math.abs(Math.sin(i * 0.52 + 0.4)), 0.8); h = 22 + 118 * env * (0.55 + 0.45 * r()); }   // dialogue: syllable bursts
    else { h = 24 + 46 * (0.5 + 0.5 * Math.sin(i * 0.33)) * (0.65 + 0.35 * r()); }                                            // ambience: low and steady
    h = Math.round(h);
    const b = el('div', 'abs', { left: x + 'px', top: (LINE_Y - h / 2) + 'px', width: BW + 'px', height: h + 'px', borderRadius: '6px', background: '#2B2723' }, strip);
    bars.push({ b, x, xc, h });
  }
  bars.forEach(({ b, xc }, i) => {
    tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: E.land2, immediateRender: true }, 12.6 + i * 0.008);
    const tb = px2t(xc);
    tl.to(b, { backgroundColor: '#EC6327', scaleY: 1.32, duration: 0.24, ease: E.pop }, tb);
  });
  // collapse into one orange line
  bars.forEach(({ b, x, h }, i) => {
    tl.to(b, { scaleY: 8 / (h * 1), height: h, width: i === N - 1 ? X2 - x : STEP + 1, borderRadius: 0, backgroundColor: '#EC6327', duration: 0.25, ease: 'power3.in' }, 14.5 + Math.abs(i - N / 2) * 0.002);
  });
  tl.set(strip, { visibility: 'hidden' }, 14.75);
  const ls = svg(layer, {});
  const line = path(ls, `M${X1 + 4} ${LINE_Y} L${X2 - 4} ${LINE_Y}`, { stroke: 'var(--orange)', width: 8 });
  gsap.set(line, { opacity: 0 });
  tl.set(line, { opacity: 1 }, 14.75);
  tl.set(line, { opacity: 0 }, 15.0); // tip 6 draws the identical line from 15.0

  // ---- playhead ----
  const ph = el('div', 'abs', { left: (X1 - 3) + 'px', top: (LINE_Y - 118) + 'px', width: '6px', height: '236px', background: '#111', borderRadius: '3px', transformOrigin: '50% 50%' }, layer);
  const knob = svg(ph, { x: -13, y: -24, w: 32, h: 28, vb: '0 0 32 28' });
  path(knob, 'M2 2 H30 L16 26 Z', { stroke: '#111', width: 3, fill: 'var(--orange)' });
  tl.fromTo(ph, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.25, ease: E.land, immediateRender: true }, 12.78);
  tl.to(ph, { x: X2 - X1, duration: P1 - P0, ease: 'none' }, P0);
  tl.to(ph, { scaleY: 0, opacity: 0, duration: 0.18, ease: E.leave }, P1 + 0.05);

  // ---- tags: DIALOGUE, AMBIENCE ----
  const tags = [['DIALOGUE', 251, -3, 1201], ['AMBIENCE', 812, 2.5, 1207]].map(([txt, cx, rot, y], i) => {
    const w = el('div', 'abs', { left: 0, top: 0, filter: 'drop-shadow(0 8px 10px rgba(40,25,10,.3))' }, layer);
    const t = tag(w, txt, { x: 0, y: 0, size: 44, rot: 0 });
    t.style.boxShadow = 'none'; torn(t, 77 + i);
    const tw = t.offsetWidth;
    place(w, { x: cx - tw / 2, y });
    gsap.set(w, { rotation: rot });
    const txtEl = t.firstChild;
    tl.fromTo(w, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.4, ease: E.land, immediateRender: true }, 12.7 + i * 0.1);
    tl.fromTo(txtEl, { opacity: 0.38 }, { opacity: 0.38, duration: 0.01, immediateRender: true }, 12.7);
    const at = px2t(cx);
    tl.to(t, { backgroundColor: '#EC6327', duration: 0.12, ease: 'none' }, at);
    tl.to(txtEl, { opacity: 1, color: '#F7F0E6', duration: 0.12, ease: 'none' }, at);
    tl.fromTo(w, { scale: 1.22 }, { scale: 1, duration: 0.35, ease: E.pop, immediateRender: false }, at);
    return w;
  });

  // ---- exit: photo and tags drop fast behind the strip ----
  tl.to(pol.root, { y: 1400, rotation: 7, duration: 0.4, ease: E.fast }, 14.5);
  tags.forEach((w, i) => tl.to(w, { y: 900, rotation: i ? 14 : -12, duration: 0.36, ease: E.fast }, 14.52 + i * 0.04));
}
