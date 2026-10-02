// CTA (26.5–30.0): LIKE THIS EXPLAINER? FOLLOW POSSIBLE LABS. — the logo's sun rises, an arrow points to the
// profile/follow area; the card holds from ~27.3 with a slow 4% push (0.96→1.00). Nothing exits.
import { E, el, place, headline, linesIn, measure, sans, svg, path } from '../core.js';

const BOX = { x: 64, y: 534, w: 952, h: 300 };
export const meta = { box: { ...BOX, fs: 150, pad: 36, fit: true, lines: ['FOLLOW', 'POSSIBLE LABS.'] }, boxTiming: { morph: 0.5 } };

export function build({ tl, layer, s, box }) {
  const PIV = { x: 540, y: 960 }; // shared pivot for the 4% push (layer content + box)
  const g = el('div', 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: `${PIV.x}px ${PIV.y}px` }, layer);

  // headline, big, lines from opposite sides
  const L = ['LIKE THIS', 'EXPLAINER?'];
  const size = Math.min(176, Math.floor(176 * 944 / Math.max(...L.map(l => measure(l, 176)))));
  const lines = headline(g, L, { x: 64, y: 214, size });
  linesIn(tl, lines, s - 0.06, { dur: 0.6, stagger: 0.1 });

  // sub line
  const sub = sans(g, 'AI + TECH.<br>MADE EASIER TO UNDERSTAND.', { x: 66, y: 870, size: 60 });
  tl.fromTo(sub, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: E.land, immediateRender: true }, 26.9);

  // ---- logo lockup (redrawn from assets/logo-ref.png, ref px): thin ink L (x63, y33→112, foot to x86),
  // half-sun with flat edge at x67.5, r22, top level with the L top; 5 thin short rays with a gap from the disc.
  const NS = 'http://www.w3.org/2000/svg';
  const LK = { x: 640, w: 300 }; // ends at x 940
  const MK = { vx: 58, vy: 30, vw: 48, vh: 86, s: 4.1 };
  const mw = MK.vw * MK.s, mh = MK.vh * MK.s;
  const ls = svg(g, { x: LK.x + (LK.w - mw) / 2, y: 1050, w: mw, h: mh, vb: `${MK.vx} ${MK.vy} ${MK.vw} ${MK.vh}` });
  const defs = document.createElementNS(NS, 'defs'); ls.appendChild(defs);
  defs.innerHTML = '<linearGradient id="ctaSun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EC6327"/><stop offset="1" stop-color="#F4A57A"/></linearGradient>';
  const SC = { x: 67.5, y: 55, r: 22 };
  const sunG = document.createElementNS(NS, 'g'); ls.appendChild(sunG);
  const sun = path(sunG, `M${SC.x} ${SC.y - SC.r} A${SC.r} ${SC.r} 0 0 1 ${SC.x} ${SC.y + SC.r} Z`, { stroke: 'none', width: 0 });
  sun.style.fill = 'url(#ctaSun)';
  const ell = path(ls, 'M63 33 L63 112 L86 112', { stroke: '#111', width: 2.4 });
  ell.style.strokeLinecap = 'butt'; ell.style.strokeLinejoin = 'miter';
  const rays = [-72, -40, -8, 24, 56].map(a => {
    const r = a * Math.PI / 180;
    return path(ls, `M${SC.x + Math.cos(r) * 28} ${SC.y + Math.sin(r) * 28} L${SC.x + Math.cos(r) * 33.5} ${SC.y + Math.sin(r) * 33.5}`, { stroke: 'var(--orange)', width: 1.6 });
  });
  rays.forEach(p => { p.style.strokeLinecap = 'butt'; });
  // ink wordmark, fitted to the lockup width
  const wm = el('div', 'label abs', { fontSize: '40px', letterSpacing: '.2em', color: 'var(--ink)' }, g, 'POSSIBLE LABS');
  const ww = wm.getBoundingClientRect().width; // includes trailing tracking
  const wfs = 40 * LK.w / (ww - 0.2 * 40); // visible width (without trailing tracking) = LK.w
  wm.style.fontSize = wfs.toFixed(2) + 'px';
  place(wm, { x: LK.x, y: 1050 + mh + 26 });

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
  tl.fromTo(sunG, { scale: 0, y: 14, svgOrigin: `${SC.x} ${SC.y}` }, { scale: 1, y: 0, duration: 0.55, ease: E.land, immediateRender: true }, 27.0);
  rays.forEach((rp, i) => {
    const l = rp.getTotalLength(); rp.style.strokeDasharray = l + ' ' + (l + 1);
    tl.fromTo(rp, { strokeDashoffset: l, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.18, ease: 'power2.out', immediateRender: true }, 27.25 + i * 0.05);
  });
  const sL = shaft.getTotalLength(), hL = head.getTotalLength();
  shaft.style.strokeDasharray = sL + ' ' + (sL + 2); head.style.strokeDasharray = hL + ' ' + (hL + 2);
  tl.fromTo(shaft, { strokeDashoffset: sL }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut', immediateRender: true }, 27.1);
  tl.fromTo(head, { strokeDashoffset: hL }, { strokeDashoffset: 0, duration: 0.15, ease: 'power2.out', immediateRender: true }, 27.48);

  // ---- hold (27.6 → 30.0): living motion on beats
  // rays redraw + sun pulse on 28.0 and 29.0
  [28.0, 29.0].forEach(t => {
    rays.forEach((rp, i) => {
      const l = rp.getTotalLength();
      tl.fromTo(rp, { strokeDashoffset: l }, { strokeDashoffset: 0, duration: 0.2, ease: 'power2.out', immediateRender: false }, t + i * 0.04);
    });
    tl.fromTo(sunG, { scale: 1 }, { scale: 1.08, duration: 0.12, ease: 'power2.out', yoyo: true, repeat: 1, svgOrigin: `${SC.x} ${SC.y}`, immediateRender: false }, t);
  });
  // arrow nudges toward the follow button and its head redraws on 28.5 and 29.5
  [28.5, 29.5].forEach(t => {
    tl.fromTo(as, { x: 0, y: 0 }, { x: -14, y: 14, duration: 0.14, ease: 'power2.out', yoyo: true, repeat: 1, immediateRender: false }, t);
    tl.fromTo(head, { strokeDashoffset: hL }, { strokeDashoffset: 0, duration: 0.16, ease: 'power2.out', immediateRender: false }, t + 0.04);
  });
  // a soft light shimmer crosses the FOLLOW box (27.75, 29.25)
  const shim = el('div', '', { position: 'absolute', top: '-20%', height: '140%', width: '160px', left: '-200px', background: 'linear-gradient(90deg,rgba(255,240,220,0),rgba(255,240,220,.38),rgba(255,240,220,0))', transform: 'skewX(-18deg)', pointerEvents: 'none', zIndex: 3 }, box);
  [27.75, 29.25].forEach(t => tl.fromTo(shim, { x: 0 }, { x: BOX.w + 400, duration: 0.6, ease: 'power1.inOut', immediateRender: false }, t));
  tl.fromTo(g, { scale: 0.96 }, { scale: 1, duration: 3.25, ease: 'sine.inOut', immediateRender: true }, 26.75);
  tl.fromTo(wm, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: E.land, immediateRender: true }, 27.25);
  // the box shares the same pivot so the whole card pushes as one
  tl.fromTo(box, { scale: 1 }, { scale: 0.96, duration: 0.45, ease: E.move, transformOrigin: `${PIV.x - BOX.x}px ${PIV.y - BOX.y}px`, immediateRender: false }, 26.3);
  tl.fromTo(box, { scale: 0.96 }, { scale: 1, duration: 3.25, ease: 'sine.inOut', transformOrigin: `${PIV.x - BOX.x}px ${PIV.y - BOX.y}px`, immediateRender: false }, 26.75);
}
