precision mediump float;

uniform sampler2D scene;

varying vec4 pos;
varying vec4 localPosition;
void main() {

    vec2 screenPosition = vec2(0.5 * pos.x/pos.z + 0.5,
                               0.5 * pos.y/pos.z + 0.5
    );
    vec2 displacement = vec2(snoise(pos.xyz)/50.0,
                             snoise(pos.zyx)/50.0
    );

    vec4 background = texture2D(scene, screenPosition + displacement);
    gl_FragColor = background;
}