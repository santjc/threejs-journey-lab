import { Bullet } from "./bullet";
import { Component } from "./component";
import * as THREE from "three";

class ShooterController extends Component {
  constructor(camera, scene, physicsWorld) {
    super();
    this.camera = camera;
    this.scene = scene;
    console.log(this.camera.position, "log");
    this.physicsWorld = physicsWorld;
    this.bullets = [];
  }

  Shoot() {
    const bullet = new Bullet(
      this.camera.position.clone(),
      this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(10),
      this.scene,
      this.physicsWorld
    );

    this.bullets.push(bullet);
    this.scene.add(bullet.mesh);
  }

  update(deltaTime) {
    this.bullets.forEach((bullet) => {
      bullet.update(deltaTime);
    });
  }
}

export { ShooterController };
