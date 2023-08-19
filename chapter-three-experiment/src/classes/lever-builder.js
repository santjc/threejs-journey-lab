import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Component } from "./component";
import { createNoise2D } from "simplex-noise";

class LevelBuilder extends Component {
  constructor(scene, physicsWorld) {
    super();
    this.scene = scene;
    this.physicsWorld = physicsWorld;
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
    const terrainGeometry = new THREE.PlaneGeometry(50, 50, 128, 128);
    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: false,
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
      vertex.z = noise2D(vertex.x, vertex.y) * 0.25;
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
    const light = new THREE.AmbientLight(0x404040, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
    this.scene.add(light, directionalLight);
  }
}

export { LevelBuilder };
