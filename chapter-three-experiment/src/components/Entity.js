import * as THREE from "three";

class Entity {
  constructor() {
    this.name = null;
    this.id = null;
    this.parent = null;

    this.attributes = {};
    this.components = {};
    this.dead = false;
  }

  get Id() {
    return this.id;
  }
  get Name() {
    return this.name;
  }
  get Attributes() {
    return this.attributes;
  }

  get Position() {
    return this.position;
  }
  get Rotation() {
    return this.rotation;
  }
  addComponent(c) {
    this.components[c.constructor.name] = c;
    c.SetEntity(this);
  }

  destroy() {
    this.dead = true;
    for (let k in this.components) {
      this.components[k].Destroy();
    }
    this.components = null;
    this.parent = null;
  }
}

export { Entity };
