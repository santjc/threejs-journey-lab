import { Component } from "./component.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { InputController } from "./input-controller.js";
import { KEYS } from "../utils/keys.js";
function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}

class CameraController extends Component {
  constructor(camera, world) {
    super();
    this.camera = camera;
    this.input = new InputController();
    this.position = new THREE.Vector3(0, 0.5, 0);
    this.phi = 0;
    this.phiSpeed = 2;

    this.theta = 0;
    this.thetaSpeed = 1;

    this.movementSpeed = 5;

    this.world = world;
    this.createPhysicsBody();
  }

  update(elapsedTime) {
    this.updateRotation();
    this.updateCamera();
    this.updatePosition(elapsedTime);
    this.input.update(elapsedTime);
  }

  createPhysicsBody() {
    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    this.body = new CANNON.Body({ mass: 1 });
    this.body.addShape(shape);
    this.world.addBody(this.body);
  }

  updateCamera() {
    this.camera.quaternion.copy(this.rotation);
    this.camera.position.copy(this.position);

    this.body.position.copy(this.position);
  }

  updatePosition(elapsedTime) {
    const forwardVelocity =
      (this.input.key(KEYS.w) ? 1 : 0) + (this.input.key(KEYS.s) ? -1 : 0);
    const strafeVelocity =
      (this.input.key(KEYS.d) ? 1 : 0) + (this.input.key(KEYS.a) ? -1 : 0);
    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(forwardVelocity * elapsedTime * this.movementSpeed);

    const left = new THREE.Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(strafeVelocity * elapsedTime * this.movementSpeed);

    this.position.add(forward);
    this.position.add(left);
  }

  updateRotation() {
    const xh = this.input.current.mouseXDelta / window.innerWidth;
    const yh = this.input.current.mouseYDelta / window.innerHeight;

    this.phi += -xh * this.phiSpeed;
    this.theta = clamp(
      this.theta + -yh * this.thetaSpeed,
      -Math.PI * 0.3,
      Math.PI * 0.3
    );

    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);

    const qz = new THREE.Quaternion();
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta);

    const q = new THREE.Quaternion();
    q.multiply(qx);
    q.multiply(qz);

    this.rotation.copy(q);
  }
}

export { CameraController };
