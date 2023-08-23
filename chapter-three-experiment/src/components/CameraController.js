import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Component } from "./Component";
import { KEYS } from "../utils/keys.js";

class CameraController extends Component {
  constructor() {
    super();
    this.canvas = null;
    this.inputController = null;
    this.controls = null;
  }

  setCanvas(c) {
    this.canvas = c;
  }
  setControls() {
    this.controls = new PointerLockControls(this.camera, this.canvas);
  }

  setInputController(i) {
    this.inputController = i;
  }

  update(elapsedTime) {
    this.updatePosition(elapsedTime);
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
}

export { CameraController };
