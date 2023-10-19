import * as THREE from "three";

let instance = null;

export default class Experience {
  constructor(_canvas) {
    if (instance) {
      return instance;
    }

    //Global access
    window.experience = this;
    this.canvas = _canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });

    resize();
    {
      this.camera.resize();
      this.renderer.resize();
    }

    update();
    {
      this.camera.update();
      this.world.update();
      this.renderer.update();
    }

    destroy();
    {
      this.sizes.off("resize");
      this.time.off("tick");

      // Traverse the whole scene
      this.scene.traverse((child) => {
        // Test if it's a mesh
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();

          // Loop through the material properties
          for (const key in child.material) {
            const value = child.material[key];

            // Test if there is a dispose function
            if (value && typeof value.dispose === "function") {
              value.dispose();
            }
          }
        }
      });

      this.camera.controls.dispose();
      this.renderer.instance.dispose();

      if (this.debug.active) this.debug.ui.destroy();
    }
  }
}