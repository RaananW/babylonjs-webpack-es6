import { defaultSceneName, resolveSceneName, sceneNames, sceneRegistry } from './scenes';

describe('scene registry', () => {
    test('exposes at least one scene, all of them lazy loaders', () => {
        expect(sceneNames.length).toBeGreaterThan(0);
        for (const name of sceneNames) {
            expect(typeof sceneRegistry[name].load).toBe("function");
            expect(sceneRegistry[name].title.length).toBeGreaterThan(0);
        }
    });

    test('the default scene is registered', () => {
        expect(sceneNames).toContain(defaultSceneName);
    });

    test('resolveSceneName returns the default scene for missing or unknown names', () => {
        expect(resolveSceneName()).toBe(defaultSceneName);
        expect(resolveSceneName(null)).toBe(defaultSceneName);
        expect(resolveSceneName('doesNotExist')).toBe(defaultSceneName);
        expect(resolveSceneName('constructor')).toBe(defaultSceneName);
    });

    test('resolveSceneName keeps registered names', () => {
        for (const name of sceneNames) {
            expect(resolveSceneName(name)).toBe(name);
        }
    });
});
