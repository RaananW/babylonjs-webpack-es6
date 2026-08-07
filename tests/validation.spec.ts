import { test, expect } from "@playwright/test";
import {
    sceneNames,
    sceneRegistry,
    type SceneDefinition,
} from "../src/scenes";

const engines = [
    { name: "WebGL2", query: "webgl" },
    { name: "WebGPU", query: "webgpu" },
] as const;

for (const sceneName of sceneNames) {
    const scene: SceneDefinition = sceneRegistry[sceneName];
    for (const engine of engines) {
        const action = scene.visualTest ? "Render" : "Load";
        test(`${action} ${scene.title} with ${engine.name}`, async ({ page }) => {
            const pageErrors: Error[] = [];
            page.on("pageerror", (error) => pageErrors.push(error));

            await page.goto(`/?scene=${sceneName}&engine=${engine.query}`);
            if (scene.visualTest?.waitForNetworkIdle) {
                await page.waitForLoadState("networkidle");
            }
            await page.waitForFunction(
                () => window.scene && window.scene.isReady(),
                { timeout: 30000 }
            );

            const usingWebGPU = await page.evaluate(
                () => window.scene!.getEngine().isWebGPU
            );
            test.skip(
                engine.query === "webgpu" && !usingWebGPU,
                "WebGPU is not available in this browser"
            );
            expect(usingWebGPU).toBe(engine.query === "webgpu");

            if (scene.visualTest) {
                await expect(page).toHaveScreenshot({ timeout: 0 });
            }
            expect(pageErrors).toEqual([]);
        });
    }
}
