import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Component } from "./component";
import { createNoise2D } from "simplex-noise";

class LevelBuilder extends Component {
  constructor(scene, world) {
    super();
    this.scene = scene;
    this.world = world;
    this.textureLoader = new THREE.TextureLoader();
  }

  BuildSandbox() {
    this.createTerrain();
    //Create a box
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 2, -5);
    this.scene.add(box);

    if (this.world) {
      //box
      const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
      const boxBody = new CANNON.Body({ mass: 5, shape: boxShape });
      boxBody.position.set(0, 2, -5);
      boxBody.threeMesh = box;
      this.world.addBody(boxBody);
    }

    this.addLight();
  }

  createTerrain() {
    const terrainTexture = this.textureLoader.load("/textures/dirtColor.jpg");
    // Improve texture quality
    terrainTexture.magFilter = THREE.NearestFilter;
    terrainTexture.minFilter = THREE.LinearMipMapLinearFilter;
    //Make texture smaller
    terrainTexture.repeat.set(16, 16);
    terrainTexture.wrapS = THREE.RepeatWrapping;
    terrainTexture.wrapT = THREE.RepeatWrapping;
    const terrainNormalTexture = this.textureLoader.load(
      "/textures/dirtNormal.jpg"
    );
    terrainNormalTexture.repeat.set(16, 16);
    terrainNormalTexture.wrapS = THREE.RepeatWrapping;
    terrainNormalTexture.wrapT = THREE.RepeatWrapping;

    const terrainRoughnessTexture = this.textureLoader.load(
      "/textures/dirtRoughness.jpg"
    );
    terrainRoughnessTexture.repeat.set(16, 16);
    terrainRoughnessTexture.wrapS = THREE.RepeatWrapping;
    terrainRoughnessTexture.wrapT = THREE.RepeatWrapping;

    const terrainHeightTexture = this.textureLoader.load(
      "/textures/dirtHeight.png"
    );
    terrainHeightTexture.repeat.set(16, 16);
    terrainHeightTexture.wrapS = THREE.RepeatWrapping;
    terrainHeightTexture.wrapT = THREE.RepeatWrapping;

    const terrainAmbientOcclusionTexture = this.textureLoader.load(
      "/textures/dirtAO.jpg"
    );
    terrainAmbientOcclusionTexture.repeat.set(16, 16);
    terrainAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    terrainAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;

    const terrainGeometry = new THREE.PlaneGeometry(50, 50, 16, 16);
    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x74663b,
      map: terrainTexture,
      normalMap: terrainNormalTexture,
      roughnessMap: terrainRoughnessTexture,
      aoMap: terrainAmbientOcclusionTexture,
      aoMapIntensity: 1,
    });
    const noise2D = createNoise2D();

    terrainGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(terrainGeometry.attributes.position.array),
        3
      )
    );

    const positionAttribute = terrainGeometry.getAttribute("position");
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positionAttribute, i);
      vertex.z = noise2D(vertex.x, vertex.y);
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positionAttribute.needsUpdate = true;

    terrainGeometry.computeVertexNormals();

    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -1;
    this.scene.add(terrain);

    if (this.world) {
      const terrainShape = new CANNON.Plane();
      const terrainBody = new CANNON.Body({ mass: 0 });
      terrainBody.threeMesh = terrain;
      terrainBody.addShape(terrainShape);
      terrainBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1, 0, 0),
        Math.PI / 2
      );
      terrainBody.position.y = -1;
      this.world.addBody(terrainBody);
    }
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x0055a5, 0.7);
    moonLight.position.set(0, 5, 10);
    moonLight.castShadow = true;
    this.scene.add(moonLight);

    // Spotlight
    const fog = new THREE.Fog(0x000000, 5, 20);
    this.scene.fog = fog;
  }
}

export { LevelBuilder };
