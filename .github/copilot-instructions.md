# GitHub Copilot instructions

This repository is a Babylon.js + TypeScript + webpack (ES6 modules) starter template.

The full contributor guide for AI agents lives in [`AGENTS.md`](../AGENTS.md) - read it
before making changes. The essentials:

- **Add a scene** by creating `src/scenes/<name>.ts` (default-exporting an instance of a
  class implementing `CreateSceneClass`) and registering it in `src/scenes/index.ts`.
  Load it with `?scene=<name>`. Never switch scenes by editing imports.
- **Import Babylon from deep paths** (`@babylonjs/core/scene`), never from the package
  root, and remember side-effect imports (`import "@babylonjs/core/Culling/ray";`) for
  features that register themselves.
- **Verify** with `npm run verify` (lint + typecheck + unit tests); add `npm run build` when
  touching `webpack.config.js`, asset imports or dependencies.
- TypeScript `strict` is on: no `any`, no `@ts-ignore`.
- Keep `src/index.ts` thin; engine concerns belong in `src/createEngine.ts`.
