import { Component } from "./component";
import * as THREE from "three";
import * as CANNON from "cannon-es";
class Bullet extends Component {
  constructor(position, velocity, scene, physicsWorld) {
    super();
    this.position = position;
    this.velocity = velocity;
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    this.mesh.position.copy(this.position);
    this.destroy = false;
    this.addPhysics();
  }
  addPhysics() {
    const shape = new CANNON.Sphere(0.1);
    this.body = new CANNON.Body({ mass: 1 });
    this.body.addShape(shape);
    this.body.position.copy(this.position);
    this.body.velocity.copy(this.velocity);
    this.physicsWorld.addBody(this.body);
  }

  update(deltaTime) {
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.mesh.position.copy(this.position);
    if (this.body) {
      this.body.position.copy(this.position);
      this.body.addEventListener("collide", (event) => {
        this.destroy = true;
      });
    }
  }
}

export { Bullet };
