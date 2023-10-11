import { KEYS } from "../utils/keys";
import { Bullet } from "./Bullet";
import { Component } from "./Component";
import * as THREE from "three";

class PlayerController extends Component {
  constructor() {
    super();
    this.canvas = null;
    this.inputController = null;
    this.controls = null;
    this.movementSpeed = 5;
    this.jumpHeight = 5;
    this.jump = false;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.inputController = null;
  }

  SetInputController(i) {
    this.inputController = i;
    console.log(i);
  }

  Shoot() {
    const bullet = new Bullet(
      this.camera.position,
      this.camera,
      this.scene,
      this.world
    );
    bullet.Instanciate();
    this.scene.add(bullet.mesh);
    this.world.addBody(bullet.body);

    setTimeout(() => {
      this.scene.remove(bullet.mesh);
      this.world.removeBody(bullet.body);
    }, 3000);
  }

  Update(elapsedTime) {
    if (this.inputController.key(KEYS.space)) {
      this.Shoot();
    }
  }
}

export { PlayerController };
