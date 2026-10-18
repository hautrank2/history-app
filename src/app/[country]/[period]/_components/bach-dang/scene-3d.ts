import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const mapAnchors = [
  { id: "van-kiep", name: "Vạn Kiếp", position: [-4, .8, -7] },
  { id: "van-don", name: "Vân Đồn", position: [8, .8, -4] },
  { id: "trang-kenh", name: "Tràng Kênh", position: [-5, 1, 1] },
  { id: "yen-giang", name: "Yên Giang", position: [5, .8, 5] },
  { id: "bach-dang", name: "Bạch Đằng", position: [1, .6, 3] },
  { id: "tran-hung-dao", name: "Trần Hưng Đạo", position: [-5, 3.5, 4] },
  { id: "o-ma-nhi", name: "Ô Mã Nhi", position: [0, 3.5, -2] },
  { id: "thoat-hoan", name: "Thoát Hoan", position: [-4, 3.5, -7] },
] as const;

const material = (color: string, metalness = 0, roughness = .8) => new THREE.MeshStandardMaterial({ color, metalness, roughness });

const ship = (color: string) => {
  const group = new THREE.Group();
  const timber = material("#59402c");
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-.3, -.9); hullShape.lineTo(.3, -.9); hullShape.lineTo(.48, .35); hullShape.lineTo(0, 1); hullShape.lineTo(-.48, .35); hullShape.closePath();
  const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(hullShape, { depth: .28, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .1, bevelThickness: .1 }), timber);
  hull.rotation.x = -Math.PI / 2; hull.position.y = .18; group.add(hull);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(.55, .06, 1.3), material("#b78b54")); deck.position.y = .5; group.add(deck);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(.035, .045, 2, 6), timber); mast.position.y = 1.4; group.add(mast);
  const cloth = new THREE.PlaneGeometry(1.05, 1.3, 8, 8);
  const vertices = cloth.attributes.position;
  for (let i = 0; i < vertices.count; i++) vertices.setZ(i, Math.cos(vertices.getX(i) * 2.8) * .22);
  cloth.computeVertexNormals();
  const sail = new THREE.Mesh(cloth, new THREE.MeshStandardMaterial({ color, roughness: .95, side: THREE.DoubleSide })); sail.position.set(0, 1.55, .04); group.add(sail);
  for (let i = 0; i < 5; i++) {
    const spar = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, 1.06, 5), timber); spar.rotation.z = Math.PI / 2; spar.position.set(0, .96 + i * .3, .07); group.add(spar);
  }
  for (const side of [-1, 1]) for (let i = 0; i < 4; i++) {
    const oar = new THREE.Mesh(new THREE.BoxGeometry(.65, .035, .07), material("#c4a577")); oar.position.set(side * .6, .31, -.55 + i * .36); oar.rotation.y = side * .3; group.add(oar);
  }
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(.45, .25), new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide })); flag.position.set(.23, 2.35, 0); group.add(flag);
  group.traverse((item) => { if (item instanceof THREE.Mesh) { item.castShadow = true; item.receiveShadow = true; } });
  return group;
};

const soldier = (color: string) => {
  const group = new THREE.Group();
  const timber = material("#59402c");
  const armor = material(color, .35, .6);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.14, .2, .4, 6), armor); body.position.y = .4; group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 6), material("#ba9671")); head.position.y = .73; group.add(head);
  const helmet = new THREE.Mesh(new THREE.ConeGeometry(.16, .23, 8), material("#93866b", .7, .4)); helmet.position.y = .85; group.add(helmet);
  for (const x of [-.09, .09]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(.055, .07, .2, 5), timber); leg.position.set(x, .1, 0); group.add(leg); }
  const spear = new THREE.Mesh(new THREE.CylinderGeometry(.016, .02, 1.25, 4), timber); spear.position.set(.25, .65, 0); group.add(spear);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(.055, .17, 4), material("#c7c8ba", .8, .3)); tip.position.set(.25, 1.34, 0); group.add(tip);
  const shield = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .05, 8), armor); shield.rotation.x = Math.PI / 2; shield.position.set(-.17, .42, .13); group.add(shield);
  return group;
};

type CreateBattleSceneProps = { host: HTMLDivElement; pins: HTMLDivElement };

export const createBattleScene = ({ host, pins }: CreateBattleSceneProps) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor("#142827"); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute("aria-label", "Sa bàn Bạch Đằng 3D: địa hình, thuyền chiến, đội quân và bãi cọc");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2("#142827", .013);
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(18, 22, 25);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0); controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false;
  controls.minPolarAngle = .35; controls.maxPolarAngle = 1.25; controls.minDistance = 17; controls.maxDistance = 46;
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE };
  controls.update();
  scene.add(new THREE.HemisphereLight("#d7e8d7", "#29332a", 2.7));
  const sun = new THREE.DirectionalLight("#ffe0a0", 4); sun.position.set(-8, 19, 9); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -16; sun.shadow.camera.right = 16; sun.shadow.camera.top = 16; sun.shadow.camera.bottom = -16; sun.shadow.normalBias = .05; scene.add(sun);
  const fill = new THREE.DirectionalLight("#73c5c0", 1.3); fill.position.set(10, 8, -10); scene.add(fill);

  const base = new THREE.Mesh(new THREE.BoxGeometry(24.3, 1, 20.3), material("#2a3029", .2)); base.position.y = -.65; base.receiveShadow = true; scene.add(base);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(24.5, .08, 20.5), material("#9a8050", .6)); trim.position.y = -1.14; scene.add(trim);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(24, 20, 45, 45), new THREE.MeshStandardMaterial({ color: "#28665e", roughness: .25, metalness: .4 })); water.rotation.x = -Math.PI / 2; water.position.y = .03; water.receiveShadow = true; scene.add(water);
  const terrainCanvas = document.createElement("canvas"); terrainCanvas.width = 512; terrainCanvas.height = 512;
  const terrainContext = terrainCanvas.getContext("2d");
  if (terrainContext) {
    terrainContext.fillStyle = "#829479"; terrainContext.fillRect(0, 0, 512, 512);
    terrainContext.strokeStyle = "#d6d8ab26"; terrainContext.lineWidth = 1.2;
    for (let row = 0; row < 46; row++) {
      terrainContext.beginPath();
      for (let x = 0; x <= 512; x += 4) { const y = row * 14 + Math.sin(x * .015 + row * .2) * 22 + Math.sin(x * .032) * 7; if (x === 0) terrainContext.moveTo(x, y); else terrainContext.lineTo(x, y); }
      terrainContext.stroke();
    }
    for (let i = 0; i < 2200; i++) { terrainContext.fillStyle = i % 2 ? "#263d2733" : "#c3c99f22"; terrainContext.fillRect((i * 79.31) % 512, (i * 117.79) % 512, 2, 2); }
  }
  const terrainTexture = new THREE.CanvasTexture(terrainCanvas); terrainTexture.colorSpace = THREE.SRGBColorSpace; terrainTexture.wrapS = THREE.RepeatWrapping; terrainTexture.wrapT = THREE.RepeatWrapping; terrainTexture.repeat.set(.09, .09);
  const land = (points: number[][], color: string) => {
    const shape = new THREE.Shape(); points.forEach(([x, z], i) => { if (i === 0) shape.moveTo(x, -z); else shape.lineTo(x, -z); }); shape.closePath();
    const landMaterial = material(color); landMaterial.map = terrainTexture;
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: .35, bevelEnabled: true, bevelSegments: 2, bevelSize: .15, bevelThickness: .12, steps: 1 }), landMaterial); mesh.rotation.x = -Math.PI / 2; mesh.receiveShadow = true; scene.add(mesh);
  };
  land([[-12, -10], [-3, -10], [-4, -7], [-2, -4], [-1, 0], [1, 3], [0, 5], [3, 10], [-12, 10]], "#3d5943");
  land([[6, -10], [12, -10], [12, 10], [7, 10], [3, 5], [4, 2], [2, -1], [2, -4], [4, -7]], "#485f43");
  const rockMaterial = material("#6c745a");
  for (let i = 0; i < 22; i++) {
    const height = 1.1 + (Math.sin(i * 8.3) + 1) * 1.4;
    const rockGeometry = new THREE.CylinderGeometry(.35 + (i % 2) * .15, .75 + (i % 3) * .2, height, 6, 3);
    const rockVertices = rockGeometry.attributes.position;
    for (let vertex = 0; vertex < rockVertices.count; vertex++) { const y = rockVertices.getY(vertex); const x = rockVertices.getX(vertex); const z = rockVertices.getZ(vertex); const warp = 1 + Math.sin(y * 4 + i) * .15; rockVertices.setXYZ(vertex, x * warp + Math.sin(y + i) * .12, y, z * warp); }
    rockGeometry.computeVertexNormals();
    const mountain = new THREE.Mesh(rockGeometry, rockMaterial);
    mountain.position.set(-10 + (i % 4) * 1.8, height / 2 + .3, -7.5 + Math.floor(i / 4) * 2.8); mountain.rotation.y = i * .65; mountain.castShadow = true; mountain.receiveShadow = true; scene.add(mountain);
  }
  const foliage = material("#254834");
  for (let i = 0; i < 42; i++) {
    const x = i < 24 ? -11 + (i % 5) * 1.4 : 7 + (i % 4) * 1.2;
    const z = -8 + ((i * 3.71) % 16);
    const tree = new THREE.Mesh(new THREE.ConeGeometry(.24, .9 + (i % 3) * .2, 5), foliage); tree.position.set(x, .9, z); tree.castShadow = true; scene.add(tree);
  }
  const enemy = new THREE.Group(); const home = new THREE.Group(); const stakes = new THREE.Group(); const supply = new THREE.Group(); const routes = new THREE.Group();
  scene.add(enemy, home, stakes, supply, routes);
  const enemyShips = Array.from({ length: 5 }, () => { const model = ship("#a44435"); model.scale.setScalar(.82); enemy.add(model); return model; });
  const homeShips = Array.from({ length: 3 }, (_, i) => { const model = ship("#d5b773"); model.scale.setScalar(.67); model.position.set(i === 0 ? -.7 : 4.3, .12, i === 0 ? 1 : 5 + i); model.rotation.y = i === 0 ? Math.PI / 3 : Math.PI; home.add(model); return model; });
  const supplyShip = ship("#c5b391"); supplyShip.position.set(6, .12, -6); supplyShip.rotation.y = -.6; supply.add(supplyShip);
  const troops = new THREE.Group(); scene.add(troops);
  for (let i = 0; i < 16; i++) {
    const model = soldier("#b79a5d"); model.position.set(i < 8 ? -3.5 - (i % 4) * .5 : 5.5 + (i % 4) * .5, .5, 1 + Math.floor((i % 8) / 4) * .65 + (i >= 8 ? 3 : 0)); model.rotation.y = i < 8 ? Math.PI / 2 : -Math.PI / 2; troops.add(model);
  }
  for (let i = 0; i < 6; i++) { const model = soldier("#934b3d"); model.position.set(-4.7 + (i % 3) * .5, .5, -7.4 + Math.floor(i / 3) * .5); scene.add(model); }
  for (let i = 0; i < 24; i++) {
    const stake = new THREE.Mesh(new THREE.ConeGeometry(.065, 1.15, 5), material("#a58b5f")); stake.position.set(1 + (i % 6) * .4, .4, 3 + Math.floor(i / 6) * .5); stake.rotation.x = -.22; stake.rotation.z = .16; stake.castShadow = true; stakes.add(stake);
  }
  const routePoints = [new THREE.Vector3(-2.7, .2, -9), new THREE.Vector3(-1.6, .2, -5), new THREE.Vector3(.3, .2, -1), new THREE.Vector3(1.4, .2, 2), new THREE.Vector3(2.5, .2, 4.5)];
  const riverPath = new THREE.CatmullRomCurve3(routePoints);
  const route = new THREE.Line(new THREE.BufferGeometry().setFromPoints(riverPath.getPoints(80)), new THREE.LineDashedMaterial({ color: "#df8d6e", dashSize: .35, gapSize: .25, transparent: true, opacity: .65 })); route.computeLineDistances(); routes.add(route);
  const waveMaterial = new THREE.LineBasicMaterial({ color: "#91c4ac", transparent: true, opacity: .15 });
  for (let i = 0; i < 50; i++) {
    const t = i / 50; const center = riverPath.getPoint(t); const points = Array.from({ length: 8 }, (_, j) => new THREE.Vector3(center.x - .5 + j * .2, .08, center.z + Math.sin(j * .8 + i) * .06));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), waveMaterial));
  }
  for (const anchor of mapAnchors.slice(0, 5)) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.24, .025, 6, 24), material("#e0c58a", .6)); ring.rotation.x = Math.PI / 2; ring.position.set(anchor.position[0], .52, anchor.position[2]); scene.add(ring);
  }
  const pinElements = mapAnchors.map((anchor) => ({ element: pins.querySelector<HTMLElement>(`[data-anchor="${anchor.id}"]`), point: new THREE.Vector3(...anchor.position), projected: new THREE.Vector3() }));
  let stage = 0; let visible = true; let previousTime = 0; let alive = true; let fleetProgress = .12;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const resize = () => { const width = host.clientWidth; const height = host.clientHeight; renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); };
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); intersection.observe(host);
  const setStage = (next: number) => { stage = next; stakes.visible = stage >= 4; stakes.position.y = stage === 4 ? -.8 : 0; troops.visible = stage >= 4; home.visible = stage >= 1; supply.visible = stage === 2; routes.visible = stage >= 3; };
  setStage(0);
  renderer.setAnimationLoop((milliseconds) => {
    if (!alive || !visible || document.hidden || milliseconds - previousTime < 33) return;
    previousTime = milliseconds;
    const time = reducedMotion.matches ? 0 : milliseconds * .001;
    controls.update();
    const desiredProgress = stage < 3 ? .12 : stage < 5 ? .4 : .7;
    fleetProgress = reducedMotion.matches ? desiredProgress : THREE.MathUtils.lerp(fleetProgress, desiredProgress, .035);
    enemyShips.forEach((model, i) => {
      const target = Math.min(.96, fleetProgress + i * .05);
      const point = riverPath.getPoint(Math.max(0, target + Math.sin(time * .2 + i) * .008));
      model.position.copy(point); model.position.x += (i % 2 === 0 ? -.35 : .35); model.position.y += Math.sin(time + i) * .025;
      const direction = riverPath.getTangent(target); model.rotation.y = Math.atan2(direction.x, direction.z);
      model.rotation.z = stage === 5 && i < 2 ? .2 : Math.sin(time * .7 + i) * .018;
      model.visible = stage !== 6 || i < 2;
    });
    homeShips.forEach((model, i) => { model.position.y = .2 + Math.sin(time + i) * .03; });
    pinElements.forEach(({ element, point, projected }, index) => {
      if (!element) return;
      if (mapAnchors[index].id === "o-ma-nhi") point.copy(enemyShips[2].position).add(new THREE.Vector3(0, 3.2, 0));
      projected.copy(point).project(camera);
      const x = THREE.MathUtils.clamp((projected.x * .5 + .5) * host.clientWidth, element.offsetWidth / 2 + 5, host.clientWidth - element.offsetWidth / 2 - 5);
      const y = THREE.MathUtils.clamp((-projected.y * .5 + .5) * host.clientHeight, element.offsetHeight + 8, host.clientHeight - 12);
      element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
      element.style.visibility = projected.z > 1 ? "hidden" : "visible";
    });
    renderer.render(scene, camera);
  });
  return {
    setStage,
    zoom: (factor: number) => { const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor); offset.clampLength(17, 46); camera.position.copy(controls.target).add(offset); controls.update(); },
    reset: () => { camera.position.set(18, 22, 25); controls.target.set(0, 0, 0); controls.update(); },
    dispose: () => {
      alive = false; renderer.setAnimationLoop(null); resizeObserver.disconnect(); intersection.disconnect(); controls.dispose();
      const geometries = new Set<THREE.BufferGeometry>(); const materials = new Set<THREE.Material>();
      scene.traverse((object) => { if (object instanceof THREE.Mesh || object instanceof THREE.Line) { geometries.add(object.geometry); const items = Array.isArray(object.material) ? object.material : [object.material]; items.forEach((item) => materials.add(item)); } });
      geometries.forEach((geometry) => geometry.dispose()); materials.forEach((item) => item.dispose()); terrainTexture.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
};
