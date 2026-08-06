# Babylon.js, webpack and es6 modules

A Babylon.js sample project using typescript, latest babylon.js es6 core module, webpack 4 with webpack dev server, hot loading, eslint, vscode support and more.

## Before getting started

This is a basic demo using Babylon's core module only. It is based on the [Getting started guide](https://doc.babylonjs.com/) at the documentation page. A lot of the engine's features are **not** covered here. I will slowly add more and more projects and more examples.

If you have any questions, you are very much invited to the [Babylon.js forum](https://forum.babylonjs.com) where I am hanging around almost daily.

## Getting started

To run the basic scene:

1. Clone / download this repository
2. run `npm install` to install the needed dependencies.
3. run `npm start`
4. A new window should open in your default browser. if it doesn't, open `http://localhost:8080`
5. ????
6. Profit

Running `npm start` will start the webpack dev server with hot-reloading turned on. Open your favorite editor (mine is VSCode, but you can use nano. we don't discriminate) and start editing.

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

1. Create `./src/scenes/myScene.ts`, exporting a class implementing `CreateSceneClass`
   as the default export (copy any existing scene as a starting point).
2. Register it by adding one line to `./src/scenes/index.ts`:

```ts
myScene: () => import("./myScene"),
```

3. Open `http://localhost:8080/?scene=myScene`.

Each registry entry is a dynamic `import()`, so webpack emits a separate chunk per scene
and only the scene you request is downloaded.

## WebGPU? yes please

Open the URL in a WebGPU-enabled browser and add `engine=webgpu` to the URL:
`http://localhost:8080/?engine=webgpu`. It combines with `scene`:

```
http://localhost:8080/?scene=fresnelShader&engine=webgpu
```

If WebGPU is not supported by the browser, the template silently falls back to WebGL.

## Running validation tests

It is possible to run validation tests to the scenes using playwright. To run the tests, run `npm run test:visuals`. This will run the tests in headless mode.
To configure the tests see the `/tests/` directory, and the `validation.spec.ts` file.

To generate the snapshots after adjusting the tests you can run `npm run test:visuals -- --update-snapshots`. This will auto-generate the snapshots for the tests.

## Unit tests

To run the unit tests, run `npm run test:unit`. This will run the tests in headless mode.
To add new tests, add a file anywhere in the source folder, called `FILENAME.unit.spec.ts`. The tests will be automatically picked up by jest.

## What else can I do

To lint your source code run `npm run lint`

To build the bundle in order to host it, run `npm run build`. This will bundle your code in production mode, meaning is will minify the code.

Building will take some time, as it compiles every sample (and emits a separate chunk for each). If you want to speed up the process, remove the scenes you don't need from `./src/scenes/` and from the registry in `./src/scenes/index.ts`.

## Working with AI agents

This template ships with instructions for AI coding assistants:

- `AGENTS.md` - the full guide: project layout, how to add a scene, the Babylon.js ES6
  deep-import and side-effect-import rules, commands, conventions and gotchas.
- `.github/copilot-instructions.md` - a short version automatically picked up by GitHub Copilot.

Because scenes are declared in a single registry (`./src/scenes/index.ts`) and every scene
implements the same `CreateSceneClass` contract, "add a scene that does X" is a one-file +
one-line change that an agent can perform reliably. If you fork this template for your own
project, keep `AGENTS.md` updated - it is the cheapest way to keep assistants productive.

## What is this

That's an abstract question! What is which one of those wonderful things?

Babylon.js is [the world's leading WebGL engine](https://babylonjs.com) that starts with a 'b'. You should give it a try and leave those other numbers and letters behind. To read more about it and see some amazing samples, go to the [Babylon.js website](https://babylonjs.com), [Babylon's Playground](https://playground.babylonjs.com) or [Babylon's documentation](https://doc.babylonjs.com).

The rest? You should know already, this is why you are here.

## What is covered

- Latest typescript version
- Simple texture loading (using url-loader)
- dev-server will start on command (webpack-dev-server)
- A working core-only example of babylon
- Full debugging with any browser AND VS Code
- (production) bundle builder.
- eslint default typescript rules integrated
- A scene registry with lazy-loaded scenes, selectable via `?scene=`
- WebGPU support with automatic WebGL fallback (`?engine=webgpu`)
- AI-agent friendly: see `AGENTS.md` and `.github/copilot-instructions.md`

## It takes too long to build

To speed up production build time, remove all of the scenes except for the one you want to build (delete the file and its line in `./src/scenes/index.ts`).
This project is meant as a way to show different ways to use Babylon.js and not as a way to efficiently build a production-ready application.
