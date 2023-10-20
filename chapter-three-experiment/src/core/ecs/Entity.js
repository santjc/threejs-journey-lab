import * as THREE from "three";
import Experience from "../Experience.js";

export default class Entity {
  constructor() {
    this.experience = new Experience();
    this.name = null;
    this.id = null;
    this.parent = null;
    this.attributes = {};
    this.components = {};
    this.dead = false;

    this.position = new THREE.Vector3();
    this.rotation = new THREE.Quaternion();
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

  get ComponentNames() {
    return Object.keys(this.components);
  }

  destroy() {
    this.dead = true;
  }
}
