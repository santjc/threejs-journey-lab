import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Component } from "./component";

class LevelBuilder extends Component {
  constructor(scene, physicsWorld) {
    super();
    this.scene = scene;
    this.physicsWorld = physicsWorld;
  }

  BuildSandbox() {
    const geometry = new THREE.BoxGeometry(25, 25, 0.1, 8, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      wireframe: true,
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    this.scene.add(floor);

    //Create a box
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 2, -5);
    this.scene.add(box);

    if (this.physicsWorld) {
      const shape = new CANNON.Box(new CANNON.Vec3(15, 15, 0.1));
      const body = new CANNON.Body({
        mass: 0,
        shape: shape,
        position: new CANNON.Vec3(0, -1, 0),
      });
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      body.threeMesh = floor;
      this.physicsWorld.addBody(body);

      //box
      const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
      const boxBody = new CANNON.Body({ mass: 1, shape: boxShape });
      boxBody.position.set(0, 2, -5);
      boxBody.threeMesh = box;
      this.physicsWorld.addBody(boxBody);
    }

    this.addLight();
  }

  addLight() {
    const light = new THREE.AmbientLight(0x404040, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
    this.scene.add(light, directionalLight);
  }
}

export { LevelBuilder };
