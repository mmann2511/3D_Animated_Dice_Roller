// ==============================
// Imports
// ==============================
import * as THREE from "three";
import * as CANNON from "cannon-es";

import { createTray } from "./tray.js";
import { createDie, throwDie } from "./dice.js";

// ==============================
// Scene / Renderer
// ==============================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 12, 8);
camera.lookAt(0, 0, 0);
camera.up.set(0, 0, -1);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ==============================
// Lighting
// ==============================
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(5, 10, 5);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 30;
sun.shadow.camera.left = -10;
sun.shadow.camera.right = 10;
sun.shadow.camera.top = 10;
sun.shadow.camera.bottom = -10;
scene.add(sun);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));

// ==============================
// Physics World
// ==============================
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.allowSleep = true;
world.broadphase = new CANNON.SAPBroadphase(world);

// Physics materials
const diceMaterial = new CANNON.Material("dice");
const tableMaterial = new CANNON.Material("table");

world.addContactMaterial(
  new CANNON.ContactMaterial(diceMaterial, tableMaterial, {
    friction: 0.3,
    restitution: 0.6
  })
);

// ==============================
// Tray
// ==============================
createTray({
  world,
  scene,
  material: tableMaterial,
  width: 15,
  depth: 10,
  wallHeight: 2,
  wallThickness: 0.4
});

// ==============================
// Game State
// ==============================
let diceInPlay = [];
let rolling = false;

// ==============================
// UI Elements
// ==============================
const addBtn = document.getElementById("add-d6");
const rollBtn = document.getElementById("roll");
const diceCountEl = document.getElementById("dice-count");
const resultDisplay = document.getElementById("result");

let pendingDice = 0;

// ==============================
// UI Handlers
// ==============================
addBtn.onclick = () => {
  pendingDice++;
  diceCountEl.textContent = pendingDice;
};

rollBtn.onclick = () => {
  if (rolling || pendingDice === 0) return;
  rollAllDice(pendingDice);
  pendingDice = 0;
  diceCountEl.textContent = 0;
  resultDisplay.textContent = "Rolling...";
};

// ==============================
// Roll Logic
// ==============================
function rollAllDice(count) {
  rolling = true;
  let finished = 0;
  let total = 0;

  // Cleanup old dice
  diceInPlay.forEach(({ mesh, body }) => {
    scene.remove(mesh);
    world.removeBody(body);
  });
  diceInPlay = [];

  for (let i = 0; i < count; i++) {
    const die = createDie({
      scene,
      world,
      material: diceMaterial,
      onSleep: (value) => {
        total += value;
        finished++;

        if (finished === count) {
          resultDisplay.textContent = `Total: ${total}`;
          rolling = false;
        }
      }
    });

    diceInPlay.push(die);
    throwDie(die.body, i, count);
  }
}

// ==============================
// Animation Loop
// ==============================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.033);
  world.step(1 / 60, delta, 3);

  diceInPlay.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
  });

  renderer.render(scene, camera);
}

animate();

// ==============================
// Resize Handling
// ==============================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



