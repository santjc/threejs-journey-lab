// index.js
import { LevelBuilder } from "./classes/lever-builder";
import { PhysicsController } from "./classes/physics-controller";
import { PlayerController } from "./classes/player-controller";
import { ThreeJSController } from "./classes/threejs-component";

import * as THREE from "three";

class BasicFPS {
  constructor() {
    this.scene = null;
    this.physicsWorld = new PhysicsController();
    this.threeJSController = new ThreeJSController();

    this.Init();
  }

  Init() {
    this.LoadThreeJSComponent();
  }

  LoadThreeJSComponent() {
    window.addEventListener(
      "resize",
      () => this.threeJSController.onWindowResize(),
      false
    );
    this.scene = this.threeJSController.scene;

    this.playerController = new PlayerController(
      this.threeJSController.camera,
      this.physicsWorld
    );
    this.threeJSController.SetPlayerController(this.playerController);
    this.threeJSController.SetPosition(new THREE.Vector3(0, 2, 5));
    this.threeJSController.SetPhysicsWorld(this.physicsWorld);
    const level = new LevelBuilder(this.scene, this.physicsWorld);
    level.BuildFloor();
    this.threeJSController.render();
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", async () => {
  _APP = new BasicFPS();
});
