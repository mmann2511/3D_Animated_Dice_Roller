// dice.js
import * as THREE from "three";
import * as CANNON from "cannon-es";

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const DIE_SIZE = 0.6;
const DIE_HALF = DIE_SIZE / 2;

const textureLoader = new THREE.TextureLoader();

function loadTexture(path) {
  const t = textureLoader.load(path);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ==============================
// Dice Materials
// ==============================
function createDieMaterials() {
  return [
    new THREE.MeshStandardMaterial({ map: loadTexture("textures/dice/5.png") }),
    new THREE.MeshStandardMaterial({ map: loadTexture("textures/dice/2.png") }),
    new THREE.MeshStandardMaterial({ map: loadTexture("textures/dice/1.png") }),
    new THREE.MeshStandardMaterial({ map: loadTexture("textures/dice/6.png") }),
    new THREE.MeshStandardMaterial({ map: loadTexture("textures/dice/4.png") }),
    new THREE.MeshStandardMaterial({ map: loadTexture("textures/dice/3.png") })
  ];
}

// ==============================
// Face Detection
// ==============================
const faceNormals = [
  { value: 1, normal: new THREE.Vector3(0, 1, 0) },
  { value: 6, normal: new THREE.Vector3(0, -1, 0) },
  { value: 5, normal: new THREE.Vector3(1, 0, 0) },
  { value: 2, normal: new THREE.Vector3(-1, 0, 0) },
  { value: 4, normal: new THREE.Vector3(0, 0, 1) },
  { value: 3, normal: new THREE.Vector3(0, 0, -1) }
];

function getTopFace(mesh) {
  let bestDot = -Infinity;
  let value = null;

  for (const face of faceNormals) {
    const worldNormal = face.normal.clone().applyQuaternion(mesh.quaternion);
    const dot = worldNormal.dot(WORLD_UP);
    if (dot > bestDot) {
      bestDot = dot;
      value = face.value;
    }
  }
  return value;
}

// ==============================
// Die Factory
// ==============================
export function createDie({ scene, world, material, onSleep }) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(DIE_SIZE, DIE_SIZE, DIE_SIZE),
    createDieMaterials()
  );
  mesh.castShadow = true;
  scene.add(mesh);

  const body = new CANNON.Body({
    mass: 0.6,
    shape: new CANNON.Box(new CANNON.Vec3(DIE_HALF, DIE_HALF, DIE_HALF)),
    material,
    linearDamping: 0.05,
    angularDamping: 0.05
  });

  body.addEventListener("sleep", () => {
    onSleep?.(getTopFace(mesh));
  });

  world.addBody(body);
  return { mesh, body };
}

// ==============================
// Roll
// ==============================
export function throwDie(body, index, total) {
  body.wakeUp();

  const spread = (index - total / 2) * 1.2;

  body.position.set(spread, 1.2, 3);
  body.quaternion.set(0, 0, 0, 1);

  body.velocity.set(
    (Math.random() - 0.5) * 4,
    0.5,
    -16
  );

  body.angularVelocity.set(
    Math.random() * 20,
    Math.random() * 8,
    Math.random() * 20
  );
}




