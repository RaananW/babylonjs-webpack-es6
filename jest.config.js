module.exports = {
    coverageProvider: "v8",
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|less|gltf|glb|obj|stl)$":
            "<rootDir>/__mocks__/assetFileMock.js",
    },
    preset: "ts-jest/presets/default-esm",
    testMatch: ["**/?(*.)(unit.)+(spec|test).[tj]s?(x)"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
    },
};
