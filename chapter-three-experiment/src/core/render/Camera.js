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
    const moveDirection = new THREE.Vector3(0, 0, 0);

    if (this.inputController.key(KEYS.w)) {
      moveDirection.z = -1;
    }
    if (this.inputController.key(KEYS.s)) {
      moveDirection.z = 1;
    }
    if (this.inputController.key(KEYS.a)) {
      moveDirection.x = -1;
    }
    if (this.inputController.key(KEYS.d)) {
      moveDirection.x = 1;
    }

    moveDirection.normalize();

    this.controls.moveForward(
      moveDirection.z * this.movementSpeed * elapsedTime
    );
    this.controls.moveRight(moveDirection.x * this.movementSpeed * elapsedTime);

    // if space press, jump
    if (this.inputController.key(KEYS.space)) {
      this.controls.getObject().position.y += this.jumpHeight * 1.25;
    }

    // add gravity but constrain Y position to 1
    this.controls.getObject().position.y -= this.jumpHeight * 0.5;
    if (this.controls.getObject().position.y < 1) {
      this.controls.getObject().position.y = 1;
    }

    this.instance.position.copy(this.controls.getObject().position);
  }
  update() {}
}
