// Tip 3 (7.5–10.0): HARD SHOT? USE BLENDER. — a grey-box street (three.js) whose block car turns into the real city-car photo.
import * as THREE from '../../vendor/three.module.js';
import { E, el, place, img, tag, svg, path, tipHeadline, rng } from '../core.js';

export const meta = { box: { lines: ['BLOCK IT FIRST.'] } };

// full-bleed band that holds the 3D render (the film's wide shot)
const F = { x: 0, y: 700, w: 1080, h: 860 };
const CW = F.w, CH = F.h; // 1080 × 860
const KEY_X = 940; // labels stay left of the Reels rail

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const io2 = x => { x = clamp(x); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
const io3 = x => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const out3 = x => 1 - Math.pow(1 - clamp(x), 3);
const D2R = Math.PI / 180;

// timing (absolute seconds)
const T_PATH0 = 7.62, T_PATH1 = 8.05;     // orange path draws on
const T_CAR0 = 7.9, T_CAR1 = 8.85;        // car drives the path
const T_CAM0 = 7.7, T_CAM1 = 8.9;         // render camera: wide → matched to the photo
const T_WIPE = 8.9, T_WIPE_D = 0.2;       // matched wipe to the photo

// render camera poses: target, distance, azimuth (deg, from +Z toward +X), pitch (deg). Pitch stays within 35–55.
const POSE0 = { T: [2.6, 0, -3], d: 30, az: 24, pitch: 52 };
const POSE1 = { T: [2.342, 1.139, -7.266], d: 9.6, az: 38, pitch: 35 };

function buildWorld() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#E4DFD6');
  const mat = (c, r = 0.82) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0 });
  const M = {
    bld: mat('#DEDBD5'), bld2: mat('#D3D0CA'), road: mat('#B4B1AC', 0.9), walk: mat('#D8D5CF'), plinth: mat('#C9C5BE'), edge: mat('#9C978F'),
    line: mat('#F1EFEA'), car: mat('#EEEDEA', 0.6), glass: mat('#7C8085', 0.4), tyre: mat('#3E3E3E', 0.9), lamp: mat('#C4472B', 0.5),
    cam: mat('#5A5C5F', 0.6), lens: mat('#2A2B2D', 0.4), leg: mat('#6B6D70', 0.7),
  };
  const box = (w, h, d, m, x, y, z, parent = scene, shadow = true) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z);
    b.castShadow = shadow; b.receiveShadow = true; parent.add(b); return b;
  };
  // base: plinth with a darker skirt, the street surfaces sit flush on its top (y=0)
  box(25, 0.5, 46, M.plinth, 0, -0.25, -12.5, scene, false);
  box(25.3, 0.35, 46.3, M.edge, 0, -0.68, -12.5, scene, false);
  box(6, 0.04, 46, M.road, 0, 0.02, -12.5, scene, false);                 // main road x −3..3
  box(9.5, 0.04, 4, M.road, 7.75, 0.02, 2.5, scene, false);               // cross street to the right, z 0.5..4.5
  box(1.8, 0.16, 46, M.walk, -3.9, 0.08, -12.5);                          // left sidewalk
  box(1.8, 0.16, 25.5, M.walk, 3.9, 0.08, -22.75);                        // right sidewalk, far part (z −35.5..0.5)
  box(1.8, 0.16, 5, M.walk, 3.9, 0.08, 7.0);                              // right sidewalk, near part (z 4.5..9.5)
  box(7.7, 0.16, 1.4, M.walk, 8.65, 0.08, -0.2);                          // cross-street sidewalks
  box(7.7, 0.16, 1.4, M.walk, 8.65, 0.08, 5.2);
  for (let z = 8; z > -35; z -= 2.4) if (z > 5 || z < 0) box(0.14, 0.012, 1.2, M.line, 0, 0.046, z, scene, false);
  // buildings: blocks that share walls, flush on the plinth, some with a stepped top
  const R = rng(303);
  const row = (x0, x1, z0, z1, hMin, hMax) => {
    let z = z0;
    while (z > z1 + 0.01) {
      const d = Math.min(z - z1, 2.6 + R() * 3.2), h = hMin + R() * (hMax - hMin), w = x1 - x0;
      const m = R() < 0.5 ? M.bld : M.bld2;
      box(w, h, d, m, (x0 + x1) / 2, h / 2, z - d / 2);
      if (R() < 0.45) { const h2 = 0.6 + R() * 1.4; box(w * 0.6, h2, d * 0.6, m, (x0 + x1) / 2 + (x0 < 0 ? -w * 0.15 : w * 0.15), h + h2 / 2, z - d / 2); }
      z -= d;
    }
  };
  row(-12.5, -4.8, 10, -35.5, 2.0, 4.6);
  row(4.8, 12.5, 10, 5.9, 1.4, 2.6);
  row(4.8, 12.5, -0.9, -35.5, 1.6, 3.8);

  // block car (length along local +Z = forward)
  const car = new THREE.Group(); scene.add(car);
  box(1.9, 0.62, 4.3, M.car, 0, 0.55, 0, car);
  box(1.6, 0.5, 2.1, M.glass, 0, 1.11, -0.25, car);
  box(1.62, 0.08, 2.0, M.car, 0, 1.4, -0.25, car);
  [[-0.98, 1.35], [0.98, 1.35], [-0.98, -1.35], [0.98, -1.35]].forEach(([x, z]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.3, 20), M.tyre); w.rotation.z = Math.PI / 2; w.position.set(x, 0.36, z); w.castShadow = true; car.add(w);
  });
  [-0.62, 0.62].forEach(x => box(0.5, 0.12, 0.04, M.lamp, x, 0.72, -2.16, car, false)); // tail lights (rear = −Z)

  // block camera on a tripod (left sidewalk)
  const rig = new THREE.Group(); rig.position.set(-3.9, 0.16, -8.5); scene.add(rig);
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI * 2 / 3 + 0.3, leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.62, 8), M.leg);
    leg.position.set(Math.cos(a) * 0.3, 0.78, Math.sin(a) * 0.3); leg.rotation.set(Math.sin(a) * -0.2, 0, Math.cos(a) * 0.2); leg.castShadow = true; rig.add(leg);
  }
  box(0.22, 0.2, 0.22, M.leg, 0, 1.6, 0, rig);
  const head = new THREE.Group(); head.position.set(0, 1.7, 0); rig.add(head);
  box(0.62, 0.5, 0.95, M.cam, 0, 0.25, 0, head);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.42, 20), M.lens); lens.rotation.x = Math.PI / 2; lens.position.set(0, 0.25, 0.68); lens.castShadow = true; head.add(lens);
  box(0.4, 0.14, 0.4, M.cam, 0, 0.57, -0.1, head);

  // orange path: in from the cross street, arc onto the main road, straight down it
  const Y = 0.1;
  const cp = new THREE.CurvePath();
  cp.add(new THREE.LineCurve3(new THREE.Vector3(8.6, Y, 2.5), new THREE.Vector3(4.2, Y, 2.5)));
  const arcPts = []; for (let i = 0; i <= 24; i++) { const a = Math.PI / 2 + (i / 24) * Math.PI / 2; arcPts.push(new THREE.Vector3(4.2 + 3 * Math.cos(a), Y, -0.5 + 3 * Math.sin(a))); }
  cp.add(new THREE.CatmullRomCurve3(arcPts));
  cp.add(new THREE.LineCurve3(new THREE.Vector3(1.2, Y, -0.5), new THREE.Vector3(1.2, Y, -11)));
  const tubeGeo = new THREE.TubeGeometry(cp, 240, 0.11, 10, false);
  const orange = new THREE.MeshStandardMaterial({ color: '#EC6327', roughness: 0.55, emissive: '#EC6327', emissiveIntensity: 0.25 });
  const tube = new THREE.Mesh(tubeGeo, orange); tube.receiveShadow = true; scene.add(tube);
  const tubeCount = tubeGeo.index.count;
  const headCone = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.7, 20), orange); headCone.rotation.x = -Math.PI / 2; headCone.position.set(1.2, Y, -11.3); scene.add(headCone);

  // light like a product shoot
  scene.add(new THREE.HemisphereLight('#FFFFFF', '#B9B1A3', 1.35));
  const key = new THREE.DirectionalLight('#FFF3E2', 3.0); key.position.set(-10, 24, 6); key.target.position.set(0, 0, -8);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 9; key.shadow.blurSamples = 16; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  Object.assign(key.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 70 });
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight('#E9EEF5', 1.3); rim.position.set(4, 10, -40); rim.target.position.set(0, 0, -6); scene.add(rim, rim.target);

  // path parameter where the car stops (its centre at z = −8, the matched pose)
  let uEnd = 1; for (let i = 0; i <= 2000; i++) { const q = cp.getPointAt(i / 2000); if (q.x < 1.21 && q.z <= -8) { uEnd = i / 2000; break; } }
  return { scene, car, head, rig, cp, tubeGeo, tubeCount, headCone, uEnd };
}

export function build(ctx) {
  const { tl, layer, onFrame } = ctx;
  tipHeadline(ctx, ['HARD SHOT?', 'USE BLENDER.']);

  // full-bleed band (edge to edge), soft shadow like the paper pieces
  const pol = el('div', 'abs', { zIndex: 2, overflow: 'hidden', background: '#E4DFD6', boxShadow: '0 18px 36px -12px rgba(40,25,10,.35), 0 -10px 28px -14px rgba(40,25,10,.25)' }, layer); place(pol, F);
  const ph = pol;

  // three.js
  const W3 = buildWorld();
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(CW, CH, false);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; // r186: PCFSoftShadowMap was folded into PCF (soft via shadow.radius)
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
  ph.appendChild(renderer.domElement);
  Object.assign(renderer.domElement.style, { position: 'absolute', left: 0, top: 0, width: CW + 'px', height: CH + 'px', display: 'block' });
  const cam = new THREE.PerspectiveCamera(34, CW / CH, 0.1, 200);

  // real photo, cropped so its baked-in border never shows; the car sits where the block car ends
  const photoBox = el('div', 'abs', { inset: 0, overflow: 'hidden', clipPath: 'polygon(0 0,0 0,0 0,0 0)' }, ph);
  const S = 1.58, OX = -39.9, OY = -15.8, CX = 400, CY = 530; // display scale/offset; car centre in band px
  const pimg = img('city-car', photoBox, { position: 'absolute', left: OX + 'px', top: OY + 'px', width: 734 * S + 'px', height: 580 * S + 'px', objectFit: 'fill', display: 'block', transformOrigin: `${CX - OX}px ${CY - OY}px` });
  const wipeBar = el('div', 'abs', { inset: 0, background: 'var(--orange)', clipPath: 'polygon(0 0,0 0,0 0,0 0)' }, ph);

  // labels pinned from 3D (live inside the polaroid so they follow its transforms)
  const ov = el('div', 'abs', { left: 0, top: 0, width: CW + 'px', height: CH + 'px', zIndex: 4, pointerEvents: 'none' }, pol);
  const lines = svg(ov, { x: 0, y: 0, w: CW, h: CH });
  const mk = (text, rot) => {
    const t = tag(ov, text, { x: 0, y: 0, size: 40, rot }); t.style.transformOrigin = '50% 50%';
    const ln = path(lines, 'M0 0', { stroke: '#111', width: 3 });
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dot.setAttribute('r', 8); dot.setAttribute('fill', 'var(--orange)'); dot.setAttribute('stroke', '#111'); dot.setAttribute('stroke-width', 3); lines.appendChild(dot);
    return { t, ln, dot };
  };
  const L = { cam: mk('CAMERA', -4), path: mk('PATH', 3) };
  const LAB = [
    { l: L.cam, at: 8.0, off: [40, -130], anchor: () => W3.head.localToWorld(new THREE.Vector3(0, 0.62, 0)) },
    { l: L.path, at: 8.25, off: [70, -40], anchor: () => pathPt },
  ];
  const LAB_OUT = 8.6;
  const pathPt = new THREE.Vector3(1.2, 0.1, -10.8);

  const v = new THREE.Vector3(), tgt = new THREE.Vector3();
  const setCam = t => {
    const k = io3((t - T_CAM0) / (T_CAM1 - T_CAM0));
    const T = POSE0.T.map((a, i) => lerp(a, POSE1.T[i], k));
    // keep a slow push alive after the match (the photo pushes the same way)
    const d = lerp(POSE0.d, POSE1.d, k) - Math.max(0, t - T_CAM1) * 0.3;
    const az = lerp(POSE0.az, POSE1.az, k) * D2R, p = lerp(POSE0.pitch, POSE1.pitch, k) * D2R;
    tgt.set(T[0], T[1], T[2]);
    cam.position.set(tgt.x + d * Math.cos(p) * Math.sin(az), tgt.y + d * Math.sin(p), tgt.z + d * Math.cos(p) * Math.cos(az));
    cam.lookAt(tgt); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  };
  const project = p => { v.copy(p).project(cam); return [(v.x + 1) / 2 * CW, (1 - v.y) / 2 * CH, v.z]; };

  onFrame(t => {
    if (t < 7.0 || t > 10.45) return;           // only while the layer can be seen
    // path draw-on
    const pk = out3((t - T_PATH0) / (T_PATH1 - T_PATH0));
    W3.tubeGeo.setDrawRange(0, Math.floor(pk * W3.tubeCount / 3) * 3);
    const cone = clamp((t - T_PATH1 + 0.05) / 0.15);
    W3.headCone.scale.setScalar(Math.max(0.001, cone < 1 ? cone * 1.25 : 1));
    // car along the path (ends straight down the road, rear to camera)
    const u = io3((t - T_CAR0) / (T_CAR1 - T_CAR0)) * W3.uEnd + Math.max(0, Math.min(t, 9.2) - T_CAR1) * 0.003;
    const pos = W3.cp.getPointAt(Math.min(1, u)), tan = W3.cp.getTangentAt(Math.min(1, u));
    W3.car.position.set(pos.x, 0, pos.z);
    W3.car.rotation.y = Math.atan2(tan.x, tan.z);
    // the block camera turns to track the car
    const c = W3.rig.position;
    W3.head.rotation.y = Math.atan2(W3.car.position.x - c.x, W3.car.position.z - c.z);
    W3.head.rotation.x = -0.12;
    setCam(t);
    renderer.render(W3.scene, cam);

    // labels from projected points
    LAB.forEach(({ l, at, off, anchor }) => {
      const on = out3((t - at) / 0.3) * (1 - clamp((t - LAB_OUT) / 0.12));
      const [ax, ay] = project(anchor());
      const tw = l.t.offsetWidth || 220;
      const tx = clamp(ax + off[0], 64, KEY_X - tw), ty = clamp(ay + off[1], 16, CH - 90);
      l.t.style.left = tx + 'px'; l.t.style.top = ty + 'px';
      l.t.style.opacity = on; l.t.style.transform = `rotate(${l === L.cam ? -4 : 3}deg) scale(${lerp(1.4, 1, on)})`;
      const ex = tx + 50, ey = off[1] < 0 ? ty + 64 : ty;
      l.ln.setAttribute('d', `M${ax} ${ay} L${lerp(ax, ex, on)} ${lerp(ay, ey, on)}`); l.ln.style.opacity = on;
      l.dot.setAttribute('cx', ax); l.dot.setAttribute('cy', ay); l.dot.style.opacity = on;
    });

    // matched hard-edged diagonal wipe, left → right, with an orange leading edge
    const wk = io2((t - T_WIPE) / T_WIPE_D), sk = 260; // slant in px
    const x = lerp(-sk - 30, CW + 30, wk);
    photoBox.style.clipPath = `polygon(-1px -1px, ${x + sk}px -1px, ${x}px ${CH + 1}px, -1px ${CH + 1}px)`;
    const bw = wk > 0 && wk < 1 ? 16 : 0;
    wipeBar.style.clipPath = `polygon(${x + sk}px -1px, ${x + sk + bw}px -1px, ${x + bw}px ${CH + 1}px, ${x}px ${CH + 1}px)`;
    renderer.domElement.style.visibility = wk >= 1 ? 'hidden' : 'visible';
  });

  // photo pushes in slowly after the wipe
  tl.fromTo(pimg, { scale: 1 }, { scale: 1.07, duration: 0.75, ease: E.soft, immediateRender: false }, 8.9);

  // the band slides in from the right (a pan), then leaves to the left fast — never through text
  tl.fromTo(pol, { x: 1120 }, { x: 0, duration: 0.6, ease: E.land, immediateRender: true }, 7.35);
  tl.to(pol, { x: -1160, duration: 0.4, ease: E.fast }, 9.62);
}
