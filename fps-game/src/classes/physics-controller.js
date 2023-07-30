import * as CANNON from "cannon-es";
import { Component } from "./component";

class PhysicsController extends Component {
  constructor() {
    super();
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
  }

  update(deltaTime) {
    this.world.step(deltaTime);
  }

  AddBody(body) {
    this.world.addBody(body);
  }
}

export { PhysicsController };
