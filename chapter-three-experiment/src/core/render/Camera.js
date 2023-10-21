import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import Experience from "../Experience";
import EventEmitter from "../utilities/EventEmitter";
import { KEYS } from "../../utils/keys";
import InputController from "../components/InputController";

export default class Camera extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.movementSpeed = 0.005;
    this.jumpHeight = 0.1;

    this.setInstance();
    this.setControls();
    this.setInputController();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      70,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(0, 1, 0);
    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new PointerLockControls(this.instance, this.canvas);
    window.addEventListener("click", () => {
      this.controls.lock();
    });
  }

  setInputController() {
    this.inputController = new InputController();
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
  updatePosition(elapsedTime) {
    const forwardVelocity =
      (this.inputController.key(KEYS.w) ? 1 : 0) +
      (this.inputController.key(KEYS.s) ? -1 : 0);
    const strafeVelocity =
      (this.inputController.key(KEYS.d) ? 1 : 0) +
      (this.inputController.key(KEYS.a) ? -1 : 0);
    this.controls.moveForward(
      forwardVelocity * this.movementSpeed * elapsedTime
    );
    this.controls.moveRight(strafeVelocity * this.movementSpeed * elapsedTime);
    this.instance.position.copy(this.controls.getObject().position);
  }
  update() {}
}
