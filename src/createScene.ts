import type { Scene } from "@babylonjs/core/scene";
import type { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import { resolveSceneName, sceneRegistry } from "./scenes";

/**
 * The contract every scene in `src/scenes` must fulfil.
 */
export interface CreateSceneClass {
    /** Builds and returns the scene. Called once, after `preTasks` resolved. */
    createScene: (
        engine: AbstractEngine,
        canvas: HTMLCanvasElement
    ) => Promise<Scene>;
    /** Optional promises (wasm modules, external libs) awaited before `createScene`. */
    preTasks?: Promise<unknown>[];
}

export interface CreateSceneModule {
    default: CreateSceneClass;
}

/**
 * Lazily loads a scene by name. Unknown or missing names fall back to the
 * default scene, so this never rejects because of a bad `?scene=` value.
 */
export const getSceneModule = async (
    name?: string | null
): Promise<CreateSceneClass> => {
    const sceneModule = await sceneRegistry[resolveSceneName(name)]();
    return sceneModule.default;
};
