import { Component } from "./component";
import * as THREE from "three";
import * as CANNON from "cannon-es";
class Bullet extends Component {
  constructor(position, camera, scene, world) {
    super();
    this.position = position;
    this.camera = camera;
    this.scene = scene;
    this.world = world;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    this.mesh.position.copy(this.position);
    this.destroy = false;
    this.collide = false;

    this.addPhysics();
    this.handleCollisionBound = this.handleCollision.bind(this);
    this.body.addEventListener("collide", this.handleCollisionBound);
  }
  addPhysics() {
    const shape = new CANNON.Sphere(0.1);
    this.body = new CANNON.Body({ mass: 1, shape: shape });
    this.body.threeMesh = this.mesh;
    this.body.position.copy(this.position);

    const velocity = new THREE.Vector3();
    this.camera.getWorldDirection(velocity);
    velocity.multiplyScalar(20);
    this.body.velocity.copy(velocity);

    this.world.addBody(this.body);
  }

  update(deltaTime) {
    this.position.copy(this.body.position);
  }
  handleCollision(event) {
    this.collide = true;
    this.Destroy();
  }

  Destroy() {
    this.destroy = true;
    this.body.removeEventListener("collide", this.handleCollisionBound);
    setTimeout(() => {
      this.scene.remove(this.mesh);
    }, 1000);
  }
}

export { Bullet };
