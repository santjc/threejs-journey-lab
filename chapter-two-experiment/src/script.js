import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GenerateParticles } from "./particles";

// Constants
const textureLoader = new THREE.TextureLoader();

// Textures
const dirtTexture = textureLoader.load("/textures/dirtColor.jpg");
const dirtAOTexture = textureLoader.load("/textures/dirtAO.jpg");
const dirtNormalTexture = textureLoader.load("/textures/dirtNormal.jpg");
const dirtRoughnessTexture = textureLoader.load("/textures/dirtRoughness.jpg");
const dirtHeightTexture = textureLoader.load("/textures/dirtHeight.png");

const rockTexture = textureLoader.load("/textures/rockColor.jpg");
const rockAOTexture = textureLoader.load("/textures/rockAO.jpg");
const rockNormalTexture = textureLoader.load("/textures/rockNormal.jpg");
const rockRoughnessTexture = textureLoader.load("/textures/rockRoughness.jpg");
const rockHeightTexture = textureLoader.load("/textures/rockHeight.png");

// Improve texture quality
dirtTexture.magFilter = THREE.NearestFilter;
dirtTexture.minFilter = THREE.LinearMipMapLinearFilter;
//Make texture smaller
dirtTexture.repeat.set(4, 4);
dirtTexture.wrapS = THREE.RepeatWrapping;
dirtTexture.wrapT = THREE.RepeatWrapping;

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x0055a5, 0.5);
moonLight.position.set(0, 5, 10);
scene.add(moonLight);

// Spotlight
const spotLight = new THREE.SpotLight(0xffffff, 1, 10, Math.PI * 0.25, 1, 2);
spotLight.position.set(2, 5, 2);
scene.add(spotLight);
spotLight.castShadow = true;

// Objects
const spheres = new THREE.Group();
const sphereMaterial = new THREE.MeshStandardMaterial({
  map: rockTexture,
  aoMap: rockAOTexture,
  normalMap: rockNormalTexture,
  roughnessMap: rockRoughnessTexture,
  displacementMap: rockHeightTexture,
  displacementScale: 1,
  aoMapIntensity: 1,
  roughness: 1,
  metalness: 0,
});
const sphereGeometry = new THREE.SphereGeometry(0.25, 64, 64);
const sphere2Geometry = new THREE.SphereGeometry(0.5, 64, 64);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
const sphere2 = new THREE.Mesh(sphere2Geometry, sphereMaterial);
spheres.add(sphere, sphere2);
sphere.position.y = 0.5;
sphere2.position.y = 0.5;
sphere2.position.x = 1.5;
sphere.position.z = 1.5;
sphere2.castShadow = true;
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere2.receiveShadow = true;

//add sphere uv2
sphere.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
sphere2.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(sphere2.geometry.attributes.uv.array, 2)
);

scene.add(spheres);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(7, 7, 64, 64),
  new THREE.MeshStandardMaterial({
    map: dirtTexture,
    aoMap: dirtAOTexture,
    normalMap: dirtNormalTexture,
    roughnessMap: dirtRoughnessTexture,
    displacementMap: dirtHeightTexture,
    displacementScale: 1,
    aoMapIntensity: 1,
    roughness: 1,
    metalness: 0,
  })
);

//add uv2
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.position.y = -0.5;
floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;
scene.add(floor);

// particles
const particles = GenerateParticles();
scene.add(particles);

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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 10;
controls.minDistance = 10;
controls.enableRotate = false;
controls.autoRotate = true;
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Render
  renderer.render(scene, camera);

  controls.update();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
