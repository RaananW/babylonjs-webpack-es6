import type { EngineType } from "./createEngine";
import {
    sceneNames,
    sceneRegistry,
    type SceneName,
} from "./scenes";

const createSelect = <T extends string>(
    labelText: string,
    values: readonly T[],
    selectedValue: T,
    getLabel: (value: T) => string
): { label: HTMLLabelElement; select: HTMLSelectElement } => {
    const label = document.createElement("label");
    label.textContent = labelText;

    const select = document.createElement("select");
    for (const value of values) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = getLabel(value);
        option.selected = value === selectedValue;
        select.append(option);
    }

    label.append(select);
    return { label, select };
};

export const addDevelopmentControls = (
    sceneName: SceneName,
    engineType: EngineType
): void => {
    const controls = document.createElement("form");
    controls.className = "development-controls";
    controls.ariaLabel = "Development scene controls";

    const scene = createSelect(
        "Scene",
        sceneNames,
        sceneName,
        (name) => sceneRegistry[name].title
    );
    const engine = createSelect(
        "Engine",
        ["webgl", "webgpu"] as const,
        engineType,
        (name) => (name === "webgpu" ? "WebGPU" : "WebGL")
    );

    controls.append(scene.label, engine.label);
    controls.addEventListener("change", () => {
        const params = new URLSearchParams(location.search);
        params.set("scene", scene.select.value);
        params.set("engine", engine.select.value);
        location.search = params.toString();
    });
    document.body.append(controls);
};
