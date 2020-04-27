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

The entry point for the entire TypeScript application is `./src/index.ts`. Any other file imported in this file will be included in the build.

To debug, open the browser's dev tool. Source maps are ready to be used. In case you are using VSCode, simply run the default debugger task (`Launch Chrome against localhost`) while making sure `npm start` is still running. This will allow you to debug your application straight in your editor.

## Loading different examples

The `./src/scenes` directory contains a few examples of scenes that can be loaded. To load a specific scene, add a `?scene=FILENAME` to the URL (i.e. to load the ammo physics demo, use `http://localhost:8080/?scene=physicsWithAmmo`).

More and more scenes will be slowly added.

## What else can I do

To lint your source code run `npm run lint`

To build the bundle in order to host it, run `npm run build`. This will bundle your code in production mode, meaning is will minify the code.

Building will take some time, as it will build each sample (and create a different module for each). If you want to speed up the process, define the scene you want to render in `createScene.ts` (you can see the comment there)

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
