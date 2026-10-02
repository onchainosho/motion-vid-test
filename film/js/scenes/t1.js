// Tip 1 (2.5–5.0): TEST AT 480p. — the same shot goes from chunky draft to crisp final once the checks tick.
import { E, el, place, img, tag, hand, svg, path, tick, tipHeadline, HANDOFF } from '../core.js';

export const meta = { pre: 0.04, box: { lines: ['GO HIGHER LATER.'] }, boxTiming: { morph: 0.01, morphShift: 0.19, textShift: 0.2, cut: true } };

// Pixel size of the draft as a function of time: chunky, then resolves in steps on the 4.0 s beat.
const pixelAt = t => (t < 4.0 ? 20 : t < 4.06 ? 13 : t < 4.12 ? 7 : t < 4.18 ? 3 : 1);

export function build(ctx) {
  const { tl, layer, s, e, onFrame } = ctx;
  tipHeadline(ctx, ['TEST AT', '480p.'], { inAt: 2.42 });

  // big polaroid
  const G = { x: 34, y: 724, w: 1012, h: 822 };
  const pol = el('div', 'polaroid', { padding: '16px' }, layer); place(pol, G);
  const ph = el('div', 'ph', null, pol);
  const sharp = img('final-desert', ph, { opacity: 0 });
  const cv = el('canvas', '', null, ph); cv.width = 980; cv.height = 790;
  const c2 = cv.getContext('2d');
  const small = document.createElement('canvas'); const sc = small.getContext('2d');
  let lastP = -1;
  const drawPix = p => {
    if (p === lastP || !sharp.complete || !sharp.naturalWidth) return; lastP = p;
    // cover-fit source rect
    const iw = sharp.naturalWidth, ih = sharp.naturalHeight, r = Math.max(980 / iw, 790 / ih);
    const sw = 980 / r, sh = 790 / r, sx = (iw - sw) / 2, sy = (ih - sh) / 2;
    const w = Math.max(1, Math.round(980 / p)), h = Math.max(1, Math.round(790 / p));
    small.width = w; small.height = h; sc.imageSmoothingEnabled = true; sc.drawImage(sharp, sx, sy, sw, sh, 0, 0, w, h);
    c2.imageSmoothingEnabled = p === 1; c2.clearRect(0, 0, 980, 790); c2.drawImage(small, 0, 0, w, h, 0, 0, 980, 790);
  };
  onFrame(t => drawPix(pixelAt(t)));
  // once resolved, the real <img> takes over (identical element type on both sides of the handoff)
  tl.set(sharp, { opacity: 1 }, 4.2); tl.set(cv, { opacity: 0 }, 4.2);

  // scan line sweeps while the checks tick
  const scan = el('div', '', { position: 'absolute', left: 0, right: 0, height: '6px', background: 'var(--orange)', boxShadow: '0 0 18px rgba(236,99,39,.9)', opacity: 0 }, ph);
  tl.fromTo(scan, { top: '0%', opacity: 1 }, { top: '100%', duration: 0.75, ease: 'none', immediateRender: false }, 3.05);
  tl.to(scan, { opacity: 0, duration: 0.08 }, 3.8);

  // tape label that flips from draft to final
  const lab = el('div', 'abs', { left: '84px', top: '690px', zIndex: 5 }, layer);
  const tA = tag(lab, '480P DRAFT', { x: 0, y: 0, size: 44, rot: -4 });
  const tB = tag(lab, 'FINAL RENDER', { x: 0, y: 0, size: 44, rot: -4 }); gsap.set(tB, { rotationX: 90, opacity: 0 });
  tl.to(tA, { rotationX: 90, duration: 0.1, ease: 'power2.in' }, 4.0);
  tl.set(tA, { opacity: 0 }, 4.1);
  tl.fromTo(tB, { rotationX: -90, opacity: 1 }, { rotationX: 0, duration: 0.22, ease: E.pop, immediateRender: false }, 4.1);

  // check strip: "CHECK" + framing / motion / position icons, each ticked on the beat
  const strip = el('div', 'card', { padding: '18px 26px', display: 'flex', alignItems: 'center', gap: '30px', zIndex: 6 }, layer); place(strip, { x: 96, y: 1430 });
  hand(strip, 'CHECK', { size: 46 }).style.position = 'relative';
  const icons = [
    'M6 18 V6 H18 M44 6 H56 V18 M56 44 V56 H44 M18 56 H6 V44',                 // framing brackets
    'M6 31 H52 M38 17 L54 31 L38 45',                                          // motion arrow
    'M6 18 V6 H18 M44 6 H56 V18 M56 44 V56 H44 M18 56 H6 V44 M31 30 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M18 50 C20 40 42 40 44 50', // position: person in frame
  ];
  const ticks = icons.map((d, i) => {
    const w = el('div', '', { position: 'relative', width: '62px', height: '62px' }, strip);
    const s = svg(w, { x: 0, y: 0, w: 62, h: 62, vb: '0 0 62 62' }); path(s, d, { stroke: '#111', width: 4.5 });
    const t = tick(w, { x: 30, y: -34, s: 0.62, width: 13 }); t.style.strokeDasharray = '120 122'; t.style.strokeDashoffset = 120;
    return t;
  });
  [3.25, 3.5, 3.75].forEach((t, i) => tl.to(ticks[i], { strokeDashoffset: 0, duration: 0.16, ease: 'power2.out' }, t));

  // final stamp
  const stamp = el('div', '', { position: 'absolute', right: '34px', bottom: '34px', width: '84px', height: '84px', background: '#111', borderRadius: '10px', zIndex: 3, opacity: 0 }, pol);
  const st = tick(stamp, { x: 10, y: 12, s: 0.72, width: 13 }); st.style.strokeDasharray = '120 122';
  tl.fromTo(stamp, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.26, ease: E.pop, immediateRender: false }, 4.12);
  tl.fromTo(st, { strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 0.18, immediateRender: false }, 4.18);

  // entrance: revealed under the shrinking orange; settle
  tl.fromTo(pol, { scale: 1.07, rotation: -1 }, { scale: 1, rotation: -1.5, duration: 0.6, ease: E.land2 }, 2.45);
  tl.fromTo(strip, { y: 140, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: E.land }, 2.95);
  tl.fromTo(lab, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: E.land }, 2.75);
  tl.to(pol, { scale: 1.03, duration: 0.9, ease: E.soft }, 3.1);
  tl.to(pol, { scale: 1.07, rotation: -0.5, duration: 0.5, ease: 'power2.out' }, 4.0);

  // exit: strip + tag go, polaroid shrinks into the handoff slot for tip 2's wall
  tl.to([strip, lab], { y: 120, opacity: 0, duration: 0.22, ease: E.leave }, 4.48);
  tl.to(stamp, { opacity: 0, duration: 0.15 }, 4.5);
  const H = HANDOFF.t1t2;
  tl.to(pol, { left: H.x, top: H.y, width: H.w, height: H.h, rotation: H.rot, scale: 1, duration: 0.5, ease: E.move }, 4.5);
  tl.set(pol, { visibility: 'hidden' }, 5.0);
}
