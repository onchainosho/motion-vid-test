// CTA (26.5–30.0): LIKE THIS EXPLAINER? FOLLOW POSSIBLE LABS. — the logo's sun rises, an arrow points to the
// profile/follow area; the card holds from ~27.3 with a slow 2% push. Nothing exits.
import { E, el, place, headline, linesIn, measure, sans, svg, path } from '../core.js';

const BOX = { x: 64, y: 534, w: 952, h: 300 };
export const meta = { box: { ...BOX, fs: 150, pad: 36, fit: true, lines: ['FOLLOW', 'POSSIBLE LABS.'] }, boxTiming: { morph: 0.5 } };

export function build({ tl, layer, s, box }) {
  const PIV = { x: 540, y: 960 }; // shared pivot for the 2% push (layer content + box)
  const g = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: `${PIV.x}px ${PIV.y}px` }, layer);

  // headline, big, lines from opposite sides
  const L = ['LIKE THIS', 'EXPLAINER?'];
  const size = Math.min(176, Math.floor(176 * 944 / Math.max(...L.map(l => measure(l, 176)))));
  const lines = headline(g, L, { x: 64, y: 214, size });
  linesIn(tl, lines, s - 0.08, { dur: 0.6, stagger: 0.1 });

  // sub line
  const sub = sans(g, 'AI + TECH.<br>MADE EASIER TO UNDERSTAND.', { x: 66, y: 870, size: 60 });
  tl.fromTo(sub, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: E.land, immediateRender: true }, 26.9);

  // ---- logo mark (redrawn): thin ink L, orange half-sun on the right of the vertical stroke, short rays
  const LG = { x: 740, y: 1030, w: 200, h: 400 }; // logo-ref coords (150×150), cropped to the mark, ×4
  const ls = svg(g, { x: LG.x, y: LG.y, w: LG.w, h: LG.h, vb: '50 22 50 100' });
  const ell = path(ls, 'M63 28 L63 118 L92 118', { stroke: '#111', width: 2.6 });
  ell.style.strokeLinecap = 'square'; ell.style.strokeLinejoin = 'miter';
  const sunG = document.createElementNS('http://www.w3.org/2000/svg', 'g'); ls.appendChild(sunG);
  const sun = path(sunG, 'M63 34 A17 17 0 0 1 63 68 Z', { stroke: 'none', width: 0 });
  sun.style.fill = 'var(--orange)';
  const rays = [-62, -31, 0, 31, 62].map(a => {
    const r = a * Math.PI / 180, cx = 63, cy = 51;
    return path(ls, `M${cx + Math.cos(r) * 23} ${cy + Math.sin(r) * 23} L${cx + Math.cos(r) * 31} ${cy + Math.sin(r) * 31}`, { stroke: 'var(--orange)', width: 2.6 });
  });
  ls.insertBefore(sunG, ls.firstChild); // the L stroke stays on top of the sun

  // ---- wordless hand-drawn arrow toward the profile / follow button (bottom-left)
  const as = svg(g, { x: 0, y: 0, w: 1080, h: 1920 });
  const shaft = path(as, 'M590 1150 C520 1290 400 1360 300 1420 C240 1456 190 1490 150 1530', { width: 8 });
  const head = path(as, 'M152 1478 L148 1532 L202 1530', { width: 8 });

  // ---- logo + arrow choreography
  const show = (p, t) => { gsap.set(p, { opacity: 0 }); tl.set(p, { opacity: 1 }, t); };
  show(ell, 26.85); show(shaft, 27.1); show(head, 27.48);
  const eL = ell.getTotalLength(); ell.style.strokeDasharray = eL + ' ' + (eL + 2);
  tl.fromTo(ell, { strokeDashoffset: eL }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut', immediateRender: true }, 26.85);
  // the sun rises: scales out of its spot on the L and lifts a little
  sunG.style.transformBox = 'view-box'; sunG.style.transformOrigin = '63px 51px';
  tl.fromTo(sunG, { scale: 0, y: 30 }, { scale: 1, y: 0, duration: 0.55, ease: E.land, immediateRender: true }, 27.0);
  rays.forEach((rp, i) => {
    const l = rp.getTotalLength(); rp.style.strokeDasharray = l + ' ' + (l + 1);
    tl.fromTo(rp, { strokeDashoffset: l, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.18, ease: 'power2.out', immediateRender: true }, 27.25 + i * 0.05);
  });
  const sL = shaft.getTotalLength(), hL = head.getTotalLength();
  shaft.style.strokeDasharray = sL + ' ' + (sL + 2); head.style.strokeDasharray = hL + ' ' + (hL + 2);
  tl.fromTo(shaft, { strokeDashoffset: sL }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut', immediateRender: true }, 27.1);
  tl.fromTo(head, { strokeDashoffset: hL }, { strokeDashoffset: 0, duration: 0.15, ease: 'power2.out', immediateRender: true }, 27.48);

  // ---- hold (27.6 → 30.0): gentle life
  rays.forEach((rp, i) => tl.to(rp, { opacity: 0.55, duration: 0.5, ease: E.soft, yoyo: true, repeat: 1 }, 28.0 + (i % 2) * 0.25));
  rays.forEach((rp, i) => tl.to(rp, { opacity: 0.55, duration: 0.5, ease: E.soft, yoyo: true, repeat: 1 }, 29.0 + (i % 2) * 0.25));
  tl.fromTo(as, { x: 0, y: 0 }, { x: -8, y: 8, duration: 0.5, ease: E.soft, yoyo: true, repeat: 3, immediateRender: false }, 28.0);
  tl.fromTo(g, { scale: 1 }, { scale: 1.02, duration: 3.2, ease: 'sine.inOut' }, 26.8);
  // the box shares the same pivot so the whole card pushes as one
  tl.fromTo(box, { scale: 1 }, { scale: 1.02, duration: 3.2, ease: 'sine.inOut', transformOrigin: `${PIV.x - BOX.x}px ${PIV.y - BOX.y}px`, immediateRender: false }, 26.8);
}
