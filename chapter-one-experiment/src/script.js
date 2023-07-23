import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

// Constants
const BLOCK_HEIGHT = 1;
const GRID_SIZE = 20;
const CLOCK = new THREE.Clock();
const RAYCASTER = new THREE.Raycaster();
const FLOOR_DIRECTION = new THREE.Vector3(0, -1, 0); // Direction pointing down (for block collisions)
const MOVING_SPEED = 0.05;
const ACCELERATION = 0.05;
var ySpeed = 0;

// Textures
const textureLoader = new THREE.TextureLoader();
const dirtTexture = textureLoader.load("/textures/dirt.png");
const grassDirtTexture = textureLoader.load("/textures/grass_dirt.jpeg");
const grassTexture = textureLoader.load("/textures/grass.jpeg");

dirtTexture.magFilter = THREE.NearestFilter;
dirtTexture.minFilter = THREE.LinearMipMapLinearFilter;
grassDirtTexture.magFilter = THREE.NearestFilter;
grassDirtTexture.minFilter = THREE.LinearMipMapLinearFilter;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.75);
pointLight.position.y = 15;
scene.add(pointLight, ambientLight);

// Camera
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
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

canvas.addEventListener("click", () => {
  controls.lock();
});

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Block class
class Block {
  constructor(x, y, z, texture, topTexture) {
    this.x = x;
    this.y = y;
    this.z = z;


    const blockBox = new THREE.BoxGeometry(1, 1, 1);
    blockBox.center();
    const blockMaterials = [];

    for (let i = 0; i < 6; i++) {
      if (i === 2) {
        blockMaterials.push(
          new THREE.MeshStandardMaterial({
            map: topTexture,
            side: THREE.FrontSide,
          })
        );
      } else {
        // Use texture for other faces
        blockMaterials.push(
          new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.FrontSide,
          })
        );
      }
    }
    this.originalMaterial = blockMaterials; 


    const blockMesh = new THREE.Mesh(blockBox, blockMaterials);
    blockMesh.position.set(this.x, this.y, this.z);

    this.mesh = new THREE.Group();
    this.mesh.add(blockMesh);
    scene.add(this.mesh);
  }
}

// Functions
const checkCollisions = () => {
  RAYCASTER.set(camera.position, FLOOR_DIRECTION);
  const intersectableObjects = blocks
    .filter((block) => block.mesh.children.length > 0)
    .map((block) => block.mesh.children[0]);
  const intersections = RAYCASTER.intersectObjects(intersectableObjects, true);
  if (intersections.length > 0) {
    const intersection = intersections[0];
    const distance = intersection.distance;
    if (distance < 2) {
      camera.position.y = intersection.point.y + 1.5;
      ySpeed = 0;
    }
  }
};

const highlightMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

const checkBlockCollision = () => {
  RAYCASTER.set(camera.position, camera.getWorldDirection(new THREE.Vector3()));
  const intersectableObjects = blocks
    .filter((block) => block.mesh.children.length > 0)
    .map((block) => block.mesh.children[0]);
  const intersections = RAYCASTER.intersectObjects(intersectableObjects, true);
  let blockFound = false;

  if (intersections.length > 0) {
    const intersection = intersections[0];
    const distance = intersection.distance;
    if (distance < 2) {
      const block = blocks.find(
        (block) => block.mesh.children[0] === intersection.object
      );
      if (block) {
        block.mesh.children[0].material = highlightMaterial;
        blockFound = true;

        if (keys["e"]) {
          // destroy block
          block.mesh.remove(block.mesh.children[0]);
          blocks.splice(blocks.indexOf(block), 1);
        }
      }
    }
  }

  if (!blockFound) {
    blocks.forEach((block) => {
      block.mesh.children[0].material = block.originalMaterial;
    });
  }
};

//DRAW CROSSHAIR
const crosshair = new THREE.Mesh(
  new THREE.BoxGeometry(0.04, 0.04, 1),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0.5,
    transparent: true,
  })
);
//SET CROSSHAIR ALWAYS VISIBLE
crosshair.position.x = 0;
crosshair.position.y = 0;
crosshair.position.z = -2;
camera.add(crosshair);

// Generate Blocks
const blocks = [];

for (let x = -GRID_SIZE; x < GRID_SIZE; x++) {
  for (let z = -GRID_SIZE; z < GRID_SIZE; z++) {
    const perlinValue = noise.perlin3(x * 0.1, 0, z * 0.1);
    const height = Math.floor(perlinValue * 6) * BLOCK_HEIGHT;
    const texture = height >= 0 ? grassDirtTexture : dirtTexture;

    // Pass the grassTexture as topTexture for blocks with a positive height
    const topTexture = height >= 0 ? grassTexture : dirtTexture;

    const block = new Block(x, height - 10, z, texture, topTexture);
    blocks.push(block);
  }
}

// Event listeners
const keys = {};
document.body.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") {
    ySpeed = -0.25;
  }
});

document.body.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Skybox

const vertexShader = document.getElementById("vertexShader").textContent;
const fragmentShader = document.getElementById("fragmentShader").textContent;

const skyboxMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.BackSide,
});

// Crear el skybox
const skyboxGeo = new THREE.BoxGeometry(50, 50, 50);
const skybox = new THREE.Mesh(skyboxGeo, skyboxMaterial);
scene.add(skybox);

const tick = () => {
  const elapsedTime = CLOCK.getElapsedTime();

  // Update controls
  if (keys["w"]) {
    controls.moveForward(MOVING_SPEED);
  }
  if (keys["s"]) {
    controls.moveForward(-1 * MOVING_SPEED);
  }
  if (keys["a"]) {
    controls.moveRight(-1 * MOVING_SPEED);
  }
  if (keys["d"]) {
    controls.moveRight(MOVING_SPEED);
  }

  // Update camera position and check collisions
  camera.position.y -= ySpeed;
  ySpeed += ACCELERATION;
  checkCollisions();
  checkBlockCollision();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
