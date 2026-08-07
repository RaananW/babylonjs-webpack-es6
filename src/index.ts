import { createEngine, resolveEngineType } from "./createEngine";
import { getSceneModule } from "./createScene";
import { resolveSceneName } from "./scenes";

const getCanvas = (): HTMLCanvasElement => {
    const canvas = document.getElementById("renderCanvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(
            'Expected public/index.html to contain <canvas id="renderCanvas">.'
        );
    }
    return canvas;
};

const showStartupError = (error: unknown): void => {
    console.error("Unable to start the Babylon.js scene.", error);

    const message = error instanceof Error ? error.message : String(error);
    const errorElement = document.getElementById("startupError");
    if (errorElement) {
        errorElement.textContent = `Unable to start the scene: ${message}`;
        errorElement.hidden = false;
    }
};

export const babylonInit = async (): Promise<void> => {
    const params = new URLSearchParams(location.search);
    const sceneName = resolveSceneName(params.get("scene"));
    const engineType = resolveEngineType(params.get("engine"));
    const canvas = getCanvas();

    if (__DEV_CONTROLS__) {
        const { addDevelopmentControls } = await import(
            "./developmentControls"
        );
        addDevelopmentControls(sceneName, engineType);
    }

    const createSceneModule = await getSceneModule(sceneName);
    await Promise.all(createSceneModule.preTasks || []);

    const engine = await createEngine(canvas, engineType);
    const scene = await createSceneModule.createScene(engine, canvas);

    window.scene = scene;
    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());
};

void babylonInit().catch(showStartupError);
