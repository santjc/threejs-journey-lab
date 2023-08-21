import { Component } from "./component.js";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import * as CANNON from "cannon-es";
import { InputController } from "./input-controller.js";
import { KEYS } from "../utils/keys.js";
function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}

class CameraController extends Component {
  constructor(camera, world, canvas, scene) {
    super();
    this.canvas = canvas;
    this.scene = scene;
    this.camera = camera;
    this.light = null;
    this.input = new InputController();
    this.position = new THREE.Vector3(0, 0.5, 0);
    this.controls = new PointerLockControls(this.camera, this.canvas);
    this.canvas.addEventListener("click", () => {
      controls.lock();
    });
    this.movementSpeed = 5;

    this.world = world;
    this.createPhysicsBody();
    document.addEventListener("click", () => {
      this.controls.lock();
    });
  }

  update(elapsedTime) {
    this.updateBody();
    this.updatePosition(elapsedTime);
    this.input.update(elapsedTime);
  }

  createPhysicsBody() {
    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    const pointLight = new THREE.PointLight(0xffffff, 1, 3);
    this.light = pointLight;
    this.scene.add(this.light);
    this.body = new CANNON.Body({ mass: 1 });
    this.body.addShape(shape);
    this.world.addBody(this.body);
  }

  updateBody() {
    this.body.position.copy(this.position);
  }

  updatePosition(elapsedTime) {
    const forwardVelocity =
      (this.input.key(KEYS.w) ? 1 : 0) + (this.input.key(KEYS.s) ? -1 : 0);
    const strafeVelocity =
      (this.input.key(KEYS.d) ? 1 : 0) + (this.input.key(KEYS.a) ? -1 : 0);
    this.movementSpeed = this.input.key(KEYS.shift) ? 10 : 5;
    this.controls.moveForward(
      forwardVelocity * this.movementSpeed * elapsedTime
    );
    this.controls.moveRight(strafeVelocity * this.movementSpeed * elapsedTime);

    this.position.copy(this.controls.getObject().position);
    this.light.position.copy(this.position);
  }
}

export { CameraController };
