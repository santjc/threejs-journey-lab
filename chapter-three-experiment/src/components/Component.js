import { Entity } from "./Entity";
import * as THREE from "three";

class Component extends Entity {
  constructor() {
    super();
    this.entity = null;
    this.camera = null;
    this.scene = null;
    this.world = null;
    this.mesh = null;

    this.position = new THREE.Vector3();
    this.rotation = new THREE.Quaternion();
  }

  setEntity(e) {
    this.entity = e;
  }

  setCamera(c) {
    this.camera = c;
  }

  setScene(s) {
    this.scene = s;
  }

  setWorld(w) {
    this.world = w;
  }

  setMesh(m) {
    this.mesh = m;
  }
}

export { Component };
