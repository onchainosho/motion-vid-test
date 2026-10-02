// Tip 8 (20.0–22.5): HARD MOTION? USE YOUR PHONE. RECORD IT FIRST. — laid out like slide 09:
// tip 7's TEST 01 frame becomes the phone screen; the phone records a rough take (3-frame strip on the left),
// the strip arrows into SEEDANCE 2.5, which arrows into the phone and resolves the styled shot.
import { E, el, place, img, tag, hand, svg, path, arrow, tape, tipHeadline, HANDOFF } from '../core.js';
import { test01Img } from './t7.js';

export const meta = { box: { lines: ['RECORD IT FIRST.'] } };

export async function build(ctx) {
  const { tl, layer } = ctx;
  tipHeadline(ctx, ['HARD MOTION?', 'USE YOUR PHONE.']);

  const H = HANDOFF.t7t8;
  // final phone: body x520–980, y700–1520; screen inset 18
  const BODY = { left: 520, top: 700, width: 460, height: 820, borderRadius: 60 };
  const B = 18;
  const SCR = { left: BODY.left + B, top: BODY.top + B, width: BODY.width - 2 * B, height: BODY.height - 2 * B, borderRadius: 44 };

  // everything lives in one group: pushes and drops together
  const g = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 1110px' }, layer);

  // ---------------- phone
  const ph = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px' }, g);
  gsap.set(ph, { visibility: 'hidden' }); tl.set(ph, { visibility: 'visible' }, 20.0);
  const body = el('div', '', { position: 'absolute', background: 'linear-gradient(135deg,#2c2c2c,#0c0c0c 40%,#161616)', boxShadow: '0 30px 60px -20px rgba(30,18,6,.6),0 6px 16px rgba(30,18,6,.25), inset 0 0 0 2px #3a3a3a' }, ph);
  const R0 = { left: H.x, top: H.y, width: H.w, height: H.h, borderRadius: 34 };
  gsap.set(body, R0);
  const btnR = el('div', '', { position: 'absolute', right: '-6px', top: '22%', width: '6px', height: '12%', background: '#1b1b1b', borderRadius: '3px' }, body);
  const btnL = el('div', '', { position: 'absolute', left: '-6px', top: '18%', width: '6px', height: '8%', background: '#1b1b1b', borderRadius: '3px' }, body);
  const screen = el('div', '', { position: 'absolute', overflow: 'hidden', background: '#111' }, ph);
  gsap.set(screen, R0);
  const s0 = await test01Img(screen, { objectPosition: '25% 50%' });
  const fit = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' };
  const fr = ['rough1', 'rough2', 'rough3'].map(n => img(n, screen, { ...fit, opacity: 0 }));
  const sty = img('styled', screen, { ...fit, clipPath: 'inset(0 100% 0 0)' });
  const flash = el('div', '', { position: 'absolute', inset: 0, background: '#FFF4E2', opacity: 0 }, screen);
  const sweep = el('div', '', { position: 'absolute', top: '-10%', height: '120%', width: '200px', left: '-220px', background: 'linear-gradient(90deg,rgba(255,236,200,0),rgba(255,236,200,.8),rgba(255,236,200,0))', transform: 'skewX(-14deg)', mixBlendMode: 'screen' }, screen);
  const rec = el('div', '', { position: 'absolute', left: '30px', top: '78px', width: '24px', height: '24px', borderRadius: '50%', background: '#E5322B', boxShadow: '0 0 0 4px rgba(255,255,255,.55)', opacity: 0 }, screen);
  const barBg = el('div', '', { position: 'absolute', left: '30px', right: '30px', bottom: '40px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.35)', opacity: 0 }, screen);
  const bar = el('div', '', { position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', borderRadius: '4px', background: 'var(--orange)', transformOrigin: '0 50%' }, barBg);
  const island = el('div', '', { position: 'absolute', left: '50%', top: '16px', width: '120px', height: '34px', marginLeft: '-60px', borderRadius: '17px', background: '#050505', opacity: 0 }, screen);

  // the screen leaves the handoff rect and grows into the big phone; the body grows around it
  tl.fromTo(screen, R0, { ...SCR, duration: 0.45, ease: E.move, immediateRender: false }, 20.0);
  tl.fromTo(body, R0, { ...BODY, duration: 0.45, ease: E.move, immediateRender: false }, 20.0);
  tl.to(island, { opacity: 1, duration: 0.15 }, 20.1);
  gsap.set([btnL, btnR], { opacity: 0 }); tl.to([btnL, btnR], { opacity: 1, duration: 0.2 }, 20.2);

  // ---------------- rough-take strip (left), slide-09 style
  const C = { x: 64, y: 668, w: 356, h: 400 };
  const card = el('div', 'card', { background: '#F1EADD' }, g); place(card, C);
  tape(card, { x: C.w / 2 - 70, y: -20, w: 140, rot: -3 });
  const lRough = hand(card, 'ROUGH TAKE', { x: 18, y: 22, size: 40, rot: -3, ul: true });
  lRough.style.position = 'absolute';
  const FW = 100, FH = 230, FY = 96;
  const frames = ['rough1', 'rough2', 'rough3'].map((n, i) => {
    const f = el('div', '', { position: 'absolute', left: (16 + i * (FW + 12)) + 'px', top: FY + 'px', width: FW + 'px', height: FH + 'px', overflow: 'hidden', background: '#222', boxShadow: '0 0 0 0 var(--orange)' }, card);
    img(n, f, fit);
    return f;
  });
  // wordless play bar under the frames
  const pbar = el('div', '', { position: 'absolute', left: '16px', right: '16px', top: (FY + FH + 22) + 'px', height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,.18)' }, card);
  const pfill = el('div', '', { position: 'absolute', inset: 0, borderRadius: '3px', background: '#111', transformOrigin: '0 50%' }, pbar);

  // ---------------- SEEDANCE 2.5 tag + arrows
  const T = { x: 120, y: 1170, w: 230, h: 150 };
  const sd = el('div', 'tag', { width: T.w + 'px', height: T.h + 'px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }, g); place(sd, T);
  el('div', 'disp', { fontSize: '50px', textAlign: 'center', lineHeight: '.9' }, sd, 'SEEDANCE<br>2.5');
  tape(sd, { x: T.w / 2 - 55, y: -18, w: 110, rot: 2 });
  gsap.set(sd, { rotation: -3 });
  const bursts = svg(g, { x: T.x - 40, y: T.y - 40, w: T.w + 80, h: T.h + 80 });
  const bl = [[20, 22, 36, 38], [T.w + 60, 22, T.w + 44, 38], [20, T.h + 58, 36, T.h + 42], [T.w + 60, T.h + 58, T.w + 44, T.h + 42]]
    .map(([a, b, c, d]) => path(bursts, `M${a} ${b} L${c} ${d}`, { stroke: '#111', width: 5 }));
  const as = svg(g, { x: 0, y: 0, w: 1080, h: 1920 });
  const a1 = arrow(as, 240, 1088, 236, 1150, { bow: 0.25, width: 7, headLen: 20 });
  const a2 = arrow(as, 368, 1245, 512, 1222, { bow: -0.18, width: 7, headLen: 22 });

  // STYLED SHOT label above the phone
  const lSty = hand(g, 'STYLED SHOT', { x: 640, y: 636, size: 42, rot: -3, ul: true });
  lSty.style.position = 'absolute';

  // ---------------- timeline
  // 20.1: the phone starts recording the rough take right away
  tl.set(fr[0], { opacity: 1 }, 20.1); tl.set(s0, { opacity: 0 }, 20.1);
  tl.fromTo(rec, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: 0.2, ease: E.pop, immediateRender: false }, 20.1);
  tl.set(barBg, { opacity: 1 }, 20.1);
  tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'none', immediateRender: true }, 20.1);
  tl.to(rec, { opacity: 0.25, duration: 0.12, yoyo: true, repeat: 3, ease: 'power1.inOut' }, 20.5);
  // the strip slides in; each frame lights as the phone shows it
  tl.fromTo(card, { x: -480, rotation: -6 }, { x: 0, rotation: -1.5, duration: 0.45, ease: E.land, immediateRender: true }, 20.1);
  tl.fromTo(frames, { opacity: 0.35 }, { opacity: 0.35, duration: 0.01, immediateRender: true }, 20.1);
  tl.fromTo(pfill, { scaleX: 0 }, { scaleX: 1, duration: 0.75, ease: 'none', immediateRender: true }, 20.5);
  [20.5, 20.75, 21.0].forEach((t, i) => {
    tl.to(frames[i], { opacity: 1, boxShadow: '0 0 0 5px var(--orange)', duration: 0.1, ease: 'power2.out' }, t);
    tl.fromTo(frames[i], { scale: 1.14 }, { scale: 1, duration: 0.25, ease: E.land, immediateRender: false }, t);
    if (i > 0) { tl.set(fr[i], { opacity: 1 }, t); tl.set(fr[i - 1], { opacity: 0 }, t); }
    tl.fromTo(screen, { x: [-5, 4, -3][i], y: [3, -4, 2][i] }, { x: 0, y: 0, duration: 0.2, ease: 'power2.out', immediateRender: false }, t);
  });
  // 21.0–21.5: strip → SEEDANCE 2.5 → phone
  const drawArrow = (a, t, d) => {
    [a.shaft, a.head].forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L + ' ' + (L + 2); gsap.set(p, { strokeDashoffset: L, opacity: 0 }); tl.set(p, { opacity: 1 }, p === a.shaft ? t : t + d * 0.7); });
    tl.to(a.shaft, { strokeDashoffset: 0, duration: d, ease: 'power2.inOut' }, t);
    tl.to(a.head, { strokeDashoffset: 0, duration: d * 0.4, ease: 'power2.out' }, t + d * 0.7);
  };
  drawArrow(a1, 21.0, 0.18);
  tl.fromTo(sd, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: E.pop, immediateRender: true }, 21.12);
  bl.forEach(p => { gsap.set(p, { opacity: 0 }); });
  tl.fromTo(bl, { opacity: 1, scale: 0.6, transformOrigin: '50% 50%' }, { scale: 1.15, duration: 0.25, ease: E.land, immediateRender: false }, 21.25);
  tl.to(bl, { opacity: 0, duration: 0.3 }, 21.75);
  drawArrow(a2, 21.28, 0.22);
  // 21.5: the arrow arrives → the styled shot resolves
  tl.to([rec, barBg], { opacity: 0, duration: 0.1 }, 21.45);
  tl.fromTo(flash, { opacity: 0.85 }, { opacity: 0, duration: 0.35, ease: 'power2.out', immediateRender: false }, 21.5);
  tl.fromTo(sty, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.28, ease: E.move, immediateRender: false }, 21.5);
  tl.fromTo(sty, { scale: 1.14 }, { scale: 1, duration: 0.8, ease: E.land, immediateRender: false }, 21.5);
  tl.fromTo(sweep, { x: 0 }, { x: SCR.width + 480, duration: 0.5, ease: 'none', immediateRender: false }, 21.5);
  tl.fromTo(lSty, { opacity: 0, y: 30, '--ul': '0%' }, { opacity: 1, y: 0, '--ul': '100%', duration: 0.35, ease: E.land, immediateRender: true }, 21.5);
  tl.fromTo(ph, { rotation: 0 }, { rotation: -1.2, duration: 0.5, ease: E.land2, transformOrigin: '750px 1110px', immediateRender: false }, 21.5);
  // 3% push to the drop; then everything drops away fast
  tl.fromTo(g, { scale: 1 }, { scale: 1.03, duration: 0.65, ease: 'sine.inOut', immediateRender: false }, 21.65);
  tl.to(g, { y: 1500, rotation: 6, duration: 0.4, ease: E.fast }, 22.12);
}
