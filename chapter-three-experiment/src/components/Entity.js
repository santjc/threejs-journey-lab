import * as THREE from "three";

class Entity {
  constructor() {
    this.name = null;
    this.id = null;
    this.parent = null;

    this.attributes = {};
    this.components = {};

    this.position = new THREE.Vector3();
    this.rotation = new THREE.Quaternion();
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
