import { createEngine, resolveEngineType } from "./createEngine";
import { getSceneModule } from "./createScene";

export const babylonInit = async (): Promise<void> => {
    const params = new URLSearchParams(location.search);

    const createSceneModule = await getSceneModule(params.get("scene"));
    // Execute the pretasks, if defined
    await Promise.all(createSceneModule.preTasks || []);

    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    const engine = await createEngine(canvas, resolveEngineType(params.get("engine")));

    const scene = await createSceneModule.createScene(engine, canvas);

    // JUST FOR TESTING. Not needed for anything else
    window.scene = scene;

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(() => scene.render());

    // Watch for browser/canvas resize events
    window.addEventListener("resize", () => engine.resize());
};

babylonInit().then(() => {
    // scene started rendering, everything is initialized
});
