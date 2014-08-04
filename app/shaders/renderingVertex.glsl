precision mediump float;

varying vec4 pos;
varying vec4 localPosition;
varying vec3 vUv;

void main() {
	
	vUv = position;

	localPosition = modelMatrix * vec4(position, 1.0);

    pos = projectionMatrix * viewMatrix * localPosition;

    gl_Position = pos;
}