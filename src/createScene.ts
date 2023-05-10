import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";

export interface CreateSceneClass {
    createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>;
    preTasks?: Promise<unknown>[];
}

export interface CreateSceneModule {
    default: CreateSceneClass;
}

export const getSceneModuleWithName = (
    name = 'defaultWithTexture'
): Promise<CreateSceneClass> => {
    return import('./scenes/' + name).then((module: CreateSceneModule)=> {
        return module.default;
    });

    // To build quicker, replace the above return statement with:

    // return import('./scenes/defaultWithTexture').then((module: CreateSceneModule)=> {
    //     return module.default;
    // });
};

