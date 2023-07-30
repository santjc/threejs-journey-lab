// index.js
import { LevelBuilder } from "./classes/lever-builder";
import { PhysicsController } from "./classes/physics-controller";
import { ThreeJSController } from "./classes/threejs-component";
import { CameraController } from "./classes/camera-controller";
import * as THREE from "three";
import * as CANNON from "cannon-es";

class BasicFPS {
  constructor() {
    this.scene = null;
    this.threeJSController = null;
    this.clock = new THREE.Clock();
    this.Init();
  }

  Init() {
    this.InitRenderer();
    this.CreatePhysics();

    this.CreateScene();
    this.CreateCamera();
    this.Step();
  }

  InitRenderer() {
    this.threeJSController = new ThreeJSController();
    this.scene = this.threeJSController.scene;
    window.addEventListener(
      "resize",
      () => this.threeJSController.onWindowResize(),
      false
    );
  }

  CreateScene() {
    const sandbox = new LevelBuilder(this.scene, this.physics);
    sandbox.BuildSandbox();
  }
  CreateCamera() {
    this.fpsCamera = new CameraController(this.threeJSController.camera);
  }

  CreatePhysics() {
    this.physics = new PhysicsController();
  }

  Step() {
    const delta = this.clock.getDelta();
    const timeElapsed = this.clock.getElapsedTime();
    this.threeJSController.update();
    this.fpsCamera.update(timeElapsed * delta);
    this.physics.update();
    requestAnimationFrame(() => this.Step());
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", async () => {
  _APP = new BasicFPS();
});
