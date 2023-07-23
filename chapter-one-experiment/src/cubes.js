import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Textures
const textureLoader = new THREE.TextureLoader();
const bricksColorTexture = textureLoader.load(
  "/textures/bricks/bricksBaseColor.jpg"
);
const bricksHeightTexture = textureLoader.load(
  "/textures/bricks/bricksHeight.png"
);
const bricksNormalTexture = textureLoader.load(
  "/textures/bricks/bricksNormal.jpg"
);
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/bricksAmbientOclussion.jpg"
);
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/bricksRoughness.jpg"
);

//Tiles
const tilesColorTexture = textureLoader.load(
  "/textures/tiles/tilesBaseColor.jpg"
);
const tilesHeightTexture = textureLoader.load(
  "/textures/tiles/tilesHeight.png"
);
const tilesNormalTexture = textureLoader.load(
  "/textures/tiles/tilesNormal.jpg"
);
const tilesAmbientOcclusionTexture = textureLoader.load(
  "/textures/tiles/tilesAmbientOclussion.jpg"
);
const tilesRoughnessTexture = textureLoader.load(
  "/textures/tiles/tilesRoughness.jpg"
);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointlight = new THREE.PointLight(0xffffff, 0.5);
const pointlight2 = new THREE.PointLight(0xffffff, 0.5);

pointlight.position.x = 2;
pointlight.position.y = 4;
pointlight.position.z = 5;
pointlight2.position.x = -2;
pointlight2.position.y = 4;
pointlight2.position.z = -5;

scene.add(pointlight, pointlight2, ambientLight);
/**
 * Objects
 */

const geometry = new THREE.BoxGeometry(1, 1, 1, 64, 64);
//bricks
const bricksMaterial = new THREE.MeshStandardMaterial();
bricksMaterial.map = bricksColorTexture;
bricksMaterial.aoMap = bricksAmbientOcclusionTexture;
bricksMaterial.displacementMap = bricksHeightTexture;
bricksMaterial.displacementScale = 0.01;
bricksMaterial.roughnessMap = bricksRoughnessTexture;
bricksMaterial.normalMap = bricksNormalTexture;

//tiles
const tilesMaterial = new THREE.MeshStandardMaterial();
tilesMaterial.map = tilesColorTexture;
tilesMaterial.aoMap = tilesAmbientOcclusionTexture;
tilesMaterial.displacementMap = tilesHeightTexture;
tilesMaterial.displacementScale = 0.01;
tilesMaterial.roughnessMap = tilesRoughnessTexture;
tilesMaterial.normalMap = tilesNormalTexture;

const bricksMesh = new THREE.Mesh(geometry, bricksMaterial);
const tilesMesh = new THREE.Mesh(geometry, tilesMaterial);



bricksMesh.geometry.center();
tilesMesh.geometry.center();
tilesMesh.position.x = -1;
bricksMesh.position.x = 1;

scene.add(bricksMesh, tilesMesh);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
