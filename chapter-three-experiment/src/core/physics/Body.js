import Entity from "../ecs/Entity.js";

export default class PhysicsBody extends Entity {
  constructor(threeMesh, cannonBody) {
    super();
    this.world = this.experience.world;
    this.scene = this.experience.scene;
    this.threeMesh = threeMesh;
    this.cannonBody = cannonBody;
    this.setName("PhysicsBody");
    this.addToScene();
  }

  addToScene() {
    this.scene.add(this.threeMesh);
  }

  update() {
    this.threeMesh.position.copy(this.cannonBody.position);
    this.threeMesh.quaternion.copy(this.cannonBody.quaternion);
  }
}
