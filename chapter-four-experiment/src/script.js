import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import bluePlaneFragmentShader from "./shaders/blue-plane/fragment.glsl";
import bluePlaneVertexShader from "./shaders/blue-plane/vertex.glsl";

import flagFragmentShader from "./shaders/flag/fragment.glsl";
import flagVertexShader from "./shaders/flag/vertex.glsl";
import { createNoise2D } from "simplex-noise";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/textures/argentina-flag.png");

/**
 * Test mesh
 */
// Geometry
const bluePlaneGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
const flagGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);


const bluePlaneCount = bluePlaneGeometry.attributes.position.count;
const randomValues = createSimplexNoise(bluePlaneGeometry, bluePlaneCount);
bluePlaneGeometry.setAttribute(
  "aRandom",
  new THREE.BufferAttribute(randomValues, 1)
);


// Material
const bluePlaneMaterial = new THREE.RawShaderMaterial({
  vertexShader: bluePlaneVertexShader,
  fragmentShader: bluePlaneFragmentShader,
  uniforms: {
    uTime: { value: 0 },
  },
  transparent: true,
});

const flagMaterial = new THREE.RawShaderMaterial({
  vertexShader: flagVertexShader,
  fragmentShader: flagFragmentShader,
  transparent: true,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uTexture: { value: flagTexture },
  },
});
gui
  .add(flagMaterial.uniforms.uFrequency.value, "x")
  .min(0)
  .max(20)
  .step(0.01)
  .name("uFrequencyX");
gui
  .add(flagMaterial.uniforms.uFrequency.value, "y")
  .min(0)
  .max(20)
  .step(0.01)
  .name("uFrequencyY");
// Mesh
const bluePlaneMesh = new THREE.Mesh(bluePlaneGeometry, bluePlaneMaterial);
bluePlaneMesh.position.x = -0.55;

const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial);
flagMesh.position.x = 0.55;
flagMesh.scale.y = 2 / 3;

scene.add(bluePlaneMesh);
scene.add(flagMesh);

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
camera.position.set(0.25, -0.25, 1);
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  flagMaterial.uniforms.uTime.value = elapsedTime;
  bluePlaneMaterial.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
function createSimplexNoise(geometry, count) {
  // create random values using simplex-noise library
  const randoms = new Float32Array(count);

  const noise2D = createNoise2D();
  for (let i = 0; i < count; i++) {
    const x = geometry.attributes.position.getX(i) * 5;
    const y = geometry.attributes.position.getY(i) * 5;

    randoms[i] = noise2D(x, y);
  }
  return randoms;
}
