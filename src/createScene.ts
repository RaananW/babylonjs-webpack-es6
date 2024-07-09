import type { Scene } from "@babylonjs/core/scene";

// Change this import to check other scenes
import { DefaultSceneWithTexture } from "./scenes/defaultWithTexture";
import { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";

export interface CreateSceneClass {
    createScene: (engine: AbstractEngine, canvas: HTMLCanvasElement) => Promise<Scene>;
    preTasks?: Promise<unknown>[];
}

export interface CreateSceneModule {
    default: CreateSceneClass;
}

export const getSceneModuleWithName = (
    name = 'fhlScene'
    //name = 'defaultWithTexture'
): Promise<CreateSceneClass> => {
    return import('./scenes/' + name).then((module: CreateSceneModule)=> {
        return module.default;
    });

    // To build quicker, replace the above return statement with:

    // return import('./scenes/defaultWithTexture').then((module: CreateSceneModule)=> {
    //     return module.default;
    // });
};

export const getSceneModule = (): CreateSceneClass => {
    return new DefaultSceneWithTexture();
}

