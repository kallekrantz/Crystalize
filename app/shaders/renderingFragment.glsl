precision mediump float;

uniform sampler2D scene;
uniform sampler2D glassScene;

varying vec4 pos;
varying vec4 localPosition;
void main() {

    vec2 screenCoordinates = vec2(0.5 * pos.x/pos.z + 0.5, 
    							  0.5 * pos.y/pos.z + 0.5);

    vec4 background = texture2D(scene, screenCoordinates);
    vec4 glass = texture2D(glassScene, screenCoordinates);
    
    gl_FragColor = max(glass, background);
}