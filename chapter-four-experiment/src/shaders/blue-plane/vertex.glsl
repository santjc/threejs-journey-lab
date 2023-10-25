uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
attribute vec3 position;
attribute float aRandom;

varying float vRandom;
uniform float uTime;
varying float vTime;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += aRandom * 0.05 * sin(modelPosition.x - uTime);
    modelPosition.z += aRandom * 0.1 * cos(modelPosition.y + uTime);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    vRandom = aRandom;
    vTime = uTime;
}
