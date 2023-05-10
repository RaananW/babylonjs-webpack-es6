import * as createSceneModule from './createScene';

describe('createScene module', () => {
    test('getSceneModuleWithName should return the default scene if nothing is passed', async () => {
        const result = await createSceneModule.getSceneModuleWithName();
        expect(result.createScene).not.toBeFalsy();
    });
    test('getSceneModuleWithName should throw is incorrect name was passed', async () => {
        try {
            await createSceneModule.getSceneModuleWithName("this scene doesn't exist");
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });
    test('getSceneModuleWithName should return a scene if an existing scene name was provided', async () => {
        const result = await createSceneModule.getSceneModuleWithName("defaultWithTexture");
        expect(result.createScene).not.toBeFalsy();
    });
});