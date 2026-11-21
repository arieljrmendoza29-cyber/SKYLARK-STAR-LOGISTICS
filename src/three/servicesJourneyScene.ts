/**
 * "Camera along a path" scene for the Core Services sections.
 * Adapted from BrewedOps Motion Library (three-scroll-card-path):
 * the camera glides along a curved route past floating photo cards,
 * one focus card per service, as the visitor scrolls.
 *
 * Loaded on demand (dynamic import) so three.js never slows the first page load.
 */
import * as THREE from 'three';

export interface JourneyCard {
  image: string;
  number?: string;
  title?: string;
}

export interface JourneyOptions {
  /** One per service, in order. These grow when their service is in focus. */
  focusCards: JourneyCard[];
  /** Decorative photo cards placed between the focus cards. */
  extraCards: JourneyCard[];
  /** Scroll progress of the section, 0 at the start, 1 at the end. */
  getTarget: () => number;
  /** Called every frame with the smoothed progress and the fractional service index. */
  onFrame: (progress: number, index: number) => void;
}

const CREAM = 0xfff5eb;
const ORANGE = 0xff6500;
const CARD_W = 640;
const CARD_H = 448; // 1.5 : 1.05, the plane's aspect ratio
/** Share of each step (at both ends) where the camera holds still on a service card. */
const DWELL = 0.2;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Draws an image so it covers the box, cropping the overflow (like object-fit: cover). */
function drawCover(g: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  g.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
}

function drawCard(g: CanvasRenderingContext2D, card: JourneyCard, img: HTMLImageElement | null) {
  g.clearRect(0, 0, CARD_W, CARD_H);

  // White card with a warm hairline border
  roundRect(g, 6, 6, CARD_W - 12, CARD_H - 12, 36);
  g.fillStyle = '#FFFFFF';
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = '#EAD8C8';
  g.stroke();

  const hasLabel = Boolean(card.title);
  const pad = 18;
  const photoH = hasLabel ? CARD_H - 120 : CARD_H - pad * 2 - 12;

  g.save();
  roundRect(g, 6 + pad, 6 + pad, CARD_W - 12 - pad * 2, photoH, 24);
  g.clip();
  g.fillStyle = '#171717';
  g.fill();
  if (img) drawCover(g, img, 6 + pad, 6 + pad, CARD_W - 12 - pad * 2, photoH);
  g.restore();

  if (hasLabel) {
    const baseY = 6 + pad + photoH + 62;
    g.textBaseline = 'alphabetic';
    g.textAlign = 'left';
    g.fillStyle = '#FF6500';
    g.font = '600 26px "JetBrains Mono", ui-monospace, monospace';
    g.fillText(card.number ?? '', 6 + pad + 8, baseY);
    g.fillStyle = '#171717';
    g.font = '800 34px Poppins, system-ui, sans-serif';
    g.fillText(card.title ?? '', 6 + pad + 72, baseY);
  }
}

export function createServicesJourney(host: HTMLElement, options: JourneyOptions): () => void {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1.5 : 2));
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(CREAM, 5, 20);
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 140);
  const disposables: { dispose: () => void }[] = [];
  let alive = true;

  // The route the camera travels along
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-2.6, 0, 6),
      new THREE.Vector3(-1.2, 0.5, 2),
      new THREE.Vector3(0.8, 0.1, -2),
      new THREE.Vector3(2.2, -0.4, -6),
      new THREE.Vector3(1, -0.1, -10),
      new THREE.Vector3(-1.4, 0.4, -14),
      new THREE.Vector3(-2.2, 0, -18),
      new THREE.Vector3(0, -0.3, -22),
      new THREE.Vector3(2.4, 0.2, -26),
      new THREE.Vector3(2.2, 0, -30),
    ],
    false,
    'centripetal',
  );

  // Dotted orange route line
  const route = curve.getSpacedPoints(180);
  const routePositions = new Float32Array(route.length * 3);
  route.forEach((q, i) => {
    routePositions[i * 3] = q.x;
    routePositions[i * 3 + 1] = q.y - 0.25;
    routePositions[i * 3 + 2] = q.z;
  });
  const routeGeometry = new THREE.BufferGeometry();
  routeGeometry.setAttribute('position', new THREE.BufferAttribute(routePositions, 3));
  const dotCanvas = document.createElement('canvas');
  dotCanvas.width = dotCanvas.height = 64;
  const dg = dotCanvas.getContext('2d')!;
  dg.fillStyle = '#fff';
  dg.beginPath();
  dg.arc(32, 32, 28, 0, Math.PI * 2);
  dg.fill();
  const dotTexture = new THREE.CanvasTexture(dotCanvas);
  disposables.push(dotTexture, routeGeometry);
  scene.add(
    new THREE.Points(
      routeGeometry,
      new THREE.PointsMaterial({ color: ORANGE, size: 0.07, map: dotTexture, alphaTest: 0.4 }),
    ),
  );

  // Soft warm shadow behind each card
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 128;
  const sg = shadowCanvas.getContext('2d')!;
  const grad = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(120,60,20,0.35)');
  grad.addColorStop(1, 'rgba(120,60,20,0)');
  sg.fillStyle = grad;
  sg.fillRect(0, 0, 128, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  disposables.push(shadowTexture);

  const cardGeometry = new THREE.PlaneGeometry(1.5, 1.05);
  const shadowGeometry = new THREE.PlaneGeometry(2.7, 2.1);
  disposables.push(cardGeometry, shadowGeometry);

  const makeCardTexture = (card: JourneyCard) => {
    const canvas = document.createElement('canvas');
    canvas.width = CARD_W;
    canvas.height = CARD_H;
    const g = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    disposables.push(texture);

    let img: HTMLImageElement | null = null;
    const redraw = () => {
      if (!alive) return;
      drawCard(g, card, img);
      texture.needsUpdate = true;
    };
    redraw();
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      img = image;
      redraw();
    };
    image.src = card.image;
    document.fonts?.ready.then(redraw, () => {});
    return texture;
  };

  // Card placement. Each service card is positioned relative to where the camera will be
  // when that service is in focus, so it always lands in the same clear spot on screen:
  // right of centre on wide screens, above the text panel on phones.
  const n = options.focusCards.length;
  const P = new THREE.Vector3();
  const L = new THREE.Vector3();
  const pose = new THREE.PerspectiveCamera();
  const poseAt = (progress: number) => {
    const uc = 0.02 + clamp01(progress) * 0.84;
    curve.getPointAt(uc, P);
    curve.getPointAt(Math.min(1, uc + 0.05), L);
    pose.position.set(P.x, P.y + 0.1, P.z);
    pose.lookAt(L.x, L.y + 0.05, L.z);
    pose.updateMatrixWorld();
  };

  const defs = [
    ...options.focusCards.map((card, k) => ({ card, at: n > 1 ? k / (n - 1) : 0, focus: k })),
    ...options.extraCards.slice(0, Math.max(0, n - 1)).map((card, k) => ({
      card,
      at: (k + 0.5) / (n - 1),
      focus: -1,
    })),
  ];

  const cards = defs.map((d, i) => {
    const material = new THREE.MeshBasicMaterial({ map: makeCardTexture(d.card), transparent: true, toneMapped: false });
    disposables.push(material);
    const mesh = new THREE.Mesh(cardGeometry, material);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
    disposables.push(shadowMaterial);
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.position.set(0.05, -0.12, -0.04);
    mesh.add(shadow);
    scene.add(mesh);
    return { mesh, baseY: 0, focus: d.focus, at: d.at, i };
  });

  let layoutPortrait: boolean | null = null;
  const placeCards = (portrait: boolean) => {
    if (layoutPortrait === portrait) return;
    layoutPortrait = portrait;
    const local = new THREE.Vector3();
    for (const c of cards) {
      poseAt(c.at);
      if (c.focus >= 0) {
        // [right, up, distance ahead] in the camera's view
        if (portrait) local.set(0, 0.9, -3.8);
        else local.set(0.66, 0.12, -3.2);
      } else {
        local.set(portrait ? -1.1 : -1.7, portrait ? 1.3 : 0.55, -4.6);
      }
      pose.localToWorld(local);
      c.mesh.position.copy(local);
      c.mesh.quaternion.copy(pose.quaternion); // face the camera
      c.baseY = local.y;
    }
  };

  const resize = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const portrait = camera.aspect < 0.8;
    // Narrow (portrait) screens: widen the view so the cards still fit.
    camera.fov = portrait ? 62 : 44;
    camera.updateProjectionMatrix();
    placeCards(portrait);
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  // Only render while the section is on screen.
  let onScreen = false;
  let rafId = 0;
  let progress = options.getTarget();
  let last = performance.now();

  const frame = (t: number) => {
    rafId = onScreen ? requestAnimationFrame(frame) : 0;
    const dt = Math.min(0.1, Math.max(0, (t - last) / 1000));
    last = t;
    progress += (options.getTarget() - progress) * (1 - Math.exp(-dt * 5.5));

    // Pause at each service: the camera holds on a card for part of the scroll,
    // then glides to the next one.
    let index = 0;
    if (n > 1) {
      const raw = progress * (n - 1);
      const seg = Math.min(n - 2, Math.floor(raw));
      index = seg + smooth(DWELL, 1 - DWELL, raw - seg);
    }
    const cameraProgress = n > 1 ? index / (n - 1) : 0;

    poseAt(cameraProgress);
    camera.position.copy(pose.position);
    camera.quaternion.copy(pose.quaternion);

    const s = t / 1000;
    for (const c of cards) {
      const f = c.focus >= 0 ? 1 - smooth(0.1, 0.7, Math.abs(index - c.focus)) : 0;
      c.mesh.scale.setScalar(1 + 0.2 * f);
      c.mesh.position.y = c.baseY + Math.sin(s * 1.2 + c.i) * 0.05;
    }

    options.onFrame(progress, index);
    renderer.render(scene, camera);
  };

  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen && !rafId) {
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  });
  visibility.observe(host);

  // Draw one frame straight away so the scene is never blank.
  renderer.compileAsync(scene, camera).then(() => {
    if (alive) frame(performance.now());
  });

  return () => {
    alive = false;
    cancelAnimationFrame(rafId);
    visibility.disconnect();
    resizeObserver.disconnect();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mats = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
      mats.forEach((m) => m.dispose());
    });
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}
