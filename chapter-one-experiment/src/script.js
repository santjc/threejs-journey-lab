import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import * as dat from "lil-gui";
class Block {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    const blockBox = new THREE.BoxGeometry(1, 1, 1);
    blockBox.center();
    const blockMaterial = new THREE.MeshStandardMaterial({
      map: dirtTexture,
    });
    const blockMesh = new THREE.Mesh(blockBox, blockMaterial);
    blockMesh.position.set(this.x, this.y, this.z);

    const edges = new THREE.EdgesGeometry(blockBox);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    line.position.set(this.x, this.y, this.z);

    this.mesh = new THREE.Group();
    this.mesh.add(blockMesh, line);
    scene.add(this.mesh);
  }
}
THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Textures
const textureLoader = new THREE.TextureLoader();
const dirtTexture = textureLoader.load("/textures/dirt.png");
dirtTexture.magFilter = THREE.NearestFilter;
dirtTexture.minFilter = THREE.NearestFilter;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointlight = new THREE.PointLight(0xffffff, 0.75);

pointlight.position.y = 15;

scene.add(pointlight, ambientLight);

/**
 * Objects
 */
const gridSize = 25;
const blocks = [];
const blockHeight = 1; // Altura de cada bloque

for (let x = -gridSize; x < gridSize; x++) {
  for (let z = -gridSize; z < gridSize; z++) {
    const perlinValue = noise.perlin3(x * 0.1, 0, z * 0.1);
    const height = Math.floor(perlinValue * 5) * blockHeight;
    const block = new Block(x, height - 10, z);
    blocks.push(block);
  }
}

// Movement
const keys = {};
document.body.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") {
    ySpeed = -0.3;
  }
});

document.body.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new PointerLockControls(camera, canvas);
const movingSpeed = 0.05;
const acceleration = 0.01;
var ySpeed = 0;
canvas.addEventListener("click", () => {
  controls.lock();
});

controls.addEventListener("lock", () => {
  console.log("lock");
});

controls.addEventListener("unlock", () => {
  console.log("unlock");
});

// Raycaster
const raycaster = new THREE.Raycaster();
const direction = new THREE.Vector3(0, -1, 0); // Dirección hacia abajo (colisiones con bloques)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const checkCollisions = () => {
  raycaster.set(camera.position, direction);
  const intersectableObjects = blocks
    .filter((block) => block.mesh.children.length > 0)
    .map((block) => block.mesh.children[0]); // Filtrar solo los bloques con geometría válida
  const intersections = raycaster.intersectObjects(intersectableObjects, true);
  if (intersections.length > 0) {
    const intersection = intersections[0];
    const distance = intersection.distance;
    if (distance < 2) {
      camera.position.y = intersection.point.y + 1.5;
      ySpeed = 0;
    }
  }
};


const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  if (keys["w"]) {
    controls.moveForward(movingSpeed);
  }
  if (keys["s"]) {
    controls.moveForward(-1 * movingSpeed);
  }
  if (keys["a"]) {
    controls.moveRight(-1 * movingSpeed);
  }
  if (keys["d"]) {
    controls.moveRight(movingSpeed);
  }

  // Update camera position and check collisions
  camera.position.y -= ySpeed;
  ySpeed += acceleration;
  checkCollisions();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
