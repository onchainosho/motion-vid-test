// Core intro film: one GSAP timeline drives frame(t); every visual value is a pure function of timeline time.
import * as THREE from './vendor/three.module.js';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const D = 27;
const $ = s => document.querySelector(s);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const EZ = {}; const ez = n => EZ[n] || (EZ[n] = gsap.parseEase(n));
const P = (t, a, b, e = 'power2.inOut') => ez(e)(clamp((t - a) / (b - a)));
const L = (a, b, k) => a + (b - a) * k;
const vis = (el, on) => { const v = on ? 'visible' : 'hidden'; if (el.style.visibility !== v) el.style.visibility = v; };
const tf = (el, x = 0, y = 0, s = 1, r = 0, o = 1) => { el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${r.toFixed(3)}deg) scale(${s.toFixed(5)})`; el.style.opacity = o.toFixed(4); };
// a headline line enters with a short slide plus a directional reveal; it never crosses the frame edge
const lineIn = (el, k, sg, o = 0) => { const x = sg * -150 * (1 - k) + sg * 150 * o; el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`; el.style.opacity = (Math.min(1, k * 1.6) * (1 - o)).toFixed(4);
  const c = ((1 - k) * 100).toFixed(2); el.style.clipPath = sg > 0 ? `inset(-25% ${c}% -25% -6%)` : `inset(-25% -6% -25% ${c}%)`; };
const mix = (c1, c2, k) => { const a = c1.match(/\w\w/g).map(h => parseInt(h, 16)), b = c2.match(/\w\w/g).map(h => parseInt(h, 16)); return `rgb(${a.map((v, i) => Math.round(L(v, b[i], k))).join(',')})`; };
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------- icons ----------
const I = {
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  db: '<ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v13c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-13M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  graph: '<circle cx="6" cy="6.5" r="2.5"/><circle cx="18" cy="8" r="2.5"/><circle cx="9.5" cy="18" r="2.5"/><path d="M8.5 6.8l7 .9M6.9 8.9l1.7 6.6M16.4 10l-5.3 6"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  orch: '<rect x="9" y="2.5" width="6" height="5" rx="1.2"/><rect x="3" y="16.5" width="6" height="5" rx="1.2"/><rect x="15" y="16.5" width="6" height="5" rx="1.2"/><path d="M12 7.5v4.5M6 16.5V14h12v2.5"/>',
  shield: '<path d="M12 2.8l8 3v6c0 5-3.5 8.4-8 9.4-4.5-1-8-4.4-8-9.4v-6z"/><path d="m8.8 12 2.3 2.3 4.4-4.6"/>',
  cube: '<path d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3z"/><path d="M3.5 7.3 12 12l8.5-4.7M12 12v9.5"/>',
  chat: '<path d="M4 4.5h16v11.5H9.5L4 20z"/><path d="M8 8.5h8M8 12h5"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4.5V8M9 13v.5M15 13v.5M9.5 17h5"/><circle cx="12" cy="3.5" r="1.2"/>',
  flow: '<rect x="3" y="3" width="7" height="6" rx="1.5"/><rect x="14" y="15" width="7" height="6" rx="1.5"/><path d="M6.5 9v3.5a2 2 0 0 0 2 2H14"/><path d="M17.5 15v-2.5a2 2 0 0 0-2-2H13"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  check: '<path d="m5 12.5 4.6 4.6L19 7.5"/>',
};
const svg = (k, cls = '') => `<svg viewBox="0 0 24 24" class="${cls}">${I[k]}</svg>`;
const BADGE = {
  Documents: ['b-doc', svg('doc')], ERP: ['b-erp', 'ERP'], CRM: ['b-crm', 'CRM'], HRMS: ['b-hr', 'HR'], Databases: ['b-db', svg('db')],
};
const SUB = { Documents: 'Files, PDFs, Spreadsheets', ERP: 'Finance, Supply Chain', CRM: 'Customers, Sales, Tickets', HRMS: 'Employees, Policies', Databases: 'SQL/NoSQL, Data Lakes' };
const SRC = ['Documents', 'ERP', 'CRM', 'HRMS', 'Databases'];

// ---------- z order ----------
[['#bg', 0], ['#s1', 1], ['#s2', 2], ['#s45', 3], ['#s3', 4], ['#s6', 5], ['#s7', 6], ['#s8', 7], ['#purple', 8], ['#s9', 9], ['#s10', 10], ['#s11', 11], ['#s12', 12], ['#ring', 20], ['#pulse', 21], ['#fly', 22]]
  .forEach(([s, z]) => $(s).style.zIndex = z);

// ---------- logo ----------
const LET = { C: [82, 'M76 7.5H32Q7.5 7.5 7.5 32V68Q7.5 92.5 32 92.5H76'], R: [80, 'M7.5 92.5V7.5H48Q72.5 7.5 72.5 30.5Q72.5 53.5 48 53.5H7.5M44 53.5L72.5 92.5'], E: [75, 'M67.5 7.5H7.5V92.5H67.5M7.5 50H60'] };
function makeLogo(host, h, cx, cy) {
  const u = [0.82, 0.55, 1.30, 0.55, 0.80, 0.60, 0.75], W = u.reduce((a, b) => a + b) * h; let x = cx - W / 2; const out = { letters: [] };
  const put = (ch, w) => { const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); el.setAttribute('viewBox', `0 0 ${LET[ch][0]} 100`); el.setAttribute('width', w); el.setAttribute('height', h); el.style.left = x + 'px'; el.style.top = (cy - h / 2) + 'px'; el.innerHTML = `<path d="${LET[ch][1]}" stroke-width="15"/>`; host.appendChild(el); out.letters.push(el); };
  put('C', u[0] * h); x += (u[0] + u[1]) * h; out.ringX = x + u[2] * h / 2; out.ringY = cy; out.ringD = u[2] * h; x += (u[2] + u[3]) * h;
  put('R', u[4] * h); x += (u[4] + u[5]) * h; put('E', u[6] * h);
  return out;
}
const LOGO3 = makeLogo($('#s3logo'), 150, 540, 760);
const LOGO12 = makeLogo($('#s12logo'), 168, 540, 720);
const plate = $('#s3plate'), disc = $('#s3disc');
{ const hx = LOGO3.ringX + 2000, hy = LOGO3.ringY + 2000, hr = LOGO3.ringD / 2 * 0.41;
  const m = `radial-gradient(circle at ${hx}px ${hy}px, transparent ${hr}px, #000 ${hr + 1}px)`; plate.style.webkitMask = m; plate.style.mask = m;
  Object.assign(disc.style, { left: (LOGO3.ringX - hr - 1) + 'px', top: (LOGO3.ringY - hr - 1) + 'px', width: (2 * hr + 2) + 'px', height: (2 * hr + 2) + 'px' }); }
['#s3', '#s12'].forEach(s => $(s).style.transformOrigin = '0 0');

// ---------- S1 wall ----------
const wall = $('#wall'), WC = []; const TH = -12 * Math.PI / 180;
for (let j = -9; j <= 9; j++) for (let i = -3; i <= 3; i++) {
  const name = SRC[((i * 2 + j * 3) % 5 + 5) % 5], el = document.createElement('div'); el.className = 'wcard';
  el.innerHTML = `<div class="badge ${BADGE[name][0]}">${BADGE[name][1]}</div><div><div class="nm">${name}</div><div class="sb">${SUB[name]}</div></div>`;
  wall.appendChild(el); WC.push({ el, i, j, sc: 1 + 0.05 * Math.sin(j * 1.7 + i) });
}
function sceneWall(t) {
  const push = L(1, 1.07, P(t, 0, 1.6, 'sine.out'));
  for (const c of WC) {
    const u = c.i * 360 + (c.j & 1 ? 180 : 0) + (c.j & 1 ? 1 : -1) * t * 46, v = c.j * 150;
    let x = 540 + (u * Math.cos(TH) - v * Math.sin(TH)) * push, y = 960 + (u * Math.sin(TH) + v * Math.cos(TH)) * push;
    const dx = x - 540, dy = y - 900, d = Math.hypot(dx, dy), ts = 1.12 + d / 1700 * 0.5, k = P(t, ts, ts + 0.5, 'power3.in');
    const a = k * 1.1, rx = dx * Math.cos(a) - dy * Math.sin(a), ry = dx * Math.sin(a) + dy * Math.cos(a);
    x = 540 + rx * (1 - k); y = 900 + ry * (1 - k);
    const o = 1 - P(t, ts + 0.36, ts + 0.5, 'none');
    if (o <= 0.001) { c.el.style.opacity = 0; continue; }
    tf(c.el, x - 165, y - 59, c.sc * push * L(1, 0.06, k), TH * 180 / Math.PI + a * 57.3, o);
  }
  const pk = P(t, 1.42, 1.82, 'power3.in');
  tf($('#s1panel'), 0, -300 * pk, L(1, 1.025, P(t, 0, 1.4, 'sine.out')), 0, 1 - P(t, 1.55, 1.82, 'none'));
}

// ---------- S4/S5 canvas ----------
const cvl = $('#cvlines'), srcs = $('#srcs');
const SY = SRC.map((_, i) => 430 + i * 200);
SRC.forEach((n, i) => { const el = document.createElement('div'); el.className = 'scard'; el.style.top = SY[i] + 'px'; el.innerHTML = `<div class="badge ${BADGE[n][0]}">${BADGE[n][1]}</div><div class="nm">${n}</div><div class="dot"></div>`; srcs.appendChild(el); });
const SC = [...document.querySelectorAll('.scard')];
const NS = 'http://www.w3.org/2000/svg';
const mkPath = (host, d, attrs = {}) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); for (const k in attrs) p.setAttribute(k, attrs[k]); host.appendChild(p); const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; p._len = len; return p; };
const SL = SY.map((y, i) => { const cy = y + 86; return mkPath(cvl, `M781 ${cy} C 870 ${cy} 930 ${cy + 24} 930 ${cy + 124} L 930 1700 C 930 1780 600 1765 540 1810`); });
const docPath = SL[0];
const CAPS = [['eye', 'Context Understanding'], ['search', 'Semantic Search'], ['graph', 'Knowledge Graph'], ['orch', 'AI Orchestration'], ['shield', 'Security & Governance'], ['eye', 'Observability']];
const capsEl = $('#caps');
CAPS.forEach(([ic, n], k) => { const el = document.createElement('div'); el.className = 'cap'; el.style.top = (k * 128) + 'px'; el.innerHTML = `${svg(ic)}<span>${n}</span><div class="tick">${svg('check')}</div>`; capsEl.appendChild(el); });
const CP = [...document.querySelectorAll('.cap')];
const hubToTick = mkPath(cvl, 'M540 2010 C 540 2200 760 2250 790 2425', { style: 'stroke:none' });
const HUB_RING = { x: 540, y: 2010, d: 220 };
const camY = t => 1500 * P(t, 6.25, 7.1, 'power2.inOut') + 60 * P(t, 7.1, 8.4, 'sine.inOut');
const cvScale = t => L(1.25, 1, P(t, 5.25, 6.0, 'expo.out'));
// canvas -> screen (scale about the portal centre during arrival)
const cv2s = (x, y, t) => { const s = cvScale(t), ox = LOGO3.ringX, oy = LOGO3.ringY; return [ox + (x - ox) * s, oy + (y - camY(t) - oy) * s, s]; };
function sceneCanvas(t) {
  const s = cvScale(t), ox = LOGO3.ringX, oy = LOGO3.ringY;
  $('#cv').style.transform = `translate3d(${ox - ox * s}px,${oy - oy * s - camY(t) * s}px,0) scale(${s})`;
  $('#s4label').style.opacity = P(t, 5.3, 5.6);
  SC.forEach((el, i) => { const k = P(t, 5.3 + i * 0.05, 5.8 + i * 0.05, 'expo.out'); tf(el, L(60, 0, k), 0, 1, 0, k); });
  // selection of Documents
  const sel = P(t, 5.9, 6.05, 'power2.out');
  SC[0].style.borderColor = mix('E7E1F3', '6100A8', sel); SC[0].style.boxShadow = `0 16px 44px rgba(54,20,120,.08), 0 0 0 ${8 * sel}px rgba(97,0,168,.10)`;
  SC[0].querySelector('.dot').style.background = mix('B9A6E3', '6100A8', sel);
  SC[0].style.transform += ` scale(${1 + 0.02 * Math.sin(Math.PI * clamp((t - 5.9) / 0.3))})`;
  SL.forEach((p, i) => { const k = P(t, 5.55 + i * 0.06, 6.35 + i * 0.06, 'power2.inOut'); p.style.strokeDashoffset = p._len * (1 - k); p.style.stroke = i === 0 ? mix('C9B6EC', '8C5BDB', sel) : '#C9B6EC'; });
  // hub
  const col = P(t, 8.05, 8.3, 'power2.in');
  const hub = $('#hub'); hub.style.transformOrigin = '430px 200px'; hub.style.transform = `scale(${L(1, 0.55, col)})`; hub.style.opacity = 1 - P(t, 7.98, 8.16, 'none');
  CP.forEach((el, k) => {
    const flash = Math.max(0, Math.sin(Math.PI * clamp((t - 7.42 - k * 0.05) / 0.3))) * 0.6;
    const on = k === 1 ? P(t, 7.72, 7.85, 'power2.out') : 0;
    el.style.background = `rgba(241,234,251,${Math.max(flash, on).toFixed(3)})`; el.style.borderColor = on ? `rgba(97,0,168,${on})` : 'transparent';
    const tk = el.querySelector('.tick'); tk.style.opacity = on; tk.style.transform = `scale(${on ? L(0.4, 1, P(t, 7.75, 8.05, 'back.out(2)')) : 0.4})`;
  });
}

// ---------- S6 outputs ----------
const OUT = [['cube', 'AI Products', 285, 480], ['chat', 'Assistants', 795, 480], ['search', 'Enterprise<br>Search', 285, 1440], ['flow', 'Workflow<br>Automation', 795, 1440], ['bot', 'AI Agents', 540, 1690, 1]];
const outs = $('#outs'), s6l = $('#s6lines');
const OC = OUT.map(([ic, n, x, y, hero], i) => {
  const el = document.createElement('div'); el.className = 'ocard' + (hero ? ' hero' : ''); const w = hero ? 620 : 470, h = hero ? 200 : 170;
  el.style.left = (x - w / 2) + 'px'; el.style.top = (y - h / 2) + 'px';
  el.innerHTML = `<div class="fill"></div><div class="inner"><div class="badge">${svg(ic)}</div><div class="nm">${n}</div></div>${hero ? `<div class="chk">${svg('check')}</div>` : ''}`;
  outs.appendChild(el);
  const ey = y + (y < 960 ? h / 2 : -h / 2);
  const line = mkPath(s6l, `M540 960 C 540 ${(960 + ey) / 2} ${x} ${(960 + ey) / 2} ${x} ${ey}`);
  return { el, x, y, line, hero };
});
const agentPath = OC[4].line;
function sceneOutputs(t) {
  const push = L(1, 1.04, P(t, 9.0, 10.0, 'sine.inOut')), ex = P(t, 9.9, 10.22, 'power3.in');
  const S = push * L(1, 0.86, ex);
  $('#s6').style.transformOrigin = '540px 960px'; $('#s6').style.transform = `scale(${S})`; $('#s6').style.opacity = 1 - P(t, 9.95, 10.2, 'none');
  $('#s6label').style.opacity = P(t, 8.4, 8.7);
  OC.forEach((c, i) => {
    const k = P(t, 8.3 + i * 0.05, 8.8 + i * 0.05, 'expo.out');
    tf(c.el, (540 - c.x) * (1 - k), (960 - c.y) * (1 - k), L(0.25, 1, k), (i % 2 ? 8 : -8) * (1 - k), clamp((k - 0.35) * 3));
    c.line.style.strokeDashoffset = c.line._len * (1 - P(t, 8.4 + i * 0.05, 8.85 + i * 0.05));
    if (!c.hero) c.el.style.borderColor = mix('E7E1F3', 'B79BE6', P(t, 9.05 + i * 0.07, 9.25 + i * 0.07));
  });
  const h = OC[4], on = P(t, 9.5, 9.62, 'power2.out');
  h.el.querySelector('.fill').style.opacity = on; h.el.querySelector('.nm').style.color = mix('1A0066', 'FFFFFF', on);
  const b = h.el.querySelector('.badge'); b.style.background = on > 0.5 ? 'rgba(255,255,255,.16)' : '#F1EAFB'; b.style.color = mix('6100A8', 'FFFFFF', on);
  const ck = h.el.querySelector('.chk'); ck.style.opacity = P(t, 9.6, 9.7); ck.style.transform = `scale(${L(0.3, 1, P(t, 9.6, 9.9, 'back.out(2.2)'))})`;
  h.el.style.transform += ` scale(${1 + 0.045 * Math.sin(Math.PI * clamp((t - 9.5) / 0.35))})`;
  h.line.style.stroke = mix('C9B6EC', '8C5BDB', P(t, 9.1, 9.3));
}

// ---------- S7 3D foundation ----------
const gl = $('#gl');
const R3 = new THREE.WebGLRenderer({ canvas: gl, antialias: true, preserveDrawingBuffer: true });
R3.setPixelRatio(1); R3.setSize(1080, 1920, false); R3.setClearColor(0xF7F8FB, 1);
R3.toneMapping = THREE.NoToneMapping; R3.outputColorSpace = THREE.SRGBColorSpace;
const sc3 = new THREE.Scene();
const pm = new THREE.PMREMGenerator(R3); sc3.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; sc3.environmentIntensity = 0.55;
const cam3 = new THREE.PerspectiveCamera(30, 1080 / 1920, 0.1, 100);
sc3.add(new THREE.HemisphereLight(0xffffff, 0xd9d0ee, 0.9));
const key = new THREE.DirectionalLight(0xffffff, 2.1); key.position.set(-6, 9, 5); sc3.add(key);
const rim = new THREE.DirectionalLight(0xd8ccff, 2.4); rim.position.set(5, 4, -7); sc3.add(rim);
const mat = (c, rough = 0.42, cc = 0.5) => new THREE.MeshPhysicalMaterial({ color: c, roughness: rough, metalness: 0, clearcoat: cc, clearcoatRoughness: 0.35 });
const box = (w, h, d, r, m) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, r), m);
const base = box(4.7, 0.3, 4.7, 0.1, mat(0xF3EEFB, 0.55, 0.3)); base.position.y = 0.15; sc3.add(base);
const LAY = [[0xE6DAFB, 0.51], [0xCDB3F4, 0.93], [0xA982E9, 1.35]].map(([c, y]) => { const m = box(4.0, 0.42, 4.0, 0.09, mat(c)); m.position.y = y; m.userData.y = y; sc3.add(m); return m; });
const top = box(4.0, 0.34, 4.0, 0.09, mat(0x6100A8, 0.5, 0.25)); top.position.y = 1.73; sc3.add(top);
// thin seams so layers read as separate parts when stacked (no gaps)
const CUBES = [[-1.15, -1.15], [1.15, -1.15], [0, 0], [-1.15, 1.15], [1.15, 1.15]].map(([x, z], i) => { const m = box(0.62, 0.62, 0.62, 0.1, mat(i === 2 ? 0x9D6BEB : 0xB993F0, 0.35, 0.7)); m.position.set(x, 4, z); sc3.add(m); return m; });
{ // soft contact shadow, deterministic canvas texture
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const gr = g.createRadialGradient(128, 128, 30, 128, 128, 128);
  gr.addColorStop(0, 'rgba(40,10,90,0.32)'); gr.addColorStop(0.6, 'rgba(40,10,90,0.10)'); gr.addColorStop(1, 'rgba(40,10,90,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 8.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = 0.002; sc3.add(sh); sh.scale.setScalar(0.86);
}
const G3 = new THREE.Group(); [base, ...LAY, top, ...CUBES].forEach(m => G3.add(m)); sc3.add(G3); G3.scale.setScalar(0.86);
const LBL = ['Connected<br>knowledge', 'Governed<br>intelligence', 'Reusable<br>capabilities'].map(n => { const el = document.createElement('div'); el.className = 'l3d'; el.innerHTML = `<div class="knob"></div><div class="lead"></div><div class="pill"><b>${n}</b></div>`; $('#s7labels').appendChild(el); return el; });
const v3 = new THREE.Vector3();
function scene3D(t) {
  const e = P(t, 10.85, 11.55, 'power2.inOut') * (1 - P(t, 12.65, 13.15, 'power2.inOut'));
  LAY.forEach((m, i) => m.position.y = m.userData.y + e * (i * 0.8 + 0.06 * Math.sin(t * 3.1 + i * 1.3)));
  top.position.y = 1.73 + e * 3 * 0.8;
  const topSurf = top.position.y + 0.17;
  CUBES.forEach((m, i) => { const k = P(t, 12.95 + i * 0.07, 13.35 + i * 0.07, 'power3.out'); m.position.y = topSurf + 0.31 + L(2.6, 0, k); m.visible = k > 0; m.scale.setScalar(L(0.6, 1, k)); m.rotation.y = (1 - k) * 0.8; });
  const yaw = L(-44, -6, P(t, 10.2, 13.6, 'power1.inOut')) * Math.PI / 180, pitch = L(36, 44, P(t, 10.2, 13.7, 'sine.inOut')) * Math.PI / 180, r = L(25.5, 23.5, P(t, 10.2, 13.7, 'sine.out'));
  const tgt = new THREE.Vector3(0, (1.3 + e * 1.2) * 0.86, 0);
  cam3.position.set(tgt.x + r * Math.cos(pitch) * Math.sin(yaw), tgt.y + r * Math.sin(pitch), tgt.z + r * Math.cos(pitch) * Math.cos(yaw));
  cam3.lookAt(tgt); cam3.setViewOffset(1080, 1920, 150, -90, 1080, 1920); cam3.updateMatrixWorld();
  R3.render(sc3, cam3);
  // labels from projected anchors (right-front corner of each layer)
  LAY.forEach((m, i) => {
    m.localToWorld(v3.set(2.0, 0, 2.0)); v3.project(cam3);
    const ax = (v3.x * 0.5 + 0.5) * 1080, ay = (-v3.y * 0.5 + 0.5) * 1920;
    const el = LBL[i], o = P(t, 11.2 + i * 0.1, 11.5 + i * 0.1) * (1 - P(t, 12.55, 12.8, 'none'));
    const pillX = 715, lead = Math.max(10, pillX - ax - 18);
    el.querySelector('.lead').style.width = lead + 'px';
    tf(el, ax - 9, ay - 60, 1, 0, o);
  });
  const lift = P(t, 13.2, 13.55, 'power3.in');
  $('#s7').style.transform = `translate3d(0,${-360 * lift}px,0)`; $('#s7').style.opacity = 1 - P(t, 13.3, 13.55, 'none');
  gl.style.opacity = P(t, 10.25, 10.6, 'power1.out');
  lineIn($('#s7b'), P(t, 10.72, 11.2, 'expo.out'), -1);
  $('#s7foot').style.opacity = P(t, 11.0, 11.4);
  $('#s7a').style.opacity = t >= 10.68 ? 1 : 0;
}

// ---------- S8 overhead path ----------
const STEPS = [['01', 'Approved sources', 'db', 100, 40], ['04', 'Check permissions', 'lock', 100, 330], ['06', 'Ground & validate', 'shield', 100, 620], ['', 'Useful output.<br>Human control.', 'check', 100, 910, 1]];
const stepsEl = $('#steps');
const ST = STEPS.map(([num, n, ic, x, y, fin]) => { const el = document.createElement('div'); el.className = 'step' + (fin ? ' final' : ''); el.style.left = x + 'px'; el.style.top = y + 'px'; el.innerHTML = `<div class="ring2"></div><div class="ic">${svg(ic)}</div><div>${num ? `<div class="num">${num}</div>` : ''}<div class="nm">${n}</div></div>`; stepsEl.appendChild(el); return el; });
const pPath = mkPath($('#planeSvg'), 'M200 150 L 200 1020');
const STEP_T = [13.85, 14.35, 14.85, 15.3];
function scenePath(t) {
  lineIn($('#s8a'), P(t, 13.6, 14.05, 'expo.out'), 1); lineIn($('#s8b'), P(t, 13.68, 14.13, 'expo.out'), -1);
  const hx = P(t, 15.45, 15.7, 'power3.in'); $('#s8h').style.transform = `translate3d(0,${-200 * hx}px,0)`; $('#s8h').style.opacity = 1 - hx;
  const enter = P(t, 13.45, 13.95, 'expo.out'), scroll = 150 * P(t, 13.95, 15.35, 'power1.inOut');
  const y = 590 + L(420, 0, enter) - scroll;
  $('#plane').style.transform = `translate3d(0,${y}px,0) rotateX(${L(26, 16, enter)}deg)`;
  pPath.style.strokeDashoffset = pPath._len * (1 - P(t, 13.5, 14.2));
  const pk = P(t, STEP_T[0], STEP_T[3], 'none'), pt = pPath.getPointAtLength(pPath._len * pk);
  const pp = $('#ppulse'); pp.style.visibility = 'inherit'; pp.style.opacity = (t > 13.8 && t < 15.32) ? 1 : 0; pp.style.transform = `translate3d(${pt.x}px,${pt.y}px,0)`;
  ST.forEach((el, k) => {
    const on = P(t, STEP_T[k] - 0.02, STEP_T[k] + 0.12, 'power2.out');
    el.querySelector('.ring2').style.opacity = k < 3 ? on : 0;
    const ic = el.querySelector('.ic'); ic.style.background = mix('F1EAFB', '6100A8', on); ic.querySelector('svg').style.stroke = mix('6100A8', 'FFFFFF', on);
    el.style.transform = `scale(${1 + 0.04 * Math.sin(Math.PI * clamp((t - STEP_T[k]) / 0.3))})`;
    if (k === 3) { el.style.background = mix('F4EEFC', '6100A8', on); el.querySelector('.nm').style.color = mix('6100A8', 'FFFFFF', on); el.style.borderColor = mix('A98BDD', '6100A8', on); }
  });
}

// ---------- S9 / purple field ----------
const purple = $('#purple');
['#shieldPath', '#shieldTick'].forEach(s => { $(s).setAttribute('pathLength', 1); $(s).style.strokeDasharray = 1; });
const BOUND = { top: 620, left: 60, right: 60, bottom: 320 };
function scenePurple(t) {
  let ins;
  if (t < 15.9) { // grow from the final step card's live rect
    const r = ST[3].getBoundingClientRect(), k = P(t, 15.5, 15.98, 'power3.inOut');
    ins = [L(r.top, 0, k), L(1080 - r.right, 0, k), L(1920 - r.bottom, 0, k), L(r.left, 0, k), L(38, 0, k)];
  } else {
    const k = P(t, 17.62, 18.15, 'power3.inOut');
    ins = [L(0, BOUND.top, k), L(0, BOUND.right, k), L(0, BOUND.bottom, k), L(0, BOUND.left, k), L(0, 48, k)];
  }
  purple.style.clipPath = `inset(${ins.slice(0, 4).map(v => v.toFixed(1) + 'px').join(' ')} round ${ins[4].toFixed(1)}px)`;
  const fade = P(t, 17.85, 18.3, 'power1.inOut');
  purple.style.background = mix('6100A8', 'F1EAFB', fade); purple.style.opacity = 1 - P(t, 18.15, 18.4, 'none');
  // S9 content
  $('#shieldPath').style.strokeDashoffset = 1 - P(t, 16.0, 16.5, 'power2.inOut'); $('#shieldTick').style.strokeDashoffset = 1 - P(t, 16.4, 16.65, 'power2.out'); $('#shieldTick').style.opacity = t > 16.4 ? 1 : 0; $('#shieldPath').style.opacity = t > 16.0 ? 1 : 0;
  const so = P(t, 17.45, 17.72, 'power3.in');
  tf($('#shield'), 0, -160 * so, L(0.85, 1, P(t, 16.0, 16.4, 'expo.out')), 0, 1 - so);
  ['#s9a', '#s9b', '#s9c'].forEach((s, i) => {
    const k = P(t, 16.04 + i * 0.1, 16.5 + i * 0.1, 'expo.out'), o = P(t, 17.38 + i * 0.04, 17.62 + i * 0.04, 'power2.in');
    lineIn($(s), k, i % 2 ? -1 : 1, o);
  });
  const ps = L(1, 1.07, P(t, 16.1, 17.6, 'power1.inOut')); $('#s9h').style.transform = `scale(${ps})`; $('#s9h').style.transformOrigin = '0 50%';
}

// ---------- S10 controlled environment ----------
$('#nData').innerHTML = `<div class="nb">${svg('db')}</div><div class="nm">Your data</div>`; Object.assign($('#nData').style, { left: '60px', top: '800px' });
$('#nModel').innerHTML = `<div class="nb">${svg('bot')}</div><div class="nm">Private model</div>`; Object.assign($('#nModel').style, { left: '740px', top: '800px' });

const s10svg = $('#s10svg');
const A1 = mkPath(s10svg, 'M290 880 L 385 880'), A2 = mkPath(s10svg, 'M695 880 L 790 880');
const AH1 = mkPath(s10svg, 'M372 866 L 386 880 L 372 894'), AH2 = mkPath(s10svg, 'M776 866 L 790 880 L 776 894');
const CH = ['Access policies', 'Audit controls', 'Data residency'].map((n, i) => { const el = document.createElement('div'); el.className = 'chip'; el.innerHTML = `<div class="ck">${svg('check')}</div>${n}`; $('#chips').appendChild(el); el.style.top = (1200 + i * 124) + 'px'; return el; });
const push10 = t => L(1, 1.06, P(t, 18.3, 20.6, 'power1.inOut'));
function sceneControl(t) {
  const sec = $('#s10'); sec.style.transformOrigin = '540px 880px'; sec.style.transform = `scale(${push10(t)})`;
  const out = P(t, 20.25, 20.55, 'power2.in');
  ['#s10a', '#s10b', '#s10c'].forEach((s, i) => { const k = P(t, 17.95 + i * 0.1, 18.45 + i * 0.1, 'expo.out'); lineIn($(s), k, i % 2 ? -1 : 1, P(t, 20.3 + i * 0.04, 20.55 + i * 0.04, 'power2.in')); });
  const bo = P(t, 18.0, 18.3, 'power1.inOut');
  const g = $('#bound'); g.style.opacity = bo * (1 - out); g.style.transformOrigin = '480px 490px'; g.style.transform = `scale(${L(1, 0.96, out)})`;
  ['#nData', '#nModel'].forEach((s, i) => { const k = P(t, 18.2 + i * 0.1, 18.6 + i * 0.1, 'expo.out'); tf($(s), 0, 30 * (1 - k), L(0.85, 1, k) * L(1, 0.9, out), 0, k * (1 - out)); });
  A1.style.strokeDashoffset = A1._len * (1 - P(t, 18.4, 18.6)); AH1.style.strokeDashoffset = AH1._len * (1 - P(t, 18.55, 18.65));
  A2.style.strokeDashoffset = A2._len * (1 - P(t, 18.85, 19.05)); AH2.style.strokeDashoffset = AH2._len * (1 - P(t, 19.0, 19.1));
  s10svg.style.opacity = 1 - out;
  const lit = P(t, 19.2, 19.35, 'power2.out'); const nb = $('#nModel .nb'); nb.style.borderColor = mix('E3DAF4', '6100A8', lit); nb.style.background = mix('FFFFFF', 'F1EAFB', lit);
  nb.style.transform = `scale(${1 + 0.06 * Math.sin(Math.PI * clamp((t - 19.2) / 0.35))})`;
  CH.forEach((el, i) => { const k = P(t, 19.3 + i * 0.2, 19.7 + i * 0.2, 'expo.out'); const w = 520; el.style.left = (540 - w / 2) + 'px'; tf(el, L(-60, 0, k), 0, 1, 0, k * (1 - out));
    const ck = el.querySelector('.ck'); ck.style.transform = `scale(${L(0.2, 1, P(t, 19.38 + i * 0.2, 19.7 + i * 0.2, 'back.out(2.4)'))})`; });
}

// ---------- S11 pilot ----------
function scenePilot(t) {
  [['#s11a', 21.0, -1], ['#s11b', 21.45, 1], ['#s11c', 22.2, -1]].forEach(([s, t0, sg], i) => {
    const k = P(t, t0, t0 + 0.5, 'expo.out'), o = P(t, 23.3 + i * 0.04, 23.52 + i * 0.04, 'power2.in');
    lineIn($(s), k, -sg, o); $(s).style.transform += ` translate3d(${(-sg * 22 * P(t, t0 + 0.4, 23.4, 'sine.inOut')).toFixed(2)}px,0,0)`;
  });
}

// ---------- S12 end ----------
const endPush = t => L(1, 1.03, P(t, 23.95, 27, 'sine.inOut'));
function sceneEnd(t) {
  const S = endPush(t); $('#s12').style.transform = `translate3d(${540 * (1 - S)}px,${960 * (1 - S)}px,0) scale(${S})`;
  LOGO12.letters.forEach((el, i) => { const k = P(t, 23.66 + i * 0.05, 24.14 + i * 0.05, 'expo.out'); tf(el, (i === 0 ? -1 : 1) * 160 * (1 - k), 0, 1, 0, clamp(k * 1.6)); });
  const c = P(t, 23.95, 24.45, 'expo.out'), press = P(t, 25.0, 25.08, 'power2.out') * (1 - P(t, 25.08, 25.4, 'back.out(2)'));
  tf($('#cta'), 0, L(90, 0, c), L(0.94, 1, c) * (1 - 0.045 * press), 0, c);
  $('#ripple').style.opacity = 0.5 * (1 - P(t, 25.0, 25.7, 'power1.out')) * (t >= 25.0 ? 1 : 0); $('#ripple').style.transform = `scale(${L(0.2, 5.5, P(t, 25.0, 25.7, 'power2.out'))})`;
  const nudge = Math.sin(Math.PI * clamp((t - 25.05) / 0.45)) + Math.sin(Math.PI * clamp((t - 26.2) / 0.45));
  $('#ctaArrow').style.transform = `translateX(${14 * nudge}px)`;
  $('#by').style.opacity = P(t, 24.4, 24.8);
}

// ---------- persistent ring ----------
const ring = $('#ring');
function ringState(t) {
  if (t < 1.72) return null;
  if (t < 3.15) { const d = t < 2.5 ? L(0, 720, P(t, 1.72, 2.5, 'expo.out')) : 720 + 40 * P(t, 2.5, 3.15, 'sine.inOut'); return [540, 900, d]; }
  const push3 = push3f(t);
  if (t < 3.65) { const k = P(t, 3.15, 3.65, 'power3.inOut'); return [L(540, LOGO3.ringX, k), L(900, LOGO3.ringY, k), L(760, LOGO3.ringD, k)]; }
  if (t < 5.8) { const x = 540 + (LOGO3.ringX - 540) * push3, y = 960 + (LOGO3.ringY - 960) * push3; return [x, y, LOGO3.ringD * push3 * portalZ(t)]; }
  if (t < 6.2) return null;
  if (t < 8.05) { const [x, y, s] = cv2s(HUB_RING.x, HUB_RING.y, t); return y < 2200 ? [x, y, HUB_RING.d * s] : null; }
  if (t < 10.25) { const [, hy] = cv2s(HUB_RING.x, HUB_RING.y, 8.05), k = P(t, 8.1, 8.5, 'power3.inOut'); const ex = P(t, 9.9, 10.22, 'power3.in'), S = L(1, 1.04, P(t, 9.0, 10.0, 'sine.inOut')) * L(1, 0.86, ex);
    return [540, L(hy, 960, k), L(HUB_RING.d, 300, k) * S, 1 - P(t, 9.95, 10.2, 'none')]; }
  if (t < 18.1) return null;
  if (t < 20.6) return [540, 880, L(0, 290, P(t, 18.1, 18.6, 'expo.out')) * push10(t)];
  if (t < 23.5) { const k = P(t, 20.6, 21.25, 'power3.inOut'); return [540, L(880, 1540, k) + 10 * Math.sin((t - 21.25) * 2.2) * P(t, 21.25, 21.6), L(290 * 1.06, 420, k)]; }
  if (t < 23.95) { const k = P(t, 23.5, 23.95, 'power3.inOut'), bob = 10 * Math.sin((23.5 - 21.25) * 2.2); return [L(540, LOGO12.ringX, k), L(1540 + bob, LOGO12.ringY, k), L(420, LOGO12.ringD, k)]; }
  const S = endPush(t); return [540 + (LOGO12.ringX - 540) * S, 960 + (LOGO12.ringY - 960) * S, LOGO12.ringD * S];
}
function push3f(t) { return 1 + 0.08 * P(t, 3.55, 5.25, 'power1.inOut'); }
function portalZ(t) { return Math.exp(Math.log(34) * P(t, 5.2, 5.78, 'power3.in')); }
function sceneLogo(t) {
  const push = push3f(t), Z = portalZ(t);
  const cx = 540 + (LOGO3.ringX - 540) * push, cy = 960 + (LOGO3.ringY - 960) * push, S = push * Z;
  const Tx = cx + Z * (540 * (1 - push) - cx), Ty = cy + Z * (960 * (1 - push) - cy);
  $('#s3').style.transform = `translate3d(${Tx}px,${Ty}px,0) scale(${S})`;
  LOGO3.letters.forEach((el, i) => { const k = P(t, 3.42 + i * 0.05, 3.9 + i * 0.05, 'expo.out'); tf(el, (i === 0 ? -1 : 1) * 160 * (1 - k), 0, 1, 0, clamp(k * 1.6)); });
  ['#s3a', '#s3b', '#s3c'].forEach((s, i) => { const sg = i % 2 ? -1 : 1, k = P(t, 3.62 + i * 0.12, 4.17 + i * 0.12, 'expo.out'), o = P(t, 4.95 + i * 0.04, 5.2 + i * 0.04, 'power2.in'); lineIn($(s), k, sg, o); });
  $('#s3tag').style.transform = `translate3d(0,${-24 * P(t, 4.0, 5.2, 'sine.inOut')}px,0)`;
  disc.style.opacity = 1 - P(t, 5.22, 5.42, 'none');
}

// ---------- pulse ----------
const pulse = $('#pulse');
function pulseState(t) {
  if (t >= 6.05 && t < 7.4) { const k = P(t, 6.05, 7.4, 'power1.inOut'), p = docPath.getPointAtLength(docPath._len * k); const [x, y] = cv2s(p.x, p.y, t); return [x, y, 1]; }
  if (t >= 7.4 && t < 7.78) { const k = P(t, 7.4, 7.78, 'power2.in'); const p = k < 0.15 ? { x: 540, y: L(1810, 2010, k / 0.15) } : hubToTick.getPointAtLength(hubToTick._len * (k - 0.15) / 0.85); const [x, y] = cv2s(p.x, p.y, t); return [x, y, 1]; }
  if (t >= 9.12 && t < 9.52) { const k = P(t, 9.12, 9.52, 'power2.in'), p = agentPath.getPointAtLength(agentPath._len * k); return [p.x, p.y, 1]; }
  if (t >= 18.5 && t < 18.88) { const k = P(t, 18.5, 18.88, 'power2.in'); return [L(290, 520, k), 880, 1]; }
  if (t >= 18.92 && t < 19.22) { const k = P(t, 18.92, 19.22, 'power2.in'); return [L(560, 790, k), 880, 1]; }
  return null;
}

// ---------- frame ----------
const SCN = [['#s1', 0, 2.25], ['#s2', 2.0, 3.6], ['#s3', 3.4, 5.8], ['#s45', 5.2, 8.8], ['#s6', 8.28, 10.55], ['#s7', 10.2, 13.56], ['#s8', 13.45, 16.0], ['#purple', 15.5, 18.4], ['#s9', 15.95, 17.8], ['#s10', 17.95, 21.0], ['#s11', 20.9, 24.0], ['#s12', 23.6, 27.1]];
function frame(t) {
  t = clamp(t, 0, D);
  for (const [s, a, b] of SCN) vis($(s), t >= a && t < b);
  $('#bg .g1').style.transform = `translate3d(${60 * Math.sin(t * 0.35)}px,${-40 * Math.sin(t * 0.22)}px,0)`;
  $('#bg .g2').style.transform = `translate3d(${-50 * Math.sin(t * 0.27)}px,${50 * Math.sin(t * 0.31)}px,0)`;
  $('#bg .dots').style.transform = `translate3d(0,${(-t * 8) % 36}px,0)`;
  if (t < 2.25) sceneWall(t);
  if (t >= 2.0 && t < 3.6) { const a = P(t, 2.0, 2.55, 'expo.out'), b = P(t, 2.1, 2.65, 'expo.out'), o = P(t, 3.12, 3.45, 'power3.in'), dr = P(t, 2.6, 3.2, 'sine.inOut');
    lineIn($('#s2a'), a, 1, o); lineIn($('#s2b'), b, -1, o); $('#s2h').style.transform = `scale(${1 + 0.04 * dr})`; }
  if (t >= 3.4 && t < 5.8) sceneLogo(t);
  if (t >= 5.2 && t < 8.8) sceneCanvas(t);
  if (t >= 8.28 && t < 10.55) sceneOutputs(t);
  // fly-through "Build once."
  const fl = $('#fly'); vis(fl, t >= 10.18 && t < 10.68);
  if (t >= 10.18 && t < 10.68) { const k = P(t, 10.18, 10.68, 'expo.out'), w = fl.offsetWidth, h = fl.offsetHeight, s = L(0.3, 1, k);
    const cx = L(540, 90 + w / 2, k), cy = L(960, 210 + h / 2, k); fl.style.transform = `translate3d(${cx - 90 - w * s / 2}px,${cy - 210 - h * s / 2}px,0) scale(${s})`; fl.style.opacity = clamp(k * 4); }
  if (t >= 10.2 && t < 13.56) scene3D(t);
  if (t >= 13.45 && t < 16.0) scenePath(t);
  if (t >= 15.5 && t < 18.4) scenePurple(t);
  if (t >= 17.95 && t < 21.0) sceneControl(t);
  if (t >= 20.9 && t < 24.0) scenePilot(t);
  if (t >= 23.6) sceneEnd(t);
  const r = ringState(t); vis(ring, !!r);
  if (r) { const [x, y, d, o = 1] = r; ring.style.transform = `translate3d(${(x - 50).toFixed(2)}px,${(y - 50).toFixed(2)}px,0) scale(${(d / 100).toFixed(5)})`; ring.style.opacity = o; ring.style.setProperty('--spin', `${(t * 38) % 360}deg`);
    const flash = Math.max(0, Math.sin(Math.PI * clamp((t - 7.4) / 0.4))) + Math.max(0, Math.sin(Math.PI * clamp((t - 18.85) / 0.4)));
    ring.style.setProperty('--glow', (0.55 + 0.45 * flash).toFixed(3)); }
  const p = pulseState(t); vis(pulse, !!p); if (p) pulse.style.transform = `translate3d(${p[0].toFixed(2)}px,${p[1].toFixed(2)}px,0)`;
}

// ---------- timeline ----------
const st = { t: 0 };
const tl = gsap.timeline({ paused: true });
tl.to(st, { t: D, duration: D, ease: 'none', onUpdate: () => frame(st.t) }, 0);
window.__timelines = window.__timelines || {}; window.__timelines.root = tl;
window.__frame = frame;
document.fonts.ready.then(() => frame(tl.time()));
frame(0);
window.addEventListener('hf-seek', e => frame(e.detail.time));
