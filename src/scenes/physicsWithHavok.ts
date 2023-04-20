import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import "@babylonjs/core/Physics/physicsEngineComponent";

// If you don't need the standard material you will still need to import it since the scene requires it.
import "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";
import { havokModule } from "../externals/havok";
import { PhysicsShapeBox, PhysicsShapeSphere } from "@babylonjs/core/Physics/v2/physicsShape";
import { PhysicsBody } from "@babylonjs/core/Physics/v2/physicsBody";
import { PhysicsMotionType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";

class PhysicsSceneWithAmmo implements CreateSceneClass {
    preTasks = [havokModule];

    createScene = async (engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> => {
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
        const sphere = CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

        // Move the sphere upward at 4 units
        sphere.position.y = 4;
        
        // Our built-in 'ground' shape.
        const ground = CreateGround("ground", { width: 10, height: 10 }, scene);
        
        // PHYSICS!
        scene.enablePhysics(null, new HavokPlugin(true, await havokModule));
        // Create a sphere shape
        const sphereShape = new PhysicsShapeSphere(new Vector3(0, 0, 0)
            , 1
            , scene);

        // Sphere body
        const sphereBody = new PhysicsBody(sphere, PhysicsMotionType.DYNAMIC, false, scene);

        // Set shape material properties
        sphereShape.material = { friction: 0.2, restitution: 0.6 };

        // Associate shape and body
        sphereBody.shape = sphereShape;

        // And body mass
        sphereBody.setMassProperties({ mass: 1 });

        // Create a static box shape
        const groundShape = new PhysicsShapeBox(new Vector3(0, 0, 0)
            , Quaternion.Identity()
            , new Vector3(10, 0.1, 10)
            , scene);

        // Create a body and attach it to the ground. Set it as Static.
        const groundBody = new PhysicsBody(ground, PhysicsMotionType.STATIC, false, scene);

        // Set material properties
        groundShape.material = { friction: 0.2, restitution: 0.8 };

        // Associate the body and the shape
        groundBody.shape = groundShape;

        // Set the mass to 0
        groundBody.setMassProperties({ mass: 0 });


        return scene;
    };
}

export default new PhysicsSceneWithAmmo();
