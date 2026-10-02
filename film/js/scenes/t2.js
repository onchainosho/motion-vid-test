// Tip 2 (5.0–7.5): FIND THE LOOK BEFORE YOU GENERATE. — a messy wall of references snaps into a tidy reference pack.
import { E, el, polaroid, tag, tipHeadline, HANDOFF } from '../core.js';

export const meta = { box: { lines: ['BUILD A', 'REFERENCE PACK.'] } };

// 3×2 pack: x 64–1016, y 730–1500, equal 16 px gaps, shared edges.
const GX = 17, GY = 16, CW = (952 - 2 * GX) / 3, CH = (770 - GY) / 2;
const cell = i => ({ left: 64 + (i % 3) * (CW + GX), top: 730 + Math.floor(i / 3) * (CH + GY), width: CW, height: CH });

export function build(ctx) {
  const { tl, layer } = ctx;
  tipHeadline(ctx, ['FIND THE LOOK', 'BEFORE YOU GENERATE.']);

  // everything visual lives in one group so it can push and lift as one
  const g = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 1115px' }, layer);

  // wall layout (overlapping, Pinterest-like) → pack cell, entry offset, entry time
  const H = HANDOFF.t1t2;
  const P = [
    { src: 'final-desert', wall: { x: H.x, y: H.y, w: H.w, h: H.h, rot: H.rot }, cell: 0 },
    { src: 'jacket', wall: { x: 470, y: 728, w: 290, h: 360, rot: 5 }, cell: 1, from: { x: 300, y: -900, r: 18 }, at: 5.0 },
    { src: 'face', wall: { x: 700, y: 820, w: 300, h: 390, rot: -3 }, cell: 2, from: { x: 900, y: -200, r: 22 }, at: 5.06 },
    { src: 'location', wall: { x: 84, y: 1150, w: 460, h: 320, rot: 3 }, cell: 3, from: { x: -1000, y: 200, r: -20 }, at: 5.12 },
    { src: 'bag', wall: { x: 470, y: 1050, w: 280, h: 360, rot: -6 }, cell: 4, from: { x: 0, y: 1100, r: -14 }, at: 5.18 },
    { src: 'pin3', wall: { x: 640, y: 1180, w: 360, h: 300, rot: 6 }, cell: 5, from: { x: 300, y: 1000, r: 16 }, at: 5.24 },
  ];

  const items = P.map((p, i) => {
    const w = p.wall;
    const pol = polaroid(g, { x: w.x, y: w.y, w: w.w, h: w.h, src: p.src, rot: w.rot, pad: 16, tape: false });
    pol.root.style.zIndex = i + 1;
    // tape that stays centred whatever the width (photo 1 has none at the handoff; it gets taped on its landing)
    const tp = el('div', 'tape', { left: 'calc(50% - 75px)', top: '-20px', transform: `rotate(${[-3, 4, -5, 3, -4, 5][i]}deg)` }, pol.root);
    return { ...p, pol, tp };
  });

  // photo 1: the carried desert polaroid. Identical at 5.0; hidden before.
  const d = items[0];
  tl.set(d.pol.root, { visibility: 'hidden' }, 0);
  tl.set(d.pol.root, { visibility: 'visible' }, 5.0);
  gsap.set(d.tp, { opacity: 0 });
  tl.to(d.pol.root, { left: H.x - 14, top: H.y - 26, rotation: -7, duration: 0.55, ease: E.land2 }, 5.0);
  tl.fromTo(d.tp, { opacity: 0, scale: 1.6 }, { opacity: 0.92, scale: 1, duration: 0.22, ease: E.pop, immediateRender: false }, 5.5);

  // the other five fly in and pile up, the last one lands on the 5.5 beat
  items.slice(1).forEach((it, k) => {
    const f = it.from, dur = k === 4 ? 0.36 : 0.42;
    const at = k === 4 ? 5.5 - dur : it.at;
    tl.fromTo(it.pol.root, { x: f.x, y: f.y, rotation: it.wall.rot + f.r },
      { x: 0, y: 0, rotation: it.wall.rot, duration: dur, ease: k === 4 ? 'power3.out' : E.land, immediateRender: true }, at);
    tl.set(it.pol.root, { visibility: 'hidden' }, 0); tl.set(it.pol.root, { visibility: 'visible' }, at);
  });
  // impact of the last photo: the wall jolts
  tl.fromTo(g, { y: 0 }, { y: 10, duration: 0.06, ease: 'power2.out', immediateRender: false }, 5.5);
  tl.to(g, { y: 0, duration: 0.3, ease: E.land2 }, 5.56);

  // snap into a tidy 3×2 pack, landing on the 6.0 beat
  items.forEach((it, i) => {
    const c = cell(it.cell);
    tl.to(it.pol.root, { ...c, x: 0, y: 0, rotation: 0, duration: 0.42, ease: 'power4.inOut' }, 5.58 + (i % 3) * 0.01);
  });
  tl.fromTo(g, { scale: 1 }, { scale: 0.985, duration: 0.2, ease: 'power2.in', immediateRender: false }, 5.8);
  tl.to(g, { scale: 1, duration: 0.3, ease: E.land }, 6.0);

  // two hand labels on the beat 6.25
  const fc = cell(2), lc = cell(3);
  const tC = tag(g, 'CHARACTER', { x: fc.left + 28, y: fc.top + fc.height - 92, size: 42, rot: -4 });
  const tL = tag(g, 'LOCATION', { x: lc.left + 22, y: lc.top + lc.height - 84, size: 42, rot: 3 });
  [tC, tL].forEach((t, i) => { t.style.zIndex = 20; gsap.set(t, { opacity: 0 }); tl.fromTo(t, { opacity: 0, scale: 1.5, y: -30 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: E.pop, immediateRender: false }, 6.25 + i * 0.08); });

  // slow push, then the pack lifts up and out fast
  tl.fromTo(g, { scale: 1 }, { scale: 1.02, duration: 0.75, ease: E.soft, immediateRender: false }, 6.3);
  items.forEach((it, i) => tl.to(it.pol.root, { y: -1500 - (i % 3) * 80, rotation: (i % 2 ? 4 : -4), duration: 0.42, ease: E.fast }, 7.05 + (i % 3) * 0.03 + Math.floor(i / 3) * 0.04));
  [tC, tL].forEach((t, i) => tl.to(t, { y: -1500, duration: 0.42, ease: E.fast }, 7.05 + i * 0.05));
}
