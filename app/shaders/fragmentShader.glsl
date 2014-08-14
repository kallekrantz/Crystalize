precision mediump float;

uniform sampler2D scene;
uniform float opacity;
uniform float frequency;
uniform float mixFactor;

varying vec4 pos;
varying vec4 localPosition;
void main() {

    vec2 screenPosition = vec2(0.5 * pos.x/pos.z + 0.5,
                               0.5 * pos.y/pos.z + 0.5
    );
    vec2 displacement = vec2(snoise(frequency * pos.xyz)/50.0,
                             snoise(frequency * pos.zyx)/50.0
    );

    vec4 background = texture2D(scene, screenPosition + displacement);
    vec4 mixColor = vec4(0.0, 0.0, 0.5, 0.0);

    background = mix(background, mixColor, mixFactor);

    background.a = background.a - opacity;

    gl_FragColor = background;
}