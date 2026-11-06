// Diwali reel: one GSAP timeline drives frame(t); every visual value is a pure function of timeline time (seeded randomness only).
(() => {
const D = 10, W = 1080, H = 1920;
const $ = s => document.querySelector(s);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const EZ = {}; const ez = n => EZ[n] || (EZ[n] = gsap.parseEase(n));
const P = (t, a, b, e = 'power2.inOut') => ez(e)(clamp((t - a) / (b - a)));
const L = (a, b, k) => a + (b - a) * k;
const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------- diya ----------
function diya(svg, id) {
  svg.setAttribute('viewBox', '0 0 150 150');
  svg.innerHTML = `<defs>
    <radialGradient id="glow${id}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFC75A" stop-opacity=".75"/><stop offset=".45" stop-color="#FF9A2A" stop-opacity=".28"/><stop offset="1" stop-color="#FF8A20" stop-opacity="0"/></radialGradient>
    <linearGradient id="fl${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF6A10"/><stop offset=".45" stop-color="#FFB22E"/><stop offset="1" stop-color="#FFE9A0"/></linearGradient>
    <linearGradient id="bw${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9742E"/><stop offset="1" stop-color="#7A2C0E"/></linearGradient></defs>
    <circle class="g" cx="75" cy="58" r="58" fill="url(#glow${id})"/>
    <g class="f"><path d="M75 16 C 89 42 94 62 75 82 C 56 62 61 42 75 16 Z" fill="url(#fl${id})"/><path d="M75 44 C 81 56 82 66 75 78 C 68 66 69 56 75 44 Z" fill="#FFF6D6"/></g>
    <path d="M10 86 C 26 136 124 136 140 86 Z" fill="url(#bw${id})"/>
    <ellipse cx="75" cy="86" rx="65" ry="10" fill="#E9A23F"/><ellipse cx="75" cy="86" rx="50" ry="5.5" fill="#8A3A10"/>
    <g fill="#F4C25B">${[36, 55, 75, 95, 114].map((x, i) => `<circle cx="${x}" cy="${104 + (i % 2) * 6}" r="3.4"/>`).join('')}</g>`;
  return { f: svg.querySelector('.f'), g: svg.querySelector('.g') };
}
const NS = 'http://www.w3.org/2000/svg';
const DIYAS = [100, 320, 540, 760, 980].map((x, i) => { const s = document.createElementNS(NS, 'svg'); s.setAttribute('class', 'diya'); s.style.left = (x - 75) + 'px'; s.style.top = (20 + (i % 2) * 18) + 'px'; $('#diyas').appendChild(s); return diya(s, 'd' + i); });
const BIG = diya($('#bigDiya'), 'big');
const flicker = (d, t, ph, on = 1) => {
  const sx = 1 + 0.06 * Math.sin(13.1 * t + ph) + 0.03 * Math.sin(29.7 * t + ph * 2), sy = 1 + 0.09 * Math.sin(17.3 * t + ph) + 0.04 * Math.sin(37.1 * t + ph);
  d.f.setAttribute('transform', `translate(75 82) scale(${(sx * on).toFixed(4)} ${(sy * on).toFixed(4)}) skewX(${(4 * Math.sin(7.9 * t + ph)).toFixed(3)}) translate(-75 -82)`);
  d.g.setAttribute('opacity', (on * (0.8 + 0.2 * Math.sin(11 * t + ph))).toFixed(3));
};

// ---------- rangoli ----------
{ let s = '<g fill="none" stroke="#C98420" stroke-width="2.2">';
  for (let k = 0; k < 16; k++) s += `<path transform="rotate(${k * 22.5})" d="M0 -430 C 46 -370 46 -300 0 -255 C -46 -300 -46 -370 0 -430 Z"/>`;
  for (let k = 0; k < 16; k++) s += `<path transform="rotate(${k * 22.5 + 11.25})" d="M0 -300 C 26 -265 26 -230 0 -205 C -26 -230 -26 -265 0 -300 Z"/>`;
  s += '<circle r="205" stroke-dasharray="3 10"/><circle r="250"/><circle r="440" stroke-dasharray="2 14"/></g><g fill="#C98420">';
  for (let k = 0; k < 32; k++) { const a = k / 32 * Math.PI * 2; s += `<circle cx="${(470 * Math.sin(a)).toFixed(1)}" cy="${(-470 * Math.cos(a)).toFixed(1)}" r="4"/>`; }
  $('#rangoli').innerHTML = s + '</g>'; }

// ---------- night canvas: stars, rockets, bursts ----------
const nc = $('#night').getContext('2d'), gc = $('#glit').getContext('2d');
const R0 = rng(11); const STARS = Array.from({ length: 110 }, () => ({ x: R0() * W, y: R0() * 1500, r: 0.6 + R0() * 1.6, ph: R0() * 6.28, sp: 1 + R0() * 3 }));
const R2 = rng(19); const EMB = Array.from({ length: 70 }, () => ({ x: R2() * W, y0: R2() * 1700, sp: 30 + R2() * 60, r: 1 + R2() * 2.2, a: 0.25 + R2() * 0.4, ph: R2() * 6.28 }));
const ROCKETS = [{ x: 360, y0: 2000, y1: 760, t0: -0.4, t1: 1.9, seed: 3 }, { x: 720, y0: 2000, y1: 640, t0: -0.15, t1: 2.15, seed: 5 }];
const rocketPos = (r, tau) => { const k = ez('power2.out')(clamp((tau - r.t0) / (r.t1 - r.t0))); return [r.x + 7 * Math.sin(tau * 9 + r.seed) * (1 - k), L(r.y0, r.y1, k)]; };
const GOLD = ['255,214,130', '255,180,60', '255,140,45', '255,240,200'];
const BURSTS = ROCKETS.map((r, b) => { const R = rng(100 + b * 7); const n = b ? 260 : 240;
  return { cx: r.x, cy: r.y1, t0: r.t1, ps: Array.from({ length: n }, (_, i) => { const th = i / n * Math.PI * 2 + (R() - 0.5) * 0.06, ring = R() < 0.22; return { th, v: (ring ? 780 : 1080 + 360 * R()) * (b ? 1.05 : 1), life: 1.35 + 0.9 * R(), c: GOLD[(R() * 4) | 0], ph: R() * 6.28, sz: 2.0 + 2.0 * R() }; }) }; });
const K = 2.4, G = 300;
const bpos = (B, p, s) => { const e = (1 - Math.exp(-K * s)) / K; return [B.cx + p.v * Math.cos(p.th) * e, B.cy + p.v * Math.sin(p.th) * e + G * (s / K - e / K)]; };
function drawNight(t) {
  nc.clearRect(0, 0, W, H);
  for (const s of STARS) { nc.fillStyle = `rgba(255,240,220,${(0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph))).toFixed(3)})`; nc.beginPath(); nc.arc(s.x, s.y, s.r, 0, 6.283); nc.fill(); }
  for (const e of EMB) { const y = 1800 - ((e.y0 + e.sp * t) % 1700), x = e.x + 18 * Math.sin(t * 1.1 + e.ph); nc.fillStyle = `rgba(255,${170 + (e.ph * 10 | 0)},90,${(e.a * (0.6 + 0.4 * Math.sin(t * 5 + e.ph))).toFixed(3)})`; nc.beginPath(); nc.arc(x, y, e.r, 0, 6.283); nc.fill(); }
  nc.globalCompositeOperation = 'lighter';
  // rocket trails and heads
  for (const r of ROCKETS) {
    const R = rng(r.seed * 31);
    for (let tau = r.t0; tau < Math.min(t, r.t1); tau += 1 / 120) {
      const a = t - tau; const rx = (R() - 0.5) * 80, ry = 20 + R() * 70; if (a > 0.7) continue;
      const [x, y] = rocketPos(r, tau); const px = x + rx * a, py = y + ry * a + 120 * a * a; const al = (1 - a / 0.7) ** 1.4;
      nc.fillStyle = `rgba(255,${190 + (R() * 50) | 0},110,${(al * 0.85).toFixed(3)})`; nc.beginPath(); nc.arc(px, py, 1.5 + 3 * (1 - a / 0.7), 0, 6.283); nc.fill();
    }
    if (t < r.t1) { const [x, y] = rocketPos(r, t); const g = nc.createRadialGradient(x, y, 0, x, y, 40); g.addColorStop(0, 'rgba(255,252,235,1)'); g.addColorStop(0.25, 'rgba(255,205,120,.8)'); g.addColorStop(1, 'rgba(255,160,60,0)'); nc.fillStyle = g; nc.beginPath(); nc.arc(x, y, 40, 0, 6.283); nc.fill(); }
  }
  // bursts
  for (const B of BURSTS) {
    const s0 = t - B.t0; if (s0 < 0) continue;
    if (s0 < 0.35) { const fl = 1 - s0 / 0.35, rr = 120 + 260 * s0; const g = nc.createRadialGradient(B.cx, B.cy, 0, B.cx, B.cy, rr); g.addColorStop(0, `rgba(255,245,215,${fl})`); g.addColorStop(1, 'rgba(255,190,90,0)'); nc.fillStyle = g; nc.beginPath(); nc.arc(B.cx, B.cy, rr, 0, 6.283); nc.fill(); }
    for (const p of B.ps) {
      if (s0 > p.life) continue; const life = 1 - s0 / p.life; const tw = s0 > 0.55 ? 0.55 + 0.45 * Math.sin(38 * s0 + p.ph) : 1;
      for (let j = 5; j >= 0; j--) { const s = s0 - j * 0.022; if (s < 0) continue; const [x, y] = bpos(B, p, s); const a = life ** 1.4 * tw * (1 - j / 6);
        const hot = clamp(1 - s0 / 0.18); nc.fillStyle = `rgba(${hot > 0 ? '255,250,235' : p.c},${(a * (j ? 0.5 : 1)).toFixed(3)})`; nc.beginPath(); nc.arc(x, y, p.sz * (j ? 0.7 : 1.15), 0, 6.283); nc.fill(); }
    }
  }
  nc.globalCompositeOperation = 'source-over';
}

// ---------- glitter on ivory (falling gold) ----------
const R1 = rng(77); const GL = Array.from({ length: 150 }, () => ({ x: R1() * W, y0: R1() * 2100, sp: 55 + R1() * 95, sw: 10 + R1() * 26, ph: R1() * 6.28, sz: 1.4 + R1() * 3.2, a: 0.35 + R1() * 0.45, c: R1() < 0.5 ? '214,150,40' : '236,182,80' }));
function drawGlitter(t, amt) {
  gc.clearRect(0, 0, W, H); if (amt <= 0) return;
  for (const g of GL) { const y = ((g.y0 + g.sp * t) % 2100) - 90, x = g.x + g.sw * Math.sin(t * 1.3 + g.ph); const tw = 0.6 + 0.4 * Math.sin(t * 7 + g.ph * 3);
    gc.fillStyle = `rgba(${g.c},${(g.a * tw * amt).toFixed(3)})`; gc.beginPath(); gc.arc(x, y, g.sz, 0, 6.283); gc.fill(); }
}

// ---------- helpers for text reveals ----------
const reveal = (el, k, o = 0) => { el.style.opacity = (Math.min(1, k * 1.6) * (1 - o)).toFixed(4); el.style.transform = `translate3d(${(-50 * (1 - k)).toFixed(2)}px,${(-26 * o).toFixed(2)}px,0)`; el.style.clipPath = `inset(-30% ${((1 - k) * 100).toFixed(2)}% -30% -8%)`; };
document.querySelectorAll('.shine').forEach(s => { const src = s.previousElementSibling.getAttribute('src'); s.style.webkitMaskImage = `url(${src})`; s.style.maskImage = `url(${src})`; });

// ---------- frame ----------
function frame(t) {
  t = clamp(t, 0, D);
  drawNight(t);
  DIYAS.forEach((d, i) => flicker(d, t, i * 1.7));
  // burst glow and light flood
  const gl = P(t, 1.9, 2.6, 'power2.out');
  $('#burstGlow').style.background = `radial-gradient(circle at 360px 760px, rgba(255,190,90,${(0.35 * gl).toFixed(3)}), rgba(255,160,60,0) ${L(200, 900, gl).toFixed(0)}px), radial-gradient(circle at 720px 640px, rgba(255,200,110,${(0.35 * P(t, 2.15, 2.7, 'power2.out')).toFixed(3)}), rgba(255,160,60,0) ${L(200, 900, P(t, 2.15, 2.7, 'power2.out')).toFixed(0)}px)`;
  const soft = 720, fr = L(-soft, 1900, P(t, 2.45, 3.45, 'power1.in')), fr2 = L(-soft, 1900, P(t, 2.6, 3.5, 'power1.in'));
  const m = `radial-gradient(circle at 360px 760px, #000 ${Math.max(0, fr).toFixed(0)}px, transparent ${(fr + soft).toFixed(0)}px), radial-gradient(circle at 720px 640px, #000 ${Math.max(0, fr2).toFixed(0)}px, transparent ${(fr2 + soft).toFixed(0)}px)`;
  const iv = $('#ivory'); iv.style.webkitMaskImage = m; iv.style.maskImage = m; vis(iv, t > 2.46);
  drawGlitter(t, P(t, 2.8, 3.4, 'none') * (t > 4.85 ? L(1, 0.7, P(t, 4.85, 5.4)) : 1));
  // S1 text
  const t1o = P(t, 1.7, 2.05, 'power2.in'); const t1 = $('#t1'); t1.style.opacity = 1 - t1o; t1.style.transform = `translate3d(0,${(-30 * t1o).toFixed(2)}px,0) scale(${(1 + 0.025 * P(t, 0, 1.7, 'sine.out')).toFixed(4)})`; vis(t1, t < 2.1);
  // S4 logos
  const on4 = t > 2.9 && t < 5.05; ['#t2', '#lCore', '#lAdam', '#divider'].forEach(s => vis($(s), on4));
  if (on4) {
    const out = P(t, 4.68, 5.02, 'power2.in');
    reveal($('#t2a'), P(t, 3.0, 3.5, 'expo.out'), out); reveal($('#t2b'), P(t, 3.12, 3.62, 'expo.out'), out);
    [['#lCore', 3.15], ['#lAdam', 3.45]].forEach(([s, a], i) => { const k = P(t, a, a + 0.6, 'expo.out'); const el = $(s);
      el.style.opacity = (Math.min(1, k * 1.5) * (1 - out)).toFixed(4); el.style.transform = `translate3d(0,${(46 * (1 - k) - 70 * out).toFixed(2)}px,0) scale(${(L(0.93, 1, k) * L(1, 1.03, P(t, a + 0.6, 4.8, 'sine.inOut'))).toFixed(4)})`;
      el.querySelector('.shine').style.backgroundPosition = `${L(120, -20, P(t, a + 0.15, a + 1.0, 'power2.inOut')).toFixed(2)}% 0`; });
    const dv = P(t, 3.35, 3.9, 'expo.out'); $('#divider').style.transform = `scaleX(${dv})`; $('#divider').style.opacity = 1 - out;
  }
  // falling spark that becomes the diya flame
  // (drawn on the glitter canvas, above ivory)
  if (t > 4.85 && t < 5.5) { const k = P(t, 4.85, 5.45, 'power2.in'), x = 540 + 30 * Math.sin(k * 3), y = L(140, 1010, k);
    for (let j = 0; j < 8; j++) { const kk = P(t - j * 0.018, 4.85, 5.45, 'power2.in'); const yy = L(140, 1010, kk), xx = 540 + 30 * Math.sin(kk * 3);
      gc.fillStyle = `rgba(232,150,30,${(0.9 * (1 - j / 8)).toFixed(3)})`; gc.beginPath(); gc.arc(xx, yy, 7 - j * 0.6, 0, 6.283); gc.fill(); }
    const g = gc.createRadialGradient(x, y, 0, x, y, 40); g.addColorStop(0, 'rgba(255,200,90,.9)'); g.addColorStop(1, 'rgba(255,170,60,0)'); gc.fillStyle = g; gc.beginPath(); gc.arc(x, y, 40, 0, 6.283); gc.fill(); }
  // S5 greeting
  const on5 = t > 5.0; ['#g1', '#hd', '#bigDiya', '#from', '#row', '#rangoli'].forEach(s => vis($(s), on5));
  if (on5) {
    const push = L(1, 1.035, P(t, 5.6, 10, 'sine.inOut'));
    const rg = $('#rangoli'); rg.style.opacity = (0.32 * P(t, 5.1, 6.0, 'power1.out')).toFixed(3); rg.style.transform = `rotate(${(t * 6).toFixed(2)}deg) scale(${(L(0.9, 1, P(t, 5.1, 6.2, 'expo.out')) * push).toFixed(4)})`;
    reveal($('#g1a'), P(t, 5.2, 5.7, 'expo.out')); reveal($('#g1b'), P(t, 5.38, 5.88, 'expo.out')); reveal($('#g1c'), P(t, 5.56, 6.06, 'expo.out'));
    $('#g1').style.transform = `scale(${push})`; $('#g1').style.transformOrigin = '540px 160px';
    const hk = P(t, 5.75, 6.4, 'expo.out'); const hd = $('#hd'); hd.style.opacity = Math.min(1, hk * 1.4); hd.style.transform = `translate3d(0,${(30 * (1 - hk)).toFixed(2)}px,0) scale(${(L(0.9, 1, hk) * push).toFixed(4)})`;
    const bd = $('#bigDiya'), bk = P(t, 5.08, 5.42, 'expo.out'); bd.style.opacity = bk; bd.style.transform = `translate3d(0,${(20 * (1 - bk)).toFixed(2)}px,0) scale(${(1.6 * push).toFixed(4)})`;
    flicker(BIG, t, 0.9, P(t, 5.42, 5.6, 'back.out(2.5)'));
    const fk = P(t, 6.35, 6.85, 'expo.out'); $('#from').style.opacity = fk; $('#from').style.transform = `translate3d(0,${(24 * (1 - fk)).toFixed(2)}px,0)`;
    const rk = P(t, 6.55, 7.1, 'expo.out'); $('#row').style.opacity = rk; $('#row').style.transform = `translate3d(0,${(30 * (1 - rk)).toFixed(2)}px,0) scale(${(L(0.96, 1, rk) * L(1, 1.02, P(t, 7.1, 10, 'sine.inOut'))).toFixed(4)})`;
  }
}

const st = { t: 0 };
const tl = gsap.timeline({ paused: true });
tl.to(st, { t: D, duration: D, ease: 'none', onUpdate: () => frame(st.t) }, 0);
window.__timelines = window.__timelines || {}; window.__timelines.root = tl;
window.addEventListener('hf-seek', e => frame(e.detail.time));
document.fonts.ready.then(() => frame(tl.time()));
frame(0);
})();
