import { Sphere } from "three";
import Experience from "../core/Experience.js";

export default class MainScene {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Sphere();
    });
  }

  update() {}
}
