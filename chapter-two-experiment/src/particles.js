import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Points,
  PointsMaterial,
  Color,
} from "three";

const parameters = {};
parameters.count = 2500;
parameters.size = 0.02;

const lerpColor = (colorA, colorB, alpha) => {
  return colorA.clone().lerp(colorB, alpha);
};

export const GenerateParticles = (time) => {
  // Geometry
  const geometry = new BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const multiplier = 50 * Math.random();
    const angle = ((i % 5) / 5) * Math.PI;
    const spinAngle = Math.random() * Math.PI * 2;

    const randomX = Math.random() * 0.2 - 0.1;
    const randomY = Math.random() * 0.2 - 0.1;
    const randomZ = Math.random() * 0.2 - 0.1;

    positions[i3] = Math.cos(angle + spinAngle) * multiplier + randomX;
    positions[i3 + 1] = Math.sin(multiplier) + randomY * 5;
    positions[i3 + 2] = Math.sin(angle + spinAngle) * multiplier + randomZ;

    const colorA = new Color();
    const colorB = new Color();
    colorA.setHSL(Math.random() * 0.2 + 0.6, 0.75, 0.6); // Tonos azules y violetas
    colorB.setHSL(Math.random() * 0.2 + 0.2, 0.75, 0.6); // Tonos amarillos y naranjas

    const alpha = Math.random();
    const mixedColor = lerpColor(colorA, colorB, alpha);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));

  // Material
  const material = new PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
  });

  // Points
  const points = new Points(geometry, material);
  return points;
};
