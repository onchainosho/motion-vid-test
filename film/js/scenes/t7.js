// Tip 7 (17.5–20.0): NEW SETUP? GENERATE ONE FIRST. — an overhead contact sheet: one test frame is checked,
// then the other five slots fill with the same shot. TEST 01 then grows into tip 8's phone screen.
import { E, el, place, tag, svg, path, tick, tipHeadline, HANDOFF } from '../core.js';

export const meta = { box: { lines: ['GENERATE', 'ONE FIRST.'] } };

// ---- test01.jpg has the slide's orange circle baked in (and a slide border). Clean it once, in code:
// mask the orange ring, fill it by diffusion from its edges, crop the border. Shared with tip 8.
let _clean;
export function cleanTest01() {
  if (_clean) return _clean;
  _clean = new Promise(res => {
    const im = new Image();
    im.onload = () => {
      try {
        const W0 = im.naturalWidth, H0 = im.naturalHeight;
        const c = document.createElement('canvas'); c.width = W0; c.height = H0;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
        const d = x.getImageData(0, 0, W0, H0), p = d.data, N = W0 * H0;
        let m = new Uint8Array(N);
        for (let yy = 166; yy < 330; yy++) for (let xx = 282; xx < W0; xx++) {
          const i = (yy * W0 + xx) * 4, r = p[i], g = p[i + 1], b = p[i + 2];
          if (r > 120 && r - g > 45 && r - b > 80) m[yy * W0 + xx] = 1;
        }
        for (let k = 0; k < 5; k++) { // dilate
          const n = m.slice();
          for (let yy = 1; yy < H0 - 1; yy++) for (let xx = 1; xx < W0 - 1; xx++) {
            const j = yy * W0 + xx; if (m[j]) { n[j - 1] = n[j + 1] = n[j - W0] = n[j + W0] = 1; }
          }
          m = n;
        }
        const idx = []; for (let j = 0; j < N; j++) if (m[j]) idx.push(j);
        const f = new Float32Array(N * 3); for (let j = 0; j < N; j++) { f[j * 3] = p[j * 4]; f[j * 3 + 1] = p[j * 4 + 1]; f[j * 3 + 2] = p[j * 4 + 2]; }
        const known = new Uint8Array(N); for (let j = 0; j < N; j++) known[j] = m[j] ? 0 : 1;
        const nb = [-1, 1, -W0, W0];
        let left = idx.length, guard = 0;
        while (left > 0 && guard++ < 400) { // onion-peel fill
          const upd = [];
          for (const j of idx) {
            if (known[j]) continue; let s0 = 0, s1 = 0, s2 = 0, cn = 0;
            for (const o of nb) { const q = j + o; if (q >= 0 && q < N && known[q]) { s0 += f[q * 3]; s1 += f[q * 3 + 1]; s2 += f[q * 3 + 2]; cn++; } }
            if (cn) upd.push([j, s0 / cn, s1 / cn, s2 / cn]);
          }
          for (const [j, a, b2, c2] of upd) { f[j * 3] = a; f[j * 3 + 1] = b2; f[j * 3 + 2] = c2; known[j] = 1; left--; }
          if (!upd.length) break;
        }
        for (let it = 0; it < 150; it++) for (const j of idx) { // smooth (harmonic)
          for (let ch = 0; ch < 3; ch++) f[j * 3 + ch] = (f[(j - 1) * 3 + ch] + f[(j + 1) * 3 + ch] + f[(j - W0) * 3 + ch] + f[(j + W0) * 3 + ch]) / 4;
        }
        for (const j of idx) { p[j * 4] = f[j * 3]; p[j * 4 + 1] = f[j * 3 + 1]; p[j * 4 + 2] = f[j * 3 + 2]; }
        x.putImageData(d, 0, 0);
        const o = document.createElement('canvas'); o.width = 478; o.height = 386;
        o.getContext('2d').drawImage(c, 8, 34, 478, 386, 0, 0, 478, 386);
        res(o.toDataURL('image/jpeg', 0.94));
      } catch (err) { res('assets/photos/test01.jpg'); }
    };
    im.onerror = () => res('assets/photos/test01.jpg');
    im.src = 'assets/photos/test01.jpg';
  });
  return _clean;
}
export async function test01Img(parent, style) {
  const src = await cleanTest01();
  const i = el('img', '', { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }, parent);
  i.decoding = 'sync'; i.src = src;
  try { await i.decode(); } catch (e) { /* ignore */ }
  return i;
}

export async function build(ctx) {
  const { tl, layer } = ctx;
  tipHeadline(ctx, ['NEW', 'SETUP?']);

  // ---- the contact sheet
  const P = { x: 86, y: 730, w: 908, h: 770 }; // ×1.03 push stays inside x 64–1000
  const panel = el('div', '', { position: 'absolute', background: '#171615', borderRadius: '10px', boxShadow: '0 22px 44px -16px rgba(40,25,10,.55),0 4px 12px rgba(40,25,10,.18)', transformOrigin: '454px 385px' }, layer);
  place(panel, P);
  // sprocket holes along the top and bottom edges
  for (let i = 0; i < 22; i++) {
    [16, P.h - 32].forEach(y => el('div', '', { position: 'absolute', left: (22 + i * 40.1) + 'px', top: y + 'px', width: '22px', height: '16px', borderRadius: '4px', background: 'rgba(239,232,219,.82)' }, panel));
  }
  // 3×2 slots (panel-relative)
  const slots = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) slots.push({ x: 28 + c * 290, y: 60 + r * 330, w: 272, h: 300 });
  const TEST = 1; // middle top slot → x404 y790 w272 h300, centred on x540
  const outlines = slots.map(S => {
    const o = el('div', '', { position: 'absolute', border: '3px dashed rgba(239,232,219,.5)', borderRadius: '6px', boxSizing: 'border-box' }, panel);
    place(o, S); return o;
  });
  // copies that fill the empty slots later (same shot)
  const copies = [];
  for (let k = 0; k < slots.length; k++) {
    if (k === TEST) continue;
    const S = slots[k];
    const d = el('div', '', { position: 'absolute', overflow: 'hidden', borderRadius: '6px', opacity: 0 }, panel); place(d, S);
    await test01Img(d, { objectPosition: '70% 50%' });
    copies.push({ d, o: outlines[k] });
  }

  // ---- TEST 01 photo: lives in the layer (not the panel) so it can become tip 8's screen at exact pixels
  const S0 = { x: P.x + slots[TEST].x, y: P.y + slots[TEST].y, w: 272, h: 300 };
  const photo = el('div', '', { position: 'absolute', overflow: 'hidden', borderRadius: '6px', background: '#222', zIndex: 4, boxShadow: '0 16px 30px -12px rgba(0,0,0,.6)', transformOrigin: `${540 - S0.x}px ${1115 - S0.y}px` }, layer);
  place(photo, S0);
  const pimg = await test01Img(photo, { objectPosition: '70% 50%' });
  // the check circle (hand-drawn loop around the spot behind the car) + a stamp with a tick
  const cs = svg(photo, { x: 0, y: 0, w: 272, h: 300 });
  const circ = path(cs, 'M250 140 C240 112 214 106 190 110 C152 116 134 144 138 172 C143 206 175 222 205 218 C238 214 256 192 254 162 C252 138 232 120 204 116', { width: 9 });
  const stamp = el('div', '', { position: 'absolute', left: '16px', bottom: '16px', width: '74px', height: '74px', background: '#111', borderRadius: '10px', opacity: 0 }, photo);
  const st = tick(stamp, { x: 9, y: 11, s: 0.62, width: 13 }); st.style.strokeDasharray = '120 122'; st.style.strokeDashoffset = 120;

  const tTest = tag(layer, 'TEST 01', { x: 420, y: 760, size: 38, rot: -4 }); tTest.style.zIndex = 6;
  const tCont = tag(layer, 'THEN CONTINUE', { x: 592, y: 1446, size: 40, rot: 3 }); tCont.style.zIndex = 6;

  // ---- entrance: the sheet slides up under the camera and settles
  tl.fromTo(panel, { y: 1250, rotation: -5 }, { y: 0, rotation: 0, duration: 0.55, ease: E.land }, 17.42);
  // TEST 01 drops into its slot on the beat (impact at 18.0)
  tl.fromTo(photo, { scale: 1.45, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.25, ease: 'power2.in', immediateRender: true }, 17.75);
  tl.to(outlines[TEST], { opacity: 0, duration: 0.05 }, 17.98);
  tl.fromTo(panel, { y: 0 }, { y: 7, duration: 0.07, ease: 'power2.out', yoyo: true, repeat: 1, immediateRender: false }, 18.0);
  tl.fromTo(tTest, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: E.pop, immediateRender: true }, 18.0);
  // check: circle draws on the spot, then the tick stamp lands
  const L = circ.getTotalLength(); circ.style.strokeDasharray = L + ' ' + (L + 2);
  gsap.set(circ, { opacity: 0 }); tl.set(circ, { opacity: 1 }, 18.12);
  tl.fromTo(circ, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.32, ease: 'power2.inOut', immediateRender: true }, 18.12);
  tl.fromTo(stamp, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.25, ease: E.pop, immediateRender: false }, 18.5);
  tl.to(st, { strokeDashoffset: 0, duration: 0.16, ease: 'power2.out' }, 18.54);
  // then continue: label + the five empty slots fill on quarter-beats
  tl.fromTo(tCont, { y: 60, opacity: 0, rotation: 8 }, { y: 0, opacity: 1, rotation: 3, duration: 0.35, ease: E.land, immediateRender: true }, 18.62);
  copies.forEach(({ d, o }, i) => {
    const t = 18.75 + i * 0.125;
    tl.fromTo(d, { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.2, ease: E.land, immediateRender: true }, t);
    tl.to(o, { opacity: 0, duration: 0.06 }, t + 0.04);
  });
  // slow push on the whole sheet (TEST 01 shares the pivot)
  tl.to([panel, photo], { scale: 1.03, duration: 1.5, ease: E.soft }, 18.0);

  // ---- exit: the sheet falls away; TEST 01 lifts and grows into the phone-screen slot
  const H = HANDOFF.t7t8;
  tl.to([tTest, tCont], { y: -24, scale: 0.85, opacity: 0, duration: 0.1, ease: 'power1.out' }, 19.5);
  tl.to([circ, stamp], { opacity: 0, scale: 0.85, transformOrigin: '50% 50%', duration: 0.1, ease: 'power1.out' }, 19.5);
  tl.to(panel, { y: 1250, rotation: 4, duration: 0.4, ease: E.fast }, 19.48);
  tl.to(photo, { left: H.x, top: H.y, width: H.w, height: H.h, rotation: H.rot, scale: 1, borderRadius: 34, boxShadow: '0 16px 30px -12px rgba(0,0,0,0)', duration: 0.5, ease: E.move }, 19.5);
  tl.to(pimg, { objectPosition: '25% 50%', duration: 0.5, ease: E.move }, 19.5);
  tl.set(photo, { visibility: 'hidden' }, 20.0);
}
