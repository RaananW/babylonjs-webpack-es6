import { Engine } from "@babylonjs/core/Engines/engine";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import type { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";

export type EngineType = "webgl" | "webgpu";

export const defaultEngineType: EngineType = "webgl";

/**
 * Resolves a (possibly missing or unknown) engine name, falling back to WebGL.
 */
export const resolveEngineType = (engineType?: string | null): EngineType =>
    engineType === "webgpu" ? "webgpu" : defaultEngineType;

/**
 * Creates the Babylon engine for the given canvas.
 *
 * WebGPU is only used when it is both requested and supported - otherwise this
 * silently falls back to WebGL so the page always renders something.
 */
export const createEngine = async (
    canvas: HTMLCanvasElement,
    engineType: EngineType = defaultEngineType
): Promise<AbstractEngine> => {
    if (engineType === "webgpu" && (await WebGPUEngine.IsSupportedAsync)) {
        // You can decide which WebGPU extensions to load when creating the engine. I am loading all of them
        await import("@babylonjs/core/Engines/WebGPU/Extensions/index.js");
        const webgpu = new WebGPUEngine(canvas, {
            adaptToDeviceRatio: true,
            antialias: true,
        });
        await webgpu.initAsync();
        return webgpu;
    }

    return new Engine(canvas, true);
};
