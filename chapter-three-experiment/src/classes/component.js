import { Entity } from "./entity";
class Component extends Entity {
  constructor() {
    super();
    this.entity = null;
  }

  Destroy() {}

  SetParent(p) {
    this.parent = p;
  }

  SetEntity(e) {
    this.entity = e;
  }
  SetPosition(p) {
    this.position.copy(p);
  }
}
export { Component };
