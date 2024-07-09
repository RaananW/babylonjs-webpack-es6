import * as createSceneModule from './createScene';

describe('createScene module', () => {
    test('getSceneModuleWithName should return the default scene if nothing is passed', async () => {
        const result = createSceneModule.getSceneModule();
        expect(result.createScene).not.toBeFalsy();
    });
});