import Experience from "../Experience.js";

export default class Component {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.world = this.experience.world;
  }
}
