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
  Destroy() {
    for (let k in this.components) {
      this.components[k].Destroy();
    }
    this.components = null;
    this.parent = null;
  }

  SetParent(p) {
    this.parent = p;
  }

  SetName(n) {
    this.name = n;
  }

  SetId(id) {
    this.id = id;
  }
  SetPosition(p) {
    this.position.copy(p);
  }

  SetRotation(r) {
    this.rotation.copy(r);
  }
}

export { Entity };