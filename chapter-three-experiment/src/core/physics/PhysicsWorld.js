import * as CANNON from "cannon-es";
import Experience from "../Experience.js";
import CannonDebugger from "cannon-es-debugger";

export default class PhysicsWorld {
  constructor() {
    this.experience = new Experience();
    this.world = new CANNON.World();
    this.scene = this.experience.scene;
    this.bodies = [];
    this.world.gravity.set(0, -9.82, 0);
    this.setDebug();
  }

  updateBodies() {
    this.bodies.forEach((body) => {
      if (body.name === "PhysicsBody") {
        body.update();
      }
    });

    if (this.debug.active) {
      this.physicsDebugger.update();
    }
  }

  step() {
    this.world.fixedStep();
  }

  //debug mode
  setDebug() {
    this.debug = this.experience.debug;

    if (this.debug.active)
      this.physicsDebugger = new CannonDebugger(this.scene, this.world);
  }

  removeBody(body) {
    this.world.removeBody(body);
    this.bodies.splice(this.bodies.indexOf(body), 1);
  }

  addBody(body) {
    this.world.addBody(body);
    this.bodies.push(body);
  }

  addPhysicsBody(body) {
    this.world.addBody(body.cannonBody);
    this.bodies.push(body);
  }

  getWorld() {
    return this.world;
  }

  getBodies() {
    return this.bodies;
  }
}
