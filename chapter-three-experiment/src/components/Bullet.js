import { Component } from "./Component";
import * as THREE from "three";
import * as CANNON from "cannon-es";
class Bullet extends Component {
  constructor(position, camera, scene, world) {
    super();
    this.body = null;
    this.position = position;
    this.camera = camera;
    this.scene = scene;
    this.world = world;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
  }

  Instanciate() {
    this.mesh.position.copy(this.position);
    const shape = new CANNON.Sphere(0.1);
    this.body = new CANNON.Body({ mass: 1, shape: shape });
    // add velocity and direction
    this.direction = new THREE.Vector3();
    this.camera.getWorldDirection(this.direction);
    this.body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.atan2(-this.direction.x, -this.direction.z)
    );
    this.body.velocity.set(
      this.direction.x * 10,
      this.direction.y * 10,
      this.direction.z * 10
    );

    this.body.threeMesh = this.mesh;
    this.body.position.copy(this.position);
  }
}
export { Bullet };
