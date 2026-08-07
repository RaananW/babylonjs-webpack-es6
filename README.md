# Babylon.js, TypeScript and webpack

A small Babylon.js starter using tree-shakable ES modules, strict TypeScript,
webpack 5, hot reload, WebGL/WebGPU, automated tests and GitHub Actions.

## Before getting started

This is a starter plus a focused set of examples. It intentionally has no UI framework,
router or state library. Babylon features are imported from deep ES-module paths so unused
code can be tree-shaken.

If you have any questions, you are very much invited to the [Babylon.js forum](https://forum.babylonjs.com) where I am hanging around almost daily.

## Getting started

Node.js 22.13 or newer (excluding Node 23), or Node.js 24+, is required. To run the basic scene:

1. Clone / download this repository
2. Run `npm install` to install the dependencies.
3. Run `npm start`.
4. A new window should open in your default browser. if it doesn't, open `http://localhost:8080`

Running `npm start` will start the webpack dev server with hot-reloading turned on. Open your favorite editor (mine is VSCode, but you can use nano. we don't discriminate) and start editing.

Development builds show a small scene/engine picker in the top-right corner. It is generated
from the scene registry and is removed from production and test builds.

The entry point for the entire TypeScript application is `./src/index.ts`. It resolves the requested scene and engine from the URL, and stays intentionally small - engine creation lives in `./src/createEngine.ts`, and scene loading in `./src/createScene.ts` + `./src/scenes/index.ts`.

To debug, open the browser's dev tool. Source maps are ready to be used. In case you are using VSCode, simply run the default debugger task (`Launch Chrome against localhost`) while making sure `npm start` is still running. This will allow you to debug your application straight in your editor.

## Loading different examples

The `./src/scenes` directory contains a few examples of scenes. Every scene is listed in
the **scene registry** at `./src/scenes/index.ts`, and the active scene is chosen with the
`scene` query parameter - no source changes needed:

```
http://localhost:8080/?scene=physicsWithAmmo
```

If the parameter is missing or unknown, the default scene (`defaultWithTexture`) is loaded.

### Adding your own scene

1. Create `./src/scenes/myScene.ts`, exporting an instance implementing `CreateSceneClass`
   as the default export (copy any existing scene as a starting point).
2. Register it in `./src/scenes/index.ts`:

```ts
myScene: {
    title: "My scene",
    load: () => import("./myScene"),
    visualTest: {}, // Optional: enables screenshot coverage.
},
```

3. Open `http://localhost:8080/?scene=myScene`.

Each registry entry contains a dynamic `import()`, so webpack emits a separate chunk per scene
and only the scene you request is downloaded.

## WebGPU? yes please

Open the URL in a WebGPU-enabled browser and add `engine=webgpu` to the URL:
`http://localhost:8080/?engine=webgpu`. It combines with `scene`:

```
http://localhost:8080/?scene=fresnelShader&engine=webgpu
```

If WebGPU is not supported, the template falls back to WebGL and logs a clear warning.
The WebGPU engine itself is lazily downloaded only when requested.

## Running validation tests

Run `npm run test:visuals` to validate scenes with Playwright. The test reads directly from
`src/scenes/index.ts`, so every registered scene is smoke-tested on WebGL2 and WebGPU.
Registry entries with `visualTest` also receive screenshot regression coverage; omit it for
non-deterministic scenes such as physics simulations.

Both engines are really exercised: the test asserts that the engine actually in use
matches the one it asked for, so a WebGPU run can no longer silently fall back to WebGL.

**Snapshots are shared across operating systems.** Chromium is launched with SwiftShader
(software rendering) in `playwright.config.ts`, which makes renders reproducible on any
machine regardless of GPU - and is also what makes WebGPU available in headless Chromium
at all. A single set of baselines in `tests/validation.spec.ts-snapshots/` therefore works
on Linux, macOS and Windows alike, with a small `maxDiffPixelRatio` tolerance for the
remaining noise.

To refresh the baselines after intentionally changing a scene:

- Locally: `npm run test:visuals -- --update-snapshots`.
- On CI: run the **Update visual snapshots** workflow
  (`.github/workflows/update-snapshots.yml`) from the Actions tab, picking the branch to
  update. It regenerates the snapshots and commits them to that branch.

## Unit tests

To run the unit tests, run `npm run test:unit`. This will run the tests in headless mode.
To add new tests, add a file anywhere in the source folder, called `FILENAME.unit.spec.ts`. The tests will be automatically picked up by jest.

## What else can I do

| Command | What it does |
| --- | --- |
| `npm start` | Dev server with hot reload on `http://localhost:8080`. |
| `npm run build` | Production (minified) bundle into `dist/`. |
| `npm run build:demo` | Production bundle with the scene/engine picker for the hosted demo. |
| `npm run build:dev` | Unminified development bundle into `dist/`. |
| `npm run lint` | ESLint over all TypeScript files. |
| `npm run typecheck` | `tsc --noEmit`, no build output. |
| `npm run test:unit` | Jest unit tests. |
| `npm run test:visuals` | Playwright screenshot tests. |
| `npm run verify` | lint + typecheck + unit tests, the quick pre-commit check. |

All of these are driven by a single `webpack.config.js`, which switches behaviour through
`--env` (`--env production` for the production build, `--env test` for the static server the
Playwright tests run against).

Every push and pull request runs lint, typecheck, unit tests, a production build and the
visual tests through GitHub Actions (`.github/workflows/ci.yml`).

## Deploying to GitHub Pages

The optional **Deploy to GitHub Pages** workflow builds and publishes `dist/` without requiring
any local deployment tooling. The hosted demo retains the scene/engine picker so visitors can
explore every registered example:

1. In the repository settings, open **Pages** and select **GitHub Actions** as the source.
2. Open **Actions → Deploy to GitHub Pages → Run workflow**.

The workflow is manual so forks do not unexpectedly publish on every push. Run it again whenever
you want to update the deployed site.

Building will take some time, as it compiles every sample (and emits a separate chunk for each). If you want to speed up the process, remove the scenes you don't need from `./src/scenes/` and from the registry in `./src/scenes/index.ts`.

## Working with AI agents

This template ships with instructions for AI coding assistants:

- `AGENTS.md` - the full guide: project layout, how to add a scene, the Babylon.js ES6
  deep-import and side-effect-import rules, commands, conventions and gotchas.
- `.github/copilot-instructions.md` - a short version automatically picked up by GitHub Copilot.

Because scenes are declared in a single registry (`./src/scenes/index.ts`) and every scene
implements the same `CreateSceneClass` contract, "add a scene that does X" is a predictable
one-file plus one-registry-entry change. If you fork this template for your own
project, keep `AGENTS.md` updated - it is the cheapest way to keep assistants productive.

## What is this

That's an abstract question! What is which one of those wonderful things?

Babylon.js is [the world's leading WebGL engine](https://babylonjs.com) that starts with a 'b'. You should give it a try and leave those other numbers and letters behind. To read more about it and see some amazing samples, go to the [Babylon.js website](https://babylonjs.com), [Babylon's Playground](https://playground.babylonjs.com) or [Babylon's documentation](https://doc.babylonjs.com).

The rest? You should know already, this is why you are here.

## What is covered

- Strict TypeScript 6 (held below 6.1 until the ESLint tooling supports newer majors)
- Simple texture loading (using webpack asset modules)
- dev-server will start on command (webpack-dev-server)
- A working core-only example of babylon
- Full debugging with any browser AND VS Code
- (production) bundle builder.
- eslint default typescript rules integrated
- GitHub Actions CI (lint, typecheck, unit tests, build, visual regression)
- A scene registry with lazy-loaded scenes, selectable via `?scene=`
- WebGPU support with automatic WebGL fallback (`?engine=webgpu`)
- AI-agent friendly: see `AGENTS.md` and `.github/copilot-instructions.md`

The Inspector is intentionally not installed by default because it adds a large editor UI and
its dependencies to every install. Add it when needed with
`npm install @babylonjs/inspector`, then load it dynamically alongside
`@babylonjs/core/Debug/debugLayer`.

## It takes too long to build

To speed up production build time, remove all of the scenes except for the one you want to build (delete the file and its line in `./src/scenes/index.ts`).
This project is meant as a way to show different ways to use Babylon.js and not as a way to efficiently build a production-ready application.
