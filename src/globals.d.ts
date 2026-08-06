import type { Scene } from "@babylonjs/core/scene";

declare global {
    interface Window {
        /** Exposed by `src/index.ts` for the Playwright validation tests only. */
        scene?: Scene;
    }
}

export {};
