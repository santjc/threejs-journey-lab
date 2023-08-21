import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Component } from "./component";
import { createNoise2D } from "simplex-noise";

class LevelBuilder extends Component {
  constructor(scene, physicsWorld) {
    super();
    this.scene = scene;
    this.physicsWorld = physicsWorld;
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

    if (this.physicsWorld) {
      //box
      const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
      const boxBody = new CANNON.Body({ mass: 1, shape: boxShape });
      boxBody.position.set(0, 2, -5);
      boxBody.threeMesh = box;
      this.physicsWorld.addBody(boxBody);
    }

    this.addLight();
  }

  createTerrain() {
    const terrainTexture = this.textureLoader.load("/textures/dirtColor.jpg");
    // Improve texture quality
    terrainTexture.magFilter = THREE.NearestFilter;
    terrainTexture.minFilter = THREE.LinearMipMapLinearFilter;
    //Make texture smaller
    terrainTexture.repeat.set(50, 50);
    terrainTexture.wrapS = THREE.RepeatWrapping;
    terrainTexture.wrapT = THREE.RepeatWrapping;
    const terrainNormalTexture = this.textureLoader.load(
      "/textures/dirtNormal.jpg"
    );
    const terrainRoughnessTexture = this.textureLoader.load(
      "/textures/dirtRoughness.jpg"
    );
    const terrainHeightTexture = this.textureLoader.load(
      "/textures/dirtHeight.png"
    );
    const terrainAmbientOcclusionTexture = this.textureLoader.load(
      "/textures/dirtAO.jpg"
    );

    const terrainGeometry = new THREE.PlaneGeometry(50, 50, 128, 128);
    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x74663b,
      wireframe: false,
      map: terrainTexture,
      normalMap: terrainNormalTexture,
      roughnessMap: terrainRoughnessTexture,
      displacementMap: terrainHeightTexture,
      aoMap: terrainAmbientOcclusionTexture,
      displacementScale: 0.1,
      aoMapIntensity: 1,
      roughness: 1,
      metalness: 0,
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
      vertex.z = noise2D(vertex.x, vertex.y) * 0.1;
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positionAttribute.needsUpdate = true;

    terrainGeometry.computeVertexNormals();

    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -1;
    this.scene.add(terrain);

    if (this.physicsWorld) {
      const heightFieldMatrix = [];
      for (let i = 0; i < terrainGeometry.parameters.heightSegments + 1; i++) {
        heightFieldMatrix.push([]);
        for (let j = 0; j < terrainGeometry.parameters.widthSegments + 1; j++) {
          heightFieldMatrix[i].push(
            terrainGeometry.attributes.position.getZ(
              i * (terrainGeometry.parameters.heightSegments + 1) + j
            )
          );
        }
      }

      const terrainShape = new CANNON.Heightfield(heightFieldMatrix, {
        elementSize: 1,
      });
      const terrainBody = new CANNON.Body({ mass: 0, shape: terrainShape });
      terrainBody.position.set(
        -terrainGeometry.parameters.width / 2,
        -1,
        terrainGeometry.parameters.height / 2
      );
      terrainBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
      );

      this.physicsWorld.addBody(terrainBody);
    }
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
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
