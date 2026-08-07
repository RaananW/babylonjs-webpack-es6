import type { Scene } from "@babylonjs/core/scene";

declare global {
    /** Replaced by webpack; false in production and Playwright builds. */
    const __DEV_CONTROLS__: boolean;

    interface Window {
        /** Exposed by `src/index.ts` for the Playwright validation tests only. */
        scene?: Scene;
    }
}

export {};
