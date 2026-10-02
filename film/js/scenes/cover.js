// Cover (0.0–2.5): finished composition at frame 0; the SEEDANCE 2.5 box flies through the camera.
import { M, E, el, place, img, headline, sans, measure, svg, path, tick, linesOut } from '../core.js';

export const meta = { box: { x: 64, y: 524, w: 952, h: 196, fs: 176, lines: ['SEEDANCE 2.5'], pad: 34, fit: true }, pre: 0, post: 0.05 };

function filmFrame(parent, { x, y, w, h, rot, grey, z }) {
  const f = el('div', 'polaroid', { padding: '14px 14px 14px 52px', zIndex: z }, parent); place(f, { x, y, w, h });
  const strip = el('div', 'strip', { left: '10px', top: '14px', bottom: '14px', width: '34px' }, f);
  for (let i = 0; i < 6; i++) el('i', '', { top: (14 + i * ((h - 60) / 5)) + 'px', left: '8px', width: '18px', height: '20px' }, strip);
  const ph = el('div', 'ph', null, f);
  img('car-sunset', ph, grey ? { filter: 'grayscale(1) contrast(.85) brightness(.82)' } : null);
  const mark = el('div', '', { position: 'absolute', right: '26px', top: '26px', width: '62px', height: '62px', background: '#111', borderRadius: '8px' }, f);
  gsap.set(f, { rotation: rot });
  return { f, mark };
}

function coin(parent, { x, y, rot = 0, z = 0 }) {
  const c = el('div', '', { position: 'absolute', width: '190px', height: '74px', zIndex: z }, parent); place(c, { x, y });
  el('div', '', { position: 'absolute', inset: '0', top: '16px', background: '#B9461A', borderRadius: '50%' }, c);       // edge
  const face = el('div', '', { position: 'absolute', left: 0, top: 0, width: '190px', height: '74px', background: 'radial-gradient(ellipse at 40% 35%, #F58A4E, #EC6327 55%, #D9541C)', borderRadius: '50%', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.12)' }, c);
  const s = svg(face, { x: 70, y: 13, w: 50, h: 48, vb: '0 0 50 48' });
  path(s, 'M25 2 C27 18 32 22 48 24 C32 26 27 30 25 46 C23 30 18 26 2 24 C18 22 23 18 25 2Z', { stroke: 'none', width: 0, fill: '#F7F0E6' });
  gsap.set(c, { rotation: rot });
  return c;
}

export function build({ tl, layer, s, e, box, boxText }) {
  // headline (fit both lines to the box width)
  const L = ['HOW TO SAVE', 'CREDITS ON'];
  const size = Math.floor(176 * 952 / Math.max(...L.map(l => measure(l, 176))));
  const lines = headline(layer, L, { x: 64, y: 524 - 2 * size * 0.86 - 14, size });
  const sub = sans(layer, '8 practical ways to<br>waste fewer generations.', { x: 66, y: 752, size: 60 });

  // visual group: film frames + coins
  const g = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 1250px' }, layer);
  const frames = [
    filmFrame(g, { x: 70, y: 980, w: 470, h: 340, rot: -11, grey: true, z: 1 }),
    filmFrame(g, { x: 130, y: 1020, w: 470, h: 340, rot: -7, grey: true, z: 2 }),
    filmFrame(g, { x: 190, y: 1060, w: 470, h: 340, rot: -3, grey: true, z: 3 }),
  ];
  frames.forEach(({ mark }) => { const x = svg(mark, { x: 12, y: 12, w: 38, h: 38, vb: '0 0 38 38' }); path(x, 'M6 6 L32 32 M32 6 L6 32', { stroke: '#F7F0E6', width: 7 }); });
  const good = filmFrame(g, { x: 250, y: 1080, w: 580, h: 420, rot: 2.5, grey: false, z: 4 });
  const okTick = tick(good.mark, { x: 6, y: 8, s: 0.56, width: 13 });
  const coins = [];
  for (let i = 0; i < 5; i++) coins.push(coin(g, { x: 740, y: 1420 - i * 30, z: 10 + i }));
  const drop1 = coin(g, { x: 740, y: 1420 - 5 * 30, z: 15 });
  const drop2 = coin(g, { x: 740, y: 1420 - 6 * 30, z: 16 });
  coin(g, { x: 660, y: 1470, rot: -8, z: 20 });

  // --- alive from frame 0 ---
  tl.fromTo(g, { scale: 1 }, { scale: 1.06, duration: 1.95, ease: 'sine.inOut' }, 0);
  tl.fromTo(lines[0], { x: 0 }, { x: -14, duration: 1.95, ease: 'sine.out' }, 0);
  tl.fromTo(lines[1], { x: 0 }, { x: 14, duration: 1.95, ease: 'sine.out' }, 0);
  const fanTo = [[-17, -40, -10], [-10, -18, 0], [-4, 0, 6]];
  frames.forEach(({ f }, i) => tl.to(f, { rotation: fanTo[i][0], x: fanTo[i][1], y: fanTo[i][2], duration: 1.9, ease: 'sine.out' }, 0.05 + i * 0.05));
  tl.fromTo(good.f, { y: 0, rotation: 2.5 }, { y: -30, rotation: 0.5, duration: 1.85, ease: 'sine.inOut' }, 0.1);
  // the tick stamps on the beat
  tl.fromTo(okTick, { strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 0.22, ease: 'power2.out', immediateRender: true }, 0.5);
  okTick.style.strokeDasharray = '120 122';
  tl.fromTo(good.mark, { scale: 1.6 }, { scale: 1, duration: 0.3, ease: E.pop }, 0.5);
  // coins drop onto the stack on beats
  [[drop1, 1.0], [drop2, 1.5]].forEach(([c, t]) => {
    tl.fromTo(c, { y: -320, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26, ease: 'power2.in', immediateRender: true }, t - 0.26);
    tl.fromTo(c, { scaleY: 0.82 }, { scaleY: 1, duration: 0.22, ease: 'back.out(3)' }, t);
  });

  // a second beat of life at 1.5: the good frame lifts toward camera as the last coin lands
  tl.to(good.f, { scale: 1.06, rotation: -1, duration: 0.45, ease: E.land2 }, 1.5);
  frames.forEach(({ f }, i) => tl.to(f, { x: '-=' + (12 + i * 6), duration: 0.45, ease: E.land2 }, 1.5));

  // --- exit: lines split, visuals fall, the box flies through the camera ---
  linesOut(tl, lines, 1.95);
  tl.to(sub, { y: 60, opacity: 0, duration: 0.25, ease: E.leave }, 1.95);
  tl.to(g, { y: 900, duration: 0.42, ease: E.fast }, 1.95);
  tl.to(box, { scale: 24, duration: 0.47, ease: 'expo.in', transformOrigin: '50% 50%' }, 2.0);
  tl.to(box, { scale: 1, duration: 0.5, ease: 'expo.out' }, 2.48);
}
