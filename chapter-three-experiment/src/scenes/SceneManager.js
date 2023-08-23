import { Entity } from "../components/Entity";

class SceneManager {
  constructor() {
    this.entities = {};
    this.meshes = {};
    this.scene = null;
    this.inputController = null;
    this.cameraController = null;
    this.camera = null;
    this.world = null;
  }

  setScene(s) {
    this.scene = s;
  }
  setCameraController(c) {
    this.cameraController = c;
  }
  setInputController(i) {
    this.inputController = i;
  }

  setCamera(c) {
    this.camera = c;
  }
  setWorld(w) {
    this.world = w;
  }
  addEntity(e) {
    this.entities[e.id] = e;
  }
  removeEntity(e) {
    delete this.entities[e.id];
  }
  addMesh(m) {
    this.meshes[m.id] = m;
    this.scene.add(m);
  }
  removeMesh(m) {
    delete this.meshes[m.id];
    this.scene.remove(m);
  }

  getScene() {
    return this.scene;
  }
  getCamera() {
    return this.camera;
  }
  getWorld() {
    return this.world;
  }
}

export { SceneManager };
