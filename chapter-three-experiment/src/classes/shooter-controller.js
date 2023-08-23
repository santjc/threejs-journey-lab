import { Bullet } from "./bullet";
import { Component } from "./component";
import * as THREE from "three";

class ShooterController extends Component {
  constructor(camera, scene, world) {
    super();
    this.camera = camera;
    this.scene = scene;
    console.log(this.camera.position, "log");
    this.world = world;
    this.bullets = [];
  }

  Shoot() {
    const bullet = new Bullet(
      this.camera.position.clone(),
      this.camera,
      this.scene,
      this.world
    );

    this.bullets.push(bullet);
    this.scene.add(bullet.mesh);
  }

  update(deltaTime) {
    this.bullets.forEach((bullet) => {
      bullet.update(deltaTime);
      if (bullet.destroy) {
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
      }
    });
  }
}

export { ShooterController };
