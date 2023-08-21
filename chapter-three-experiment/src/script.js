// index.js
import { LevelBuilder } from "./classes/lever-builder";
import { PhysicsController } from "./classes/physics-controller";
import { ThreeJSController } from "./classes/threejs-component";
import { CameraController } from "./classes/camera-controller";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { ShooterController } from "./classes/shooter-controller";

class BasicFPS {
  constructor() {
    this.scene = null;
    this.threeJSController = null;
    this.shooterController = null;
    this.clock = new THREE.Clock();
    this.canvas = document.querySelector("canvas.webgl");
    this.cannonDebugger = null;
    this.Init();
  }

  Init() {
    this.InitRenderer();
    this.CreatePhysics();
    this.CreateScene();
    this.CreateCamera();
    this.CreateShooterController();
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
    this.fpsCamera = new CameraController(
      this.threeJSController.camera,
      this.physics,
      this.canvas,
      this.scene
    );
  }

  CreateShooterController() {
    this.shooterController = new ShooterController(
      this.fpsCamera.camera,
      this.scene,
      this.physics
    );
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        this.shooterController.Shoot();
      }
    });
  }

  CreatePhysics() {
    this.physics = new PhysicsController();
  }

  InitCannonDebugger() {
    this.cannonDebugger = new CannonDebugger(this.scene, this.physics, {});
  }

  Step() {
    const delta = this.clock.getDelta();
    this.threeJSController.update();
    this.fpsCamera.update(delta);
    this.physics.update(delta);
    this.shooterController.update(delta);
    requestAnimationFrame(() => this.Step());
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", async () => {
  _APP = new BasicFPS();
});
