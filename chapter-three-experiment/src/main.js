import * as THREE from "three";
import * as CANNON from "cannon-es";
import { SceneManager } from "./scenes/SceneManager";
import { DependencyContainer } from "./core/DependencyContainer";
import { PlayerController } from "./components/PlayerController";

class ExperimentThree {
  constructor() {
    this.scene = null;
    this.dependencies = null;
    this.clock = new THREE.Clock();
    this.canvas = document.querySelector("canvas.webgl");
    this.playerController = new PlayerController();
    this.textureLoader = null;
    this.gltfLoader = null;
    this.cubeTextureLoader = null;
    this.RGBELoader = null;
    this.Init();
  }
  Init() {
    this.dependencies = new DependencyContainer();
    this.dependencies.setCanvas(this.canvas);
    this.dependencies.setGLTFLoader();
    this.dependencies.setCubeTextureLoader();
    this.dependencies.setRGBELoader();
    this.dependencies.init();
    this.scene = new SceneManager();
    this.scene.setCamera(this.dependencies.camera);
    this.scene.setWorld(this.dependencies.physics);
    this.scene.setScene(this.dependencies.scene);
    this.scene.setWorld(this.dependencies.world);
    this.scene.setInputController(this.dependencies.inputController);
    this.playerController.SetInputController(this.dependencies.inputController);
    this.playerController.setCamera(this.dependencies.camera);
    this.playerController.setScene(this.dependencies.scene);
    this.playerController.setWorld(this.dependencies.world);
    this.textureLoader = this.dependencies.textureLoader;
    this.cubeTextureLoader = this.dependencies.cubeTextureLoader;
    this.gltfLoader = this.dependencies.gltfLoader;
    this.RGBELoader = this.dependencies.RGBELoader;

    document.addEventListener("click", () => {
      this.dependencies.cameraController.controls.lock();
    });

    const updateAllMaterials = () => {
      this.scene.getScene().traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
          if (child.name === "SciFiHelmet") {
            child.material.envMapIntensity = 3;
          } else {
            child.material.envMapIntensity = 1.5;
          }
        }
      });
    };

    this.RGBELoader.load("/envMaps/italy/2k.hdr", (map) => {
      map.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.setBackground(map);
      this.scene.setEnvironment(map);
      this.scene.getScene().backgroundBlurriness = 1;
    });

    this.gltfLoader.load("/models/helmet/SciFiHelmet.gltf", (gltf) => {
      this.scene.addMesh(gltf.scene);
      gltf.scene.position.set(0, 0, -10);
      updateAllMaterials();
    });

    //Add floor plane
    const groundMaterial = new CANNON.Material("ground");
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    groundBody.position.set(0, -1, 0);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        color: 0xf5f5dc,
        metalness: 0.3,
        roughness: 0.4,
      })
    );
    plane.rotation.set(-Math.PI / 2, 0, 0);
    plane.position.set(0, -1, 0);
    plane.receiveShadow = true;
    this.dependencies.world.addBody(groundBody);
    this.scene.addMesh(plane);

    this.Step();
  }

  Step() {
    const delta = this.clock.getDelta();
    this.dependencies.update(delta);
    this.playerController.Update(delta);
    requestAnimationFrame(() => this.Step());
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", async () => {
  _APP = new ExperimentThree();
});
