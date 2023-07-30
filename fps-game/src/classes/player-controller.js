import * as THREE from "three";
import * as CANNON from "cannon-es";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { Component } from "./component";

class PlayerController extends Component {
  constructor(camera, physicsWorld) {
    super();
    this.camera = camera;
    this.physicsWorld = physicsWorld;
    this.speed = 0.1;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.controls = new PointerLockControls(this.camera, document.body);

    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);

    document.addEventListener(
      "click",
      () => {
        this.controls.lock();
      },
      false
    );
    this.Init();
  }

  Init() {
    const playerShape = new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5));
    this.playerBody = new CANNON.Body({ mass: 1, shape: playerShape });
    this.playerBody.position.set(0, 2, 0);
    this.physicsWorld.AddBody(this.playerBody);
  }
  onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // W key (Forward)
        this.moveForward = true;
        break;
      case 83: // S key (Backward)
        this.moveBackward = true;
        break;
      case 65: // A key (Left)
        this.moveLeft = true;
        break;
      case 68: // D key (Right)
        this.moveRight = true;
        break;
    }
  }

  onKeyUp(event) {
    switch (event.keyCode) {
      case 87: // W key (Forward)
        this.moveForward = false;
        break;
      case 83: // S key (Backward)
        this.moveBackward = false;
        break;
      case 65: // A key (Left)
        this.moveLeft = false;
        break;
      case 68: // D key (Right)
        this.moveRight = false;
        break;
    }
  }

  update() {
    const moveDirection = new THREE.Vector3();
    if (this.moveForward) moveDirection.z += 1;
    if (this.moveBackward) moveDirection.z -= 1;
    if (this.moveLeft) moveDirection.x -= 1;
    if (this.moveRight) moveDirection.x += 1;

    moveDirection.normalize();
    moveDirection.applyQuaternion(this.camera.quaternion);
    moveDirection.multiplyScalar(this.speed);

    this.controls.moveForward(moveDirection.z);
    this.controls.moveRight(moveDirection.x);
  }
}

export { PlayerController };
