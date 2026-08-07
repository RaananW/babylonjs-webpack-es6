import type { CreateSceneClass } from "../createScene";

export interface SceneDefinition {
    /** Human-readable name used by development controls and tests. */
    title: string;
    /** Lazy scene module loader. */
    load: () => Promise<{ default: CreateSceneClass }>;
    /** Enables deterministic screenshot coverage for this scene. */
    visualTest?: {
        waitForNetworkIdle?: boolean;
    };
}

/**
 * The scene registry - the single source of truth for every scene in this template.
 *
 * To add a scene:
 * 1. Create `src/scenes/<yourSceneName>.ts` exporting a class that implements
 *    `CreateSceneClass` as its `default` export.
 * 2. Add one entry below with a title and lazy `load` function.
 *
 * Each entry is a lazy `import()`, so webpack emits one chunk per scene and only
 * the requested scene is downloaded at runtime.
 */
export const sceneRegistry = {
    defaultWithTexture: {
        title: "Default",
        load: () => import("./defaultWithTexture"),
        visualTest: {},
    },
    fresnelShader: {
        title: "Fresnel Shader",
        load: () => import("./fresnelShader"),
        visualTest: {},
    },
    loadModelAndEnv: {
        title: "Load model and env",
        load: () => import("./loadModelAndEnv"),
        visualTest: {},
    },
    navigationMeshRecast: {
        title: "Navigation mesh recast",
        load: () => import("./navigationMeshRecast"),
        visualTest: { waitForNetworkIdle: true },
    },
    physicsWithAmmo: {
        title: "Physics with Ammo",
        load: () => import("./physicsWithAmmo"),
    },
    physicsWithHavok: {
        title: "Physics with Havok",
        load: () => import("./physicsWithHavok"),
    },
} satisfies Record<string, SceneDefinition>;

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
