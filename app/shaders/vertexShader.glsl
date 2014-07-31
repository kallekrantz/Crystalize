precision mediump float;

varying vec4 pos;
varying vec4 curvePos;
varying vec3 vUv;

void main() {
	
	vUv = position;

	curvePos = modelMatrix * 
            		vec4(position, 1.0);

    pos = projectionMatrix *
    		viewMatrix * curvePos;

    gl_Position = pos;
}