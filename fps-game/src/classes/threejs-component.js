import * as THREE from "three";
import { Component } from "./component.js";

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

  SetPlayerController(playerController) {
    this.playerController = playerController;
  }
  SetPhysicsWorld(physicsWorld) {
    this.physicsWorld = physicsWorld;
  }
  render() {
    const delta = this.clock.getDelta();

    this.physicsWorld.update(delta);

    const bodies = this.physicsWorld.world.bodies;
    for (const body of bodies) {
      if (body.threeMesh) {
        body.threeMesh.position.copy(body.position);
        body.threeMesh.quaternion.copy(body.quaternion);
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.playerController.update();

    requestAnimationFrame(this.render.bind(this));
  }
}

export { ThreeJSController };
