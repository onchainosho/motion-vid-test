// Tip 8 (20.0–22.5): HARD MOTION? USE YOUR PHONE. RECORD IT FIRST. — tip 7's TEST 01 frame becomes a phone screen,
// the phone records a rough stop-motion take, then the screen turns into the warm styled shot.
import { E, el, place, img, tag, tipHeadline, HANDOFF } from '../core.js';
import { test01Img } from './t7.js';

export const meta = { box: { lines: ['RECORD IT FIRST.'] } };

export async function build(ctx) {
  const { tl, layer } = ctx;
  tipHeadline(ctx, ['HARD MOTION?', 'USE YOUR PHONE.']);

  const H = HANDOFF.t7t8, B = 16; // screen rect at 20.0 and bezel width
  const cx = H.x + H.w / 2, cy = H.y + H.h / 2;
  // phone group: everything that pushes and drops together (pivot = screen centre)
  const g = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: `${cx}px ${cy}px`, visibility: 'hidden' }, layer);
  gsap.set(g, { visibility: 'hidden' });
  tl.set(g, { visibility: 'visible' }, 20.0);

  // body: starts exactly on the screen rect and grows out around it
  const body = el('div', '', { position: 'absolute', background: 'linear-gradient(135deg,#2a2a2a,#0c0c0c 40%,#151515)', boxShadow: '0 30px 60px -20px rgba(30,18,6,.6),0 6px 16px rgba(30,18,6,.25), inset 0 0 0 2px #3a3a3a' }, g);
  const R0 = { left: H.x, top: H.y, width: H.w, height: H.h, borderRadius: 34 };
  const R1 = { left: H.x - B, top: H.y - B, width: H.w + 2 * B, height: H.h + 2 * B, borderRadius: 52 };
  gsap.set(body, R0);
  // side buttons
  const btns = [[H.x + H.w + B - 2, H.y + 150, 6, 90], [H.x - B - 4, H.y + 120, 6, 60], [H.x - B - 4, H.y + 200, 6, 60]].map(([x, y, w, h]) => {
    const b = el('div', '', { position: 'absolute', background: '#1b1b1b', borderRadius: '3px' }, g); place(b, { x, y, w, h }); return b;
  });

  // screen: identical to tip 7's TEST 01 element at 20.0
  const screen = el('div', '', { position: 'absolute', overflow: 'hidden', borderRadius: '34px', background: '#111' }, g); place(screen, H);
  const s0 = await test01Img(screen, { objectPosition: '25% 50%' });
  const fr = ['rough1', 'rough2', 'rough3'].map(n => img(n, screen, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }));
  const sty = img('styled', screen, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', clipPath: 'inset(0 100% 0 0)' });
  // light sweep for the styled reveal
  const sweep = el('div', '', { position: 'absolute', top: '-10%', height: '120%', width: '180px', left: '-200px', background: 'linear-gradient(90deg,rgba(255,236,200,0),rgba(255,236,200,.75),rgba(255,236,200,0))', transform: 'skewX(-14deg)', mixBlendMode: 'screen' }, screen);
  // recording UI (wordless): red dot + progress bar
  const rec = el('div', '', { position: 'absolute', left: '26px', top: '70px', width: '22px', height: '22px', borderRadius: '50%', background: '#E5322B', boxShadow: '0 0 0 4px rgba(255,255,255,.55)', opacity: 0 }, screen);
  const barBg = el('div', '', { position: 'absolute', left: '26px', right: '26px', bottom: '36px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.35)', opacity: 0 }, screen);
  const bar = el('div', '', { position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', borderRadius: '4px', background: 'var(--orange)', transformOrigin: '0 50%' }, barBg);
  // island
  const island = el('div', '', { position: 'absolute', left: (cx - 56) + 'px', top: (H.y + 16) + 'px', width: '112px', height: '32px', borderRadius: '16px', background: '#050505' }, g);

  // labels (2): ROUGH TAKE → STYLED SHOT, a taped tag under the phone
  const lab = el('div', 'abs', { left: '330px', top: '1430px', width: '420px', height: '90px', zIndex: 5 }, g);
  const tA = tag(lab, 'ROUGH TAKE', { x: 60, y: 0, size: 44, rot: -3 });
  const tB = tag(lab, 'STYLED SHOT', { x: 50, y: 0, size: 44, rot: -3 }); gsap.set(tB, { rotationX: 90, opacity: 0 });

  // ---- 20.0–20.3: the body grows around the screen
  gsap.set([island, ...btns], { opacity: 0 });
  tl.fromTo(body, R0, { ...R1, duration: 0.3, ease: E.land, immediateRender: false }, 20.0);
  tl.fromTo(island, { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, duration: 0.25, ease: E.land, immediateRender: false }, 20.12);
  tl.to(btns, { opacity: 1, duration: 0.2 }, 20.15);
  // slow push on the phone, 20.25 → drop
  tl.fromTo(g, { scale: 1 }, { scale: 1.05, duration: 1.85, ease: E.soft, immediateRender: false }, 20.25);

  // ---- 20.5: record — rough take stop-motion on quarter-beats
  tl.fromTo(lab, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: E.land, immediateRender: true }, 20.38);
  tl.fromTo(rec, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: 0.2, ease: E.pop, immediateRender: false }, 20.5);
  tl.set(barBg, { opacity: 1 }, 20.5);
  tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'none', immediateRender: true }, 20.5);
  tl.to(rec, { opacity: 0.25, duration: 0.12, yoyo: true, repeat: 3, ease: 'power1.inOut' }, 20.75);
  tl.set(fr[0], { opacity: 1 }, 20.5); tl.set(s0, { opacity: 0 }, 20.5);
  tl.set(fr[1], { opacity: 1 }, 20.75); tl.set(fr[0], { opacity: 0 }, 20.75);
  tl.set(fr[2], { opacity: 1 }, 21.0); tl.set(fr[1], { opacity: 0 }, 21.0);
  // a little handheld jolt on each new frame
  [20.5, 20.75, 21.0].forEach((t, i) => tl.fromTo(screen, { x: [-5, 4, -3][i], y: [3, -4, 2][i] }, { x: 0, y: 0, duration: 0.2, ease: 'power2.out', immediateRender: false }, t));

  // ---- 21.5: the screen turns into the styled shot with a light sweep; label flips
  tl.to([rec, barBg], { opacity: 0, duration: 0.12 }, 21.45);
  tl.fromTo(sty, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.28, ease: E.move, immediateRender: false }, 21.45);
  tl.fromTo(sweep, { x: 0 }, { x: H.w + 420, duration: 0.42, ease: 'none', immediateRender: false }, 21.4);
  tl.fromTo(sty, { scale: 1.12 }, { scale: 1, duration: 0.6, ease: E.land, immediateRender: false }, 21.45);
  tl.to(tA, { rotationX: 90, duration: 0.1, ease: 'power2.in' }, 21.4);
  tl.set(tA, { opacity: 0 }, 21.5);
  tl.fromTo(tB, { rotationX: -90, opacity: 1 }, { rotationX: 0, duration: 0.22, ease: E.pop, immediateRender: false }, 21.5);
  tl.fromTo(g, { rotation: 0 }, { rotation: -1.5, duration: 0.5, ease: E.land2, immediateRender: false }, 21.5);

  // ---- exit: the phone drops away fast
  tl.to(g, { y: 1500, rotation: 9, duration: 0.45, ease: E.fast }, 22.1);
}
