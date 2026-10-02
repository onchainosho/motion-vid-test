// Tip 2 (5.0–7.5): FIND THE LOOK BEFORE YOU GENERATE. — a messy wall of references snaps into a tidy reference pack.
import { E, el, polaroid, tag, tipHeadline, HANDOFF } from '../core.js';

export const meta = { box: { lines: ['BUILD A', 'REFERENCE PACK.'] } };

// 3×2 pack under the box (bottom y 758): x 64–920, y 790–1560, equal 16 px gaps, shared edges.
// Kept at x ≤ 920 so the 3.5% push still ends inside x ≤ 940.
const PX = 64, PY = 790, PW = 856, PH = 770, G = 16;
const CW = (PW - 2 * G) / 3, CH = (PH - G) / 2;
const cell = i => ({ left: PX + (i % 3) * (CW + G), top: PY + Math.floor(i / 3) * (CH + G), width: CW, height: CH });

export function build(ctx) {
  const { tl, layer } = ctx;
  tipHeadline(ctx, ['FIND THE LOOK', 'BEFORE YOU GENERATE.']);

  // everything visual lives in one group so it can push and leave as one
  const g = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '400px 1175px' }, layer);

  // wall layout (overlapping, Pinterest-like) → pack cell, entry offset, entry time
  const H = HANDOFF.t1t2;
  const P = [
    { src: 'final-desert', wall: { x: H.x, y: H.y, w: H.w, h: H.h, rot: H.rot }, cell: 0 },
    { src: 'jacket', wall: { x: 470, y: 800, w: 280, h: 360, rot: 5 }, cell: 1, from: { x: 1000, y: 120, r: 18 }, at: 5.0 },
    { src: 'face', wall: { x: 650, y: 890, w: 290, h: 380, rot: -3 }, cell: 2, from: { x: 900, y: -60, r: 22 }, at: 5.06 },
    { src: 'location', wall: { x: 70, y: 1210, w: 440, h: 310, rot: 3 }, cell: 3, from: { x: -1000, y: 200, r: -20 }, at: 5.12 },
    { src: 'bag', wall: { x: 450, y: 1130, w: 270, h: 350, rot: -6 }, cell: 4, from: { x: 0, y: 1000, r: -14 }, at: 5.18 },
    { src: 'pin3', wall: { x: 610, y: 1250, w: 330, h: 280, rot: 6 }, cell: 5, from: { x: 300, y: 900, r: 16 } },
  ];

  const items = P.map((p, i) => {
    const w = p.wall;
    const pol = polaroid(g, { x: w.x, y: w.y, w: w.w, h: w.h, src: p.src, rot: w.rot, pad: 16, tape: false });
    pol.root.style.zIndex = i + 1;
    // tape that stays centred whatever the width (photo 1 has none at the handoff; it gets taped on its landing)
    const tp = el('div', 'tape', { left: 'calc(50% - 75px)', top: '-20px', transform: `rotate(${[-3, 4, -5, 3, -4, 5][i]}deg)` }, pol.root);
    return { ...p, pol, tp };
  });

  // photo 1: the carried desert polaroid. Identical at 5.0 (HANDOFF.t1t2); hidden before.
  const d = items[0];
  tl.set(d.pol.root, { visibility: 'hidden' }, 0);
  tl.set(d.pol.root, { visibility: 'visible' }, 5.0);
  gsap.set(d.tp, { opacity: 0 });
  tl.to(d.pol.root, { left: H.x - 10, top: H.y + 14, rotation: -7, duration: 0.55, ease: E.land2 }, 5.0);
  tl.fromTo(d.tp, { opacity: 0, scale: 1.6 }, { opacity: 0.92, scale: 1, duration: 0.22, ease: E.pop, immediateRender: false }, 5.5);

  // the other five fly in from the sides/below (never through the text) and pile up; the last lands on the 5.5 beat
  items.slice(1).forEach((it, k) => {
    const f = it.from, last = k === 4, dur = last ? 0.36 : 0.42;
    const at = last ? 5.5 - dur : it.at;
    tl.fromTo(it.pol.root, { x: f.x, y: f.y, rotation: it.wall.rot + f.r },
      { x: 0, y: 0, rotation: it.wall.rot, duration: dur, ease: last ? 'power3.out' : E.land, immediateRender: true }, at);
    tl.set(it.pol.root, { visibility: 'hidden' }, 0); tl.set(it.pol.root, { visibility: 'visible' }, at);
  });
  // impact of the last photo: the wall jolts
  tl.fromTo(g, { y: 0 }, { y: 10, duration: 0.06, ease: 'power2.out', immediateRender: false }, 5.5);
  tl.to(g, { y: 0, duration: 0.3, ease: E.land2 }, 5.56);

  // snap into a tidy 3×2 pack, landing on the 6.0 beat
  items.forEach((it, i) => {
    tl.to(it.pol.root, { ...cell(it.cell), x: 0, y: 0, rotation: 0, duration: 0.42, ease: 'power4.inOut' }, 5.58 + (i % 3) * 0.01);
  });
  tl.fromTo(g, { scale: 1 }, { scale: 0.985, duration: 0.2, ease: 'power2.in', immediateRender: false }, 5.8);
  tl.to(g, { scale: 1, duration: 0.25, ease: E.land }, 6.0);

  // two hand labels: the tag slaps on at 6.25, then its word writes on (left → right reveal)
  const fc = cell(2), lc = cell(3);
  const mk = (text, x, y, rot, at) => {
    const t = tag(g, text, { x, y, size: 44, rot }); t.style.zIndex = 20;
    const word = t.firstChild;
    gsap.set(t, { opacity: 0 });
    tl.fromTo(t, { opacity: 0, scale: 1.4, y: -24 }, { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: E.pop, immediateRender: false }, at);
    tl.fromTo(word, { clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% 0% -10% 0)', duration: 0.4, ease: 'power1.inOut', immediateRender: true }, at + 0.12);
    return t;
  };
  const tC = mk('CHARACTER', fc.left + 22, fc.top + fc.height - 96, -4, 6.25);
  const tL = mk('LOCATION', lc.left + 20, lc.top + lc.height - 92, 3, 6.5);

  // secondary motion while the pack holds: the CHARACTER photo lifts toward camera, then settles back
  const face = items[2].pol.root;
  tl.to(face, { scale: 1.07, rotation: -2.5, y: -14, zIndex: 15, boxShadow: '0 40px 60px -18px rgba(40,25,10,.45), 0 6px 14px rgba(40,25,10,.15)', duration: 0.35, ease: E.land2 }, 6.25);
  tl.to(face, { scale: 1, rotation: 0, y: 0, duration: 0.35, ease: E.soft }, 6.7);
  tl.to([tC, tL], { rotation: (i) => (i ? 5 : -1.5), duration: 0.5, ease: E.soft }, 6.55);
  // a 3.5% push over the whole hold
  tl.fromTo(g, { scale: 1 }, { scale: 1.035, duration: 0.85, ease: E.soft, immediateRender: false }, 6.25);

  // exit: the pack drops away downward (never through the text), staggered by column
  items.forEach((it, i) => tl.to(it.pol.root, { y: 1200, rotation: (i % 2 ? 5 : -5), duration: 0.4, ease: E.fast }, 7.05 + (i % 3) * 0.035 + (Math.floor(i / 3) ? 0 : 0.03)));
  tl.to(tC, { y: 1200, duration: 0.4, ease: E.fast }, 7.135);
  tl.to(tL, { y: 1200, duration: 0.4, ease: E.fast }, 7.05);
}
