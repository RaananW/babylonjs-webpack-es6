import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SphereBuilder } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { GroundBuilder } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

// If you don't need the standard material you will still need to import it since the scene requires it.
// import "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

import grassTextureUrl from '../assets/grass.jpg';

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element
const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine

const createScene = (): Scene => {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new ArcRotateCamera("my first camera", 0, Math.PI / 3, 10, new Vector3(0, 0, 0), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    const sphere = SphereBuilder.CreateSphere(
        "sphere",
        { diameter: 2, segments: 32 },
        scene
    );

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    const ground = GroundBuilder.CreateGround(
        "ground",
        { width: 6, height: 6 },
        scene
    );

    // Load a texture to be used as the ground material
    const groundMaterial = new StandardMaterial("ground material", scene);
    groundMaterial.diffuseTexture = new Texture(grassTextureUrl, scene);

    ground.material = groundMaterial;

    return scene;
};

const scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
