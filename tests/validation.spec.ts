import { test, expect } from "@playwright/test";

/**
 * Scene names as registered in `src/scenes/index.ts`.
 */
const scenes: {
    name: string;
    scene: string;
    waitForNetworkIdle?: boolean;
}[] = [
    {
        name: "Default",
        scene: "defaultWithTexture",
    },
    {
        name: "Fresnel Shader",
        scene: "fresnelShader",
    },
    {
        name: "Load model and env",
        scene: "loadModelAndEnv",
    },
    {
        name: "Navigation mesh recast",
        scene: "navigationMeshRecast",
        waitForNetworkIdle: true,
    },
    // {
    //   name: 'Physics (ammo)',
    //   scene: 'physicsWithAmmo',
    // },
];

const engines = [
    { name: "WebGL2", query: "webgl" },
    { name: "WebGPU", query: "webgpu" },
];

for (const scene of scenes) {
    for (const engine of engines) {
        test(`Render ${scene.name} with ${engine.name}`, async ({
            page,
        }, testInfo) => {
            await page.goto(`/?scene=${scene.scene}&engine=${engine.query}`);
            if (scene.waitForNetworkIdle) {
                await page.waitForLoadState("networkidle");
            }
            await page.waitForFunction(
                () => window.scene && window.scene.isReady(),
                { timeout: 30000 }
            );

            // The app falls back to WebGL when WebGPU is unavailable. Without this check a
            // "WebGPU" run would silently render - and be compared against - WebGL output.
            const usingWebGPU = await page.evaluate(
                () => window.scene!.getEngine().isWebGPU
            );
            test.skip(
                engine.query === "webgpu" && !usingWebGPU,
                "WebGPU is not available in this browser"
            );
            expect(usingWebGPU).toBe(engine.query === "webgpu");

            await expect(page).toHaveScreenshot({
                timeout: 0,
            });
            expect(testInfo.errors).toHaveLength(0);
        });
    }
}
