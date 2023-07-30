import { Entity } from "./entity";
import * as THREE from "three";
import * as CANNON from "cannon-es";
class PhysicsBody extends Entity {
  constructor(params) {
    super(params);
    this.Init(params);
  }

  Init(params) {
    this.three = params.three;
    this.physics = params.physics;
    this.three.position.copy(this.position);
    this.three.quaternion.copy(this.quaternion);
    this.physics.addBody(this);
  }
}
