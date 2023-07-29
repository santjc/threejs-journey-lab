import * as THREE from "three";
import { Component } from "./component.js";
import { PlayerController } from "./player-controller.js";
export const threejs_component = (() => {
  class ThreeJSController extends Component {
    constructor() {
      super();
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      this.clock = new THREE.Clock();
      this.playerController = new PlayerController(this.camera);
    }

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    TestSampleScene() {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      const light = new THREE.AmbientLight(0x404040, 0.25);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
      this.LookAtCenter();
      this.scene.add(light, directionalLight);
      this.scene.add(cube);
    }
    LookAtCenter() {
      this.camera.lookAt(0, 0, 0);
    }
    SetPosition(p) {
      this.camera.position.copy(p);
    }

    render() {
      const delta = this.clock.getDelta();

      this.renderer.render(this.scene, this.camera);
      this.playerController.update();

      requestAnimationFrame(this.render.bind(this));
    }
  }

  return {
    ThreeJSController: ThreeJSController,
  };
})();
