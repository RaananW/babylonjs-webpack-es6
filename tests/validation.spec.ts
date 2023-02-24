import { test, expect, } from '@playwright/test';

const scenes = [
  {
    name: 'Default',
    url: '/?scene=defaultWithTexture',
  },
  {
    name: 'Fresnel Shader',
    url: '/?scene=fresnelShader',
  },
  {
    name: 'Load model and env',
    url: '/?scene=loadModelAndEnv',
  },
  {
    name: 'Navigation mesh recast',
    url: '/?scene=navigationMeshRecast',
  },
  // {
  //   name: 'Physics (ammo)',
  //   url: '/?scene=physicsWithAmmo',
  //   renderCount: 5,
  // },
]

const engines = [
  "WebGL2",
  // "WebGPU"
]

for (const scene of scenes) {
  for (const engine of engines) {
    test(`Render ${scene.name} with ${engine}`, async ({ page }, testInfo) => {
      await page.goto(scene.url);
      if (scene.renderCount) {
        await page.evaluate(() => {
          const raf = window.requestAnimationFrame;
          (window as any).renderCount = 0;
          window.requestAnimationFrame = (cb: FrameRequestCallback) => {
            (window as any).renderCount++;
            return raf(cb);
          }
        });
        
      }
      await page.waitForFunction(() => (window as any).scene && (window as any).scene.isReady(), { timeout: 5000 });
      // reset render count
      await page.evaluate(() => {
        (window as any).renderCount = 0;
      });
      // await page.waitForFunction(() => (window as any).renderCount === scene.renderCount || 1, { timeout: 5000 });
      await expect(page).toHaveScreenshot({
        timeout: 0,
      });
      expect(testInfo.stderr).toHaveLength(0);
    });
  }
}

