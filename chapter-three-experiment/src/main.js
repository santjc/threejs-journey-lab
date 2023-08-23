// index.js
import { LevelBuilder } from "./classes/lever-builder";
import { PhysicsController } from "./classes/physics-controller";
import { ThreeJSController } from "./classes/threejs-component";
import { CameraController } from "./classes/camera-controller";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { ShooterController } from "./classes/shooter-controller";
import { SceneManager } from "./scenes/SceneManager";
import { DependencyContainer } from "./core/DependencyContainer";

class ExperimentThree {
  constructor() {
    this.scene = null;
    this.dependencies = null;
    this.clock = new THREE.Clock();
    this.canvas = document.querySelector("canvas.webgl");
    this.Init();
  }
  Init() {
    this.dependencies = new DependencyContainer();
    this.dependencies.setCanvas(this.canvas);
    this.dependencies.init();
    this.scene = new SceneManager();
    this.scene.setCamera(this.dependencies.camera);
    this.scene.setWorld(this.dependencies.physics);
    this.scene.setScene(this.dependencies.scene);
    this.scene.setWorld(this.dependencies.world);
    this.scene.setInputController(this.dependencies.inputController);

    document.addEventListener("click", () => {
      this.dependencies.cameraController.controls.lock();
    });

    //Add a box
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    box.position.set(0, 0, -5);
    this.scene.addMesh(box);
    this.Step();
  }
  Step() {
    const delta = this.clock.getDelta();
    this.dependencies.update(delta);
    requestAnimationFrame(() => this.Step());
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", async () => {
  _APP = new ExperimentThree();
});
