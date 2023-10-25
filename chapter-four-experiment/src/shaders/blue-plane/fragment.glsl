precision mediump float;
varying float vRandom;
varying float vTime;
void main() {
    float vRandomColor = vRandom + sin(vTime) * 0.5;
    float vRandomColor2 = vRandom + sin(vTime);

    gl_FragColor = vec4(vRandomColor, vRandomColor2, 1.0, 1.0);
}