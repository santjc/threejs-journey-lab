import Experience from "../core/Experience.js";
import Environment from "./world/Environment.js";
import Floor from "./world/Floor.js";

export default class MainScene {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.environment = new Environment();
    });
  }

  update() {}
}
