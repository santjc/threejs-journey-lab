import * as THREE from "three";
import { Component } from "./component";

class PlayerController extends Component {
  constructor(camera) {
    super();
    this.camera = camera;
    this.speed = 0.1;
    this.rotationSpeed = 0.05;

    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);
    //document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    this.mouseX = 0;
    this.mouseY = 0;
  }

  onKeyDown(event) {
    console.log(event.keyCode);
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

  onMouseMove(event) {
    // Obtener las coordenadas del mouse relativas al centro de la ventana
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    // Actualizar la rotación del jugador en función de las coordenadas del mouse
    this.camera.rotation.y += this.rotationSpeed * this.mouseX;
    this.camera.rotation.x += this.rotationSpeed * this.mouseY;
  }

  update() {
    // Actualizar la posición y la rotación del jugador en cada frame
    const moveDirection = new THREE.Vector3();
    if (this.moveForward) moveDirection.z -= 1;
    if (this.moveBackward) moveDirection.z += 1;
    if (this.moveLeft) moveDirection.x -= 1;
    if (this.moveRight) moveDirection.x += 1;

    moveDirection.normalize();
    moveDirection.applyQuaternion(this.camera.quaternion);
    moveDirection.multiplyScalar(this.speed);

    this.camera.position.add(moveDirection);
  }
}
export { PlayerController };
