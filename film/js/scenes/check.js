// Checklist (22.5–26.5): BEFORE YOU SPEND THE CREDITS... CHECK THESE FIRST. — a taped, torn note with 8 rows,
// one tick every half-beat, then THEN GENERATE. stamps with an underline.
import { E, el, place, headline, linesIn, linesOut, measure, svg, path, tape, rng } from '../core.js';

export const meta = { box: { x: 64, y: 466, w: 936, h: 132, fs: 96, pad: 30, fit: true, lines: ['CHECK THESE FIRST.'] } };

const ROWS = ['TEST AT 480p', 'REFERENCES READY?', 'HARD SHOT BLOCKED?', 'PHYSICS DEFINED?', 'AUDIO PLANNED?', 'PROMPT STRUCTURED?', 'TESTING ONE FIRST?', 'HARD MOTION RECORDED?'];

export function build({ tl, layer, s, e }) {
  // headline: fitted to 936 px, same placement rules as the tips
  const L = ['BEFORE YOU SPEND', 'THE CREDITS...'];
  const size = Math.min(132, Math.floor(132 * 936 / Math.max(...L.map(l => measure(l, 132)))));
  const lines = headline(layer, L, { x: 64, y: 220 + (132 - size) * 0.86, size });
  linesIn(tl, lines, s - 0.08);
  linesOut(tl, lines, 26.15);

  // group that pushes slowly and slides down on exit
  const g = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 1000px' }, layer);

  // ---- the torn note
  const N = { x: 112, y: 644, w: 856, h: 704 };
  const r = rng(1010);
  const note = el('div', '', { position: 'absolute', filter: 'drop-shadow(0 16px 18px rgba(40,25,10,.28)) drop-shadow(0 3px 4px rgba(40,25,10,.12))' }, g); place(note, N);
  // torn right + bottom edges (polygon), straight top/left
  const pts = ['0 0', `${N.w - 6}px 0`];
  for (let y = 18; y < N.h - 10; y += 22) pts.push(`${N.w - 4 - r() * 10}px ${y}px`);
  for (let x = N.w - 10; x > 6; x -= 20) pts.push(`${x}px ${N.h - 2 - r() * 12}px`);
  pts.push(`0 ${N.h - 4}px`);
  const sheet = el('div', '', { position: 'absolute', inset: 0, background: '#F3EDE2', clipPath: `polygon(${pts.join(',')})` }, note);
  el('div', '', { position: 'absolute', inset: 0, background: 'linear-gradient(170deg,rgba(255,255,255,.35),rgba(0,0,0,0) 40%,rgba(120,90,50,.06))' }, sheet);
  // spiral holes on the left edge (torn from a pad)
  for (let i = 0; i < 12; i++) {
    el('div', '', { position: 'absolute', left: '16px', top: (34 + i * 55) + 'px', width: '22px', height: '22px', borderRadius: '50%', background: '#E2D9C9', boxShadow: 'inset 2px 3px 4px rgba(60,40,20,.35)' }, sheet);
  }
  tape(note, { x: N.w / 2 - 80, y: -22, w: 160, rot: -2 });

  // rows
  const top = 52, pitch = 78;
  const rows = [], ticks = [], boxes = [];
  ROWS.forEach((label, i) => {
    const y = top + i * pitch;
    const row = el('div', '', { position: 'absolute', left: 0, top: y + 'px', width: N.w + 'px', height: pitch + 'px' }, note);
    const num = el('div', 'disp abs', { left: '84px', top: '12px', fontSize: '60px', color: 'var(--orange)' }, row, String(i + 1).padStart(2, '0'));
    // ink checkbox (slightly wobbly)
    const bx = el('div', 'abs', { left: '196px', top: '15px', width: '48px', height: '48px' }, row);
    const bs = svg(bx, { x: 0, y: 0, w: 48, h: 48, vb: '0 0 48 48' });
    const j = () => (r() - 0.5) * 3;
    path(bs, `M${4 + j()} ${5 + j()} L${44 + j()} ${4 + j()} L${44 + j()} ${44 + j()} L${4 + j()} ${44 + j()} Z`, { stroke: '#111', width: 4 });
    // the tick (bigger than the box, hand-made)
    const ts = svg(bx, { x: -6, y: -22, w: 78, h: 70, vb: '0 0 90 80' });
    const tk = path(ts, 'M8 44 L33 68 L84 6', { stroke: 'var(--orange)', width: 13 });
    tk.style.strokeDasharray = '125 127'; tk.style.strokeDashoffset = 125;
    el('div', 'sans abs', { left: '284px', top: '20px', fontSize: '36px', letterSpacing: '-.01em', whiteSpace: 'nowrap' }, row, label);
    if (i < ROWS.length) el('div', 'abs', { left: '84px', right: '86px', bottom: '0', height: '2px', background: 'rgba(0,0,0,.28)' }, row);
    rows.push(row); ticks.push(tk); boxes.push(bx);
  });

  // THEN GENERATE. + underline
  const tgSize = 112, tgW = measure('THEN GENERATE.', tgSize);
  const tg = el('div', 'disp abs', { fontSize: tgSize + 'px', transformOrigin: '50% 60%' }, g, 'THEN GENERATE.'); place(tg, { x: 540 - tgW / 2, y: 1372 });
  const us = svg(g, { x: 540 - tgW / 2 - 10, y: 1474, w: tgW + 20, h: 30, vb: `0 0 ${tgW + 20} 30` });
  const ul = path(us, `M6 18 C${tgW * 0.3} 8 ${tgW * 0.7} 22 ${tgW + 14} 10`, { stroke: 'var(--orange)', width: 10 });
  const uL = ul.getTotalLength(); ul.style.strokeDasharray = uL + ' ' + (uL + 2);

  // ---- entrance: the note slides up and settles; rows land by ~23.2
  tl.fromTo(note, { y: 1350, rotation: 5 }, { y: 0, rotation: -1, duration: 0.6, ease: E.land }, 22.42);
  rows.forEach((row, i) => tl.fromTo(row, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.26, ease: E.land, immediateRender: true }, 22.62 + i * 0.045));
  tl.fromTo(g, { scale: 1 }, { scale: 1.035, duration: 3.2, ease: E.soft }, 22.9);
  tl.to(note, { rotation: 0.6, duration: 3.0, ease: E.soft }, 23.05);

  // ---- one tick every half-beat, 23.3 → 25.05
  ticks.forEach((tk, i) => {
    const t = 23.3 + i * 0.25;
    tl.fromTo(tk, { strokeDashoffset: 125 }, { strokeDashoffset: 0, duration: 0.13, ease: 'power2.out', immediateRender: false }, t);
    tl.fromTo(boxes[i], { scale: 1 }, { scale: 1.18, duration: 0.07, ease: 'power2.out', yoyo: true, repeat: 1, immediateRender: false }, t + 0.06);
  });

  // ---- 25.5: THEN GENERATE. stamps, underline draws
  tl.fromTo(tg, { scale: 2.2, opacity: 0, rotation: -4 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.24, ease: 'power3.in', immediateRender: true }, 25.26);
  tl.fromTo(note, { y: 0 }, { y: 8, duration: 0.07, ease: 'power2.out', yoyo: true, repeat: 1, immediateRender: false }, 25.5);
  gsap.set(ul, { opacity: 0 }); tl.set(ul, { opacity: 1 }, 25.58);
  tl.fromTo(ul, { strokeDashoffset: uL }, { strokeDashoffset: 0, duration: 0.32, ease: 'power2.inOut', immediateRender: true }, 25.58);

  // ---- exit: the paper slides down
  tl.to(g, { y: 1400, duration: 0.42, ease: E.fast }, 26.08);
}
