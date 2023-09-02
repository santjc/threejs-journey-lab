import * as THREE from "three";
import { SceneManager } from "./scenes/SceneManager";
import { DependencyContainer } from "./core/DependencyContainer";
import { PlayerController } from "./components/PlayerController";

class ExperimentThree {
  constructor() {
    this.scene = null;
    this.dependencies = null;
    this.clock = new THREE.Clock();
    this.canvas = document.querySelector("canvas.webgl");
    this.playerController = new PlayerController();
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
    this.playerController.SetInputController(this.dependencies.inputController);
    this.playerController.setCamera(this.dependencies.camera);
    this.playerController.setScene(this.dependencies.scene);
    this.playerController.setWorld(this.dependencies.world);

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
    this.playerController.Update(delta);
    requestAnimationFrame(() => this.Step());
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", async () => {
  _APP = new ExperimentThree();
});
