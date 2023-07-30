import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Component } from "./component";

class LevelBuilder extends Component {
  constructor(scene, physicsWorld) {
    super();
    this.scene = scene;
    this.physicsWorld = physicsWorld;
  }

  BuildFloor() {
    this.createFloor();
    this.createBox();
    this.addLight();
  }

  createFloor() {
    const geometry = new THREE.PlaneGeometry(25, 25, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    this.scene.add(floor);

    const shape = new CANNON.Plane();
    const body = new CANNON.Body({ mass: 0, shape: shape });
    body.position.set(0, 0, 0);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    body.threeMesh = floor;
    this.physicsWorld.AddBody(body);
  }

  createBox() {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 2, 0);
    this.scene.add(box);

    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    const boxBody = new CANNON.Body({ mass: 1, shape: boxShape });
    boxBody.position.set(5, 5, 0);
    boxBody.threeMesh = box;
    this.physicsWorld.AddBody(boxBody);
  }
  addLight() {
    const light = new THREE.AmbientLight(0x404040, 0.25);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
    this.scene.add(light, directionalLight);
  }
}

export { LevelBuilder };
