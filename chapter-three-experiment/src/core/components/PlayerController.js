import Component from "../ecs/Component";
import { KEYS } from "../utils/keys";
import { Bullet } from "./Bullet";
import * as THREE from "three";

export default class PlayerController extends Component {
  constructor() {
    super();
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
  }
  updatePosition(elapsedTime) {
    const forwardVelocity =
      (this.inputController.key(KEYS.w) ? 1 : 0) +
      (this.inputController.key(KEYS.s) ? -1 : 0);
    const strafeVelocity =
      (this.inputController.key(KEYS.d) ? 1 : 0) +
      (this.inputController.key(KEYS.a) ? -1 : 0);
    this.movementSpeed = this.inputController.key(KEYS.shift) ? 10 : 5;
    this.controls.moveForward(
      forwardVelocity * this.movementSpeed * elapsedTime
    );
    this.controls.moveRight(strafeVelocity * this.movementSpeed * elapsedTime);
    this.position.copy(this.controls.getObject().position);
  }
  shoot() {
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
