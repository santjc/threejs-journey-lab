import { CameraController } from "../components/CameraController";
import { InputController } from "./InputController";
import { PhysicsWorld } from "./PhysicsWorld";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import * as THREE from "three";
class DependencyContainer {
  constructor() {
    this.camera = null;
    this.inputController = null;
    this.cameraController = null;
    this.scene = null;
    this.canvas = null;
    this.renderer = null;
    this.world = null;
    this.entityManager = null;
    this.textureLoader = null;
    this.gltfLoader = null;
    this.cubeTextureLoader = null;
    this.RGBELoader = null;
  }

  init() {
    this.setCamera();
    this.setScene();
    this.setRenderer();
    this.setWorld();
    this.setInputController();
    this.setCameraController();
    window.addEventListener("resize", () => this.onWindowResize(), false);
  }
  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);
  }
  setInputController() {
    this.inputController = new InputController();
  }

  setTextureLoader() {
    this.textureLoader = new THREE.TextureLoader();
  }

  setGLTFLoader() {
    this.gltfLoader = new GLTFLoader();
  }
  setCubeTextureLoader() {
    this.cubeTextureLoader = new THREE.CubeTextureLoader();
  }
  setRGBELoader() {
    this.RGBELoader = new RGBELoader();
  }
  setCameraController() {
    this.cameraController = new CameraController();
    this.cameraController.setCamera(this.camera);
    this.cameraController.setCanvas(this.canvas);
    this.cameraController.setInputController(this.inputController);
    this.cameraController.setControls();
  }
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      50
    );
  }

  setWorld() {
    this.world = new PhysicsWorld();
  }

  update(delta) {
    this.renderer.render(this.scene, this.camera);
    this.inputController.update(delta);
    this.world.update(delta);
    this.cameraController.update(delta);
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  setScene() {
    this.scene = new THREE.Scene();
  }

  setEntityManager(entityManager) {
    this.entityManager = entityManager;
  }

  getWorld() {
    return this.world;
  }
}

export { DependencyContainer };
