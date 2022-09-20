/**
 * Shader sample code based on "Fresnel" template at https://cyos.babylonjs.com
 */

precision highp float;

// Lights
varying vec3 vPositionW;
varying vec3 vNormalW;

// Refs
uniform vec3 cameraPosition;

void main(void) {
    vec3 color = vec3(1., 1., 1.);
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);

    // Fresnel
	float fresnelTerm = dot(viewDirectionW, vNormalW);
	fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);

    gl_FragColor = vec4(color * fresnelTerm, 1.);
}