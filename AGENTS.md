# AGENTS.md

Instructions for AI coding agents (and humans in a hurry) working in this repository.

## What this project is

A Babylon.js + TypeScript + webpack (ES6 / tree-shakable modules) starter template.
It renders one scene at a time into a full-page canvas. There is no framework, no
router and no state management - keep it that way.

## Layout

| Path | Purpose |
| --- | --- |
| `src/index.ts` | Entry point. Reads `?scene=` / `?engine=`, boots the engine, runs the render loop. Keep it thin. |
| `src/createEngine.ts` | Engine creation (WebGL / WebGPU) and engine-name resolution. |
| `src/createScene.ts` | The `CreateSceneClass` contract and the lazy `getSceneModule()` loader. |
| `src/scenes/index.ts` | **The scene registry** - the single source of truth for available scenes. |
| `src/scenes/*.ts` | One file per scene. |
| `src/externals/*.ts` | Wrappers around wasm/external libs (Havok, Ammo) exposing a ready-promise. |
| `src/glsl/` | Raw shaders, imported as strings via `ts-shader-loader`. |
| `assets/` | Textures/models bundled through `url-loader`. |
| `public/` | Static files served as-is (`index.html`, workers). |
| `tests/validation.spec.ts` | Playwright screenshot tests, one per scene per engine. |
| `webpack.config.js` | The only webpack config. Switches behaviour via `--env production` / `--env test`. |
| `.github/workflows/` | CI (`ci.yml`) and the manual snapshot refresh (`update-snapshots.yml`). |

## How to add a scene (the only supported way)

1. Create `src/scenes/myScene.ts`:

```ts
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import type { CreateSceneClass } from "../createScene";

export class MyScene implements CreateSceneClass {
    // Optional: promises awaited before createScene() runs (wasm, external libs)
    // preTasks = [havokModule];

    createScene = async (
        engine: AbstractEngine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        const scene = new Scene(engine);
        const camera = new ArcRotateCamera("camera", 0, Math.PI / 3, 10, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        return scene;
    };
}

export default new MyScene();
```

2. Register it in `src/scenes/index.ts`:

```ts
myScene: () => import("./myScene"),
```

3. Open `http://localhost:8080/?scene=myScene`.
4. If it should be screenshot-tested, add an entry to `scenes` in `tests/validation.spec.ts`
   and run `npm run test:visuals -- --update-snapshots`.

Do **not** switch scenes by editing imports in `src/createScene.ts` or `src/index.ts` -
the registry plus `?scene=` is the mechanism.

## Babylon.js import rules (most common source of bugs)

This template uses the **ES6 / tree-shaken** packages. Import from deep paths, never
from the package root:

```ts
// GOOD
import { Scene } from "@babylonjs/core/scene";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";

// BAD - pulls in the whole engine, breaks tree-shaking
import { Scene } from "@babylonjs/core";
import * as BABYLON from "babylonjs";
```

Some features are registered through **side-effect imports** and will fail silently
(or throw at runtime) if omitted. Add them explicitly, for example:

```ts
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Culling/ray";                      // needed for picking
import "@babylonjs/core/Physics/physicsEngineComponent";   // needed for physics
```

Rule of thumb: if a property exists on the type but is `undefined`/inert at runtime,
a side-effect import is missing.

**Loaders are different.** As of Babylon.js 9, `SceneLoader` plugins are *not* registered
by a side-effect import alone - loading a `.glb` fails with `No plugin or fallback for .glb`
unless the plugin is registered explicitly. Loading glTF needs both halves:

```ts
import "@babylonjs/loaders/glTF/2.0/glTFLoader";   // registers the glTF 2.0 loader
import { RegisterGLTFFileLoader } from "@babylonjs/loaders/glTF/glTFFileLoader";
import { registerBuiltInGLTFExtensions } from "@babylonjs/loaders/glTF/2.0/Extensions/dynamic";

RegisterGLTFFileLoader();          // registers the .gltf/.glb SceneLoader plugin
registerBuiltInGLTFExtensions();   // lazily registers the KHR_* extensions
```

Miss the side-effect import and you get `Unsupported version: 2.0` instead. See
`src/scenes/loadModelAndEnv.ts` for the working reference. `registerBuiltInLoaders()` from
`@babylonjs/loaders/dynamic` registers every format at once - convenient, but prefer
registering just the loader you need.

## Commands

| Command | What it does |
| --- | --- |
| `npm start` | Dev server with hot reload on `http://localhost:8080`. |
| `npm run build` | Production bundle into `dist/`. |
| `npm run build:dev` | Unminified development bundle. |
| `npm run lint` | ESLint over all `.ts` files. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run test:unit` | Jest unit tests (`*.unit.test.ts` / `*.unit.spec.ts`). |
| `npm run test:visuals` | Playwright screenshot tests (starts its own dev server). |
| `npm run verify` | lint + typecheck + unit tests. |

## Verification expected from an agent

After any code change, run at minimum:

```sh
npm run verify
```

Run `npm run build` as well when touching `webpack.config.js`, asset imports, or dependencies.

Visual tests render through SwiftShader, so the committed baselines in
`tests/validation.spec.ts-snapshots/` work on any OS and `npm run test:visuals` should pass
locally. Only run `--update-snapshots` when a scene changed **on purpose**: it rewrites
every baseline, so review the resulting images before committing them.

CI (`.github/workflows/ci.yml`) runs exactly these commands, so a change that passes
locally passes there.

## Conventions

- TypeScript `strict` is on. Do not add `any` to silence the compiler; do not add
  `@ts-ignore`.
- 4-space indent, double quotes, semicolons (see `.editorconfig`).
- Prefer `import type` for type-only imports.
- Scenes must be self-contained: no cross-imports between files in `src/scenes/`
  except `src/scenes/index.ts`.
- Dispose what you create if a scene sets up observers, listeners or resources
  outside the `Scene` object.
- Do not add a UI framework, bundler or state library to this template.

## Gotchas

- `window.scene` is set in `src/index.ts` purely so the Playwright tests can await
  `scene.isReady()`. Do not build features on top of it.
- Physics and navmesh scenes depend on wasm modules loaded via `preTasks`; awaiting
  them is the entry point's job, not the scene's.
- Headless Chromium has no WebGPU unless it is launched with `--enable-unsafe-webgpu`;
  `playwright.config.ts` does this. Without it the app falls back to WebGL and a "WebGPU"
  test would quietly be testing WebGL - the validation spec asserts the engine in use to
  catch exactly that.
