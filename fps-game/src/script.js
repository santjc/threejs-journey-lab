import { threejs_component } from "./classes/threejs-component";
import * as THREE from "three";
class BasicFPS {
  constructor() {
    this.Init();
  }
  Init() {
    this.LoadThreeJSComponent();
  }

  LoadThreeJSComponent() {
    const threeJSController = new threejs_component.ThreeJSController();
    window.addEventListener(
      "resize",
      () => threeJSController.onWindowResize(),
      false
    );
    threeJSController.SetPosition(new THREE.Vector3(0, 2, 5));
    threeJSController.TestSampleScene();
    threeJSController.render();
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", async () => {
  _APP = new BasicFPS();
});
