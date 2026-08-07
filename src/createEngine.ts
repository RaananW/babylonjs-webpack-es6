import { Engine } from "@babylonjs/core/Engines/engine";
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
 * WebGPU is only downloaded when requested. Unsupported browsers fall back to
 * WebGL with a console warning so the page can still render.
 */
export const createEngine = async (
    canvas: HTMLCanvasElement,
    engineType: EngineType = defaultEngineType
): Promise<AbstractEngine> => {
    if (engineType === "webgpu") {
        const { WebGPUEngine } = await import(
            "@babylonjs/core/Engines/webgpuEngine"
        );

        if (await WebGPUEngine.IsSupportedAsync) {
            await import("@babylonjs/core/Engines/WebGPU/Extensions/index.js");
            const webgpu = new WebGPUEngine(canvas, {
                adaptToDeviceRatio: true,
                antialias: true,
            });
            await webgpu.initAsync();
            return webgpu;
        }

        console.warn(
            "WebGPU was requested but is unavailable in this browser; using WebGL instead."
        );
    }

    return new Engine(canvas, true);
};
