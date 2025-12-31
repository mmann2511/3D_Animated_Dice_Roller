// tray.js
import * as THREE from "three";
import * as CANNON from "cannon-es";

export function createTray({
  world,
  scene,
  material,
  width,
  depth,
  wallHeight,
  wallThickness,
  dieSize = 0.6
}) {
  const halfX = width / 2;
  const halfZ = depth / 2;
  const dieHalf = dieSize / 2;

  const wallSizeX = wallThickness;
  const wallSizeY = wallHeight;
  const wallSizeZ = depth;

  const wallHalfX = wallSizeX / 2;
  const wallHalfY = wallSizeY / 2;
  const wallHalfZ = wallSizeZ / 2;

  // =====================
  // Textures
  // =====================
  const textureLoader = new THREE.TextureLoader();

  const feltTexture = textureLoader.load("/textures/tray/felt_dark.jpg");
  feltTexture.colorSpace = THREE.SRGBColorSpace;
  feltTexture.wrapS = feltTexture.wrapT = THREE.RepeatWrapping;
  feltTexture.repeat.set(4, 4);

  const woodTexture = textureLoader.load("/textures/tray/wood.jpg");
  woodTexture.colorSpace = THREE.SRGBColorSpace;
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;

  const feltMaterial = new THREE.MeshStandardMaterial({
    map: feltTexture,
    roughness: 0.85,
    metalness: 0.0
  });

  const woodMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.6,
    metalness: 0.0
  });

  // =====================
  // Helpers
  // =====================
  function addBody(position, halfExtents) {
    const body = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Box(halfExtents),
      material
    });
    body.position.copy(position);
    world.addBody(body);
  }

  function addMesh(size, position, mat) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size.x, size.y, size.z),
      mat
    );
    mesh.position.copy(position);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  // =====================
  // Floor
  // =====================
  addBody(
    new CANNON.Vec3(0, -0.05, 0),
    new CANNON.Vec3(halfX + dieHalf, 0.1, halfZ + dieHalf)
  );

  addMesh(
    new THREE.Vector3(width, 0.2, depth),
    new THREE.Vector3(0, -0.05, 0),
    feltMaterial
  );

  // =====================
  // +X Right Wall
  // =====================
  addBody(
    new CANNON.Vec3(halfX + wallHalfX, wallHalfY - 0.05, 0),
    new CANNON.Vec3(wallHalfX, wallHalfY, halfZ)
  );

  addMesh(
    new THREE.Vector3(wallSizeX, wallSizeY, depth),
    new THREE.Vector3(halfX + wallHalfX, wallHalfY - 0.05, 0),
    woodMaterial
  );

  // =====================
  // -X Left Wall
  // =====================
  addBody(
    new CANNON.Vec3(-(halfX + wallHalfX), wallHalfY - 0.05, 0),
    new CANNON.Vec3(wallHalfX, wallHalfY, halfZ)
  );

  addMesh(
    new THREE.Vector3(wallSizeX, wallSizeY, depth),
    new THREE.Vector3(-(halfX + wallHalfX), wallHalfY - 0.05, 0),
    woodMaterial
  );

  // =====================
  // +Z Bottom Wall
  // =====================
  addBody(
    new CANNON.Vec3(0, wallHalfY - 0.05, halfZ + wallHalfX),
    new CANNON.Vec3(halfX, wallHalfY, wallHalfX)
  );

  addMesh(
    new THREE.Vector3(width, wallSizeY, wallSizeX),
    new THREE.Vector3(0, wallHalfY - 0.05, halfZ + wallHalfX),
    woodMaterial
  );

  // =====================
  // -Z Top Wall
  // =====================
  addBody(
    new CANNON.Vec3(0, wallHalfY - 0.05, -(halfZ + wallHalfX)),
    new CANNON.Vec3(halfX, wallHalfY, wallHalfX)
  );

  addMesh(
    new THREE.Vector3(width, wallSizeY, wallSizeX),
    new THREE.Vector3(0, wallHalfY - 0.05, -(halfZ + wallHalfX)),
    woodMaterial
  );

  // =====================
  // Ceiling (physics only)
  // =====================
  addBody(
    new CANNON.Vec3(0, wallHeight + 1, 0),
    new CANNON.Vec3(halfX + dieHalf, 0.1, halfZ + dieHalf)
  );
}






