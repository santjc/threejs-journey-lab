import * as CANNON from "cannon-es";

class PhysicsWorld {
  constructor() {
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

  removeBody(body) {
    this.world.removeBody(body);
    this.bodies.splice(this.bodies.indexOf(body), 1);
  }

  addBody(body) {
    this.world.addBody(body);
    this.bodies.push(body);
  }

  getWorld() {
    return this.world;
  }

  getBodies() {
    return this.bodies;
  }
}

export { PhysicsWorld };
