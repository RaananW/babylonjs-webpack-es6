import type { CreateSceneClass } from "../createScene";

/**
 * The scene registry - the single source of truth for every scene in this template.
 *
 * To add a scene:
 * 1. Create `src/scenes/<yourSceneName>.ts` exporting a class that implements
 *    `CreateSceneClass` as its `default` export.
 * 2. Add one line below: `<yourSceneName>: () => import("./<yourSceneName>"),`
 *
 * Each entry is a lazy `import()`, so webpack emits one chunk per scene and only
 * the requested scene is downloaded at runtime.
 */
export const sceneRegistry = {
    defaultWithTexture: () => import("./defaultWithTexture"),
    fresnelShader: () => import("./fresnelShader"),
    loadModelAndEnv: () => import("./loadModelAndEnv"),
    navigationMeshRecast: () => import("./navigationMeshRecast"),
    physicsWithAmmo: () => import("./physicsWithAmmo"),
    physicsWithHavok: () => import("./physicsWithHavok"),
} satisfies Record<string, () => Promise<{ default: CreateSceneClass }>>;

export type SceneName = keyof typeof sceneRegistry;

/** The scene loaded when no `?scene=` query parameter is provided. */
export const defaultSceneName: SceneName = "defaultWithTexture";

/** All registered scene names, useful for menus and tests. */
export const sceneNames = Object.keys(sceneRegistry) as SceneName[];

export const isSceneName = (name: unknown): name is SceneName =>
    typeof name === "string" && Object.prototype.hasOwnProperty.call(sceneRegistry, name);

/**
 * Resolves a (possibly missing or unknown) scene name to a registered one,
 * falling back to {@link defaultSceneName}.
 */
export const resolveSceneName = (name?: string | null): SceneName =>
    isSceneName(name) ? name : defaultSceneName;
