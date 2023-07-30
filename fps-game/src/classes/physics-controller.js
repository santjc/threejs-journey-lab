import * as CANNON from "cannon-es";
import * as THREE from "three";
import { Component } from "./component";

class PhysicsController extends Component {
  constructor() {
    super();
    this.world = new CANNON.World();
    this.bodies = [];
    this.world.gravity.set(0, -9.82, 0);
  }

  update(delta) {
    this.bodies.forEach((body) => {
      if (body.threeMesh) {
        body.threeMesh.position.copy(body.position);
        body.threeMesh.quaternion.copy(body.quaternion);
      }
    });

    this.world.step(delta);
  }

  addBody(body) {
    this.world.addBody(body);
    this.bodies.push(body);
  }
}

export { PhysicsController };
