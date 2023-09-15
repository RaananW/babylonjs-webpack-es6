import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color4 } from "@babylonjs/core";

//import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

import { CreateSceneClass } from "../createScene";

import tilEdMap from "../../assets/city.tmx";
import { tilEdMapToSpriteMap } from "../tiled/tilEdMapToSpriteMap";

export class FhlScene implements CreateSceneClass {

    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);
        scene.clearColor = new Color4(1, 0, 1, 1);

        void Promise.all([
            import("@babylonjs/core/Debug/debugLayer"),
            import("@babylonjs/inspector"),
        ]).then((_values) => {
            console.log(_values);
            scene.debugLayer.show({
                handleResize: true,
                overlay: true,
                globalRoot: document.getElementById("#root") || undefined,
            });
        });

        const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 8, Vector3.Zero());
        camera.attachControl(canvas, true);
        camera.position = new Vector3(camera.position.x, camera.position.y, camera.position.z - 25);
        const light = new PointLight("Point", new Vector3(5, 10, 5), scene);
        light.intensity = 0.7;

        //debugTileset(tiledMap.map, scene);
        tilEdMapToSpriteMap(tilEdMap.map, scene);

        return scene;
    };
}

export default new FhlScene();
