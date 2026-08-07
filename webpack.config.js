const path = require("path");
const fs = require("fs");
const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// App directory
const appDirectory = fs.realpathSync(process.cwd());

/**
 * Single webpack configuration for every mode this template supports:
 *
 *   webpack serve                 -> dev server, hot reload, opens a browser
 *   webpack serve --env test      -> dev server for Playwright (no hot reload, no browser)
 *   webpack --env production      -> minified production bundle
 *   webpack                       -> unminified development bundle
 */
module.exports = (env = {}) => {
    const isProduction = !!env.production;
    const isTest = !!env.test;

    return {
        mode: isProduction ? "production" : "development",
        devtool: isProduction ? "source-map" : "inline-source-map",
        entry: path.resolve(appDirectory, "src/index.ts"),
        output: {
            filename: "js/[name].js",
            path: path.resolve("./dist/"),
            chunkFilename: "js/[name].[contenthash].js",
            clean: true,
        },
        resolve: {
            extensions: [".ts", ".js"],
            fallback: {
                fs: false,
                path: false, // require.resolve("path-browserify")
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    loader: "source-map-loader",
                    enforce: "pre",
                },
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    // sideEffects: true
                },
                {
                    test: /\.(glsl|vs|fs)$/,
                    loader: "ts-shader-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|jpg|gif|env|glb|gltf|stl)$/i,
                    type: "asset",
                    parser: {
                        dataUrlCondition: {
                            maxSize: 8192,
                        },
                    },
                },
            ],
        },
        plugins: [
            new DefinePlugin({
                __DEV_CONTROLS__: JSON.stringify(!isProduction && !isTest),
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(appDirectory, "public/index.html"),
            }),
        ],
        optimization: {
            splitChunks: {
                // `chunks: "initial"` keeps code that only a lazily-loaded scene needs out of
                // the initial payload. Modules shared between scenes are still deduplicated
                // into a shared async chunk by webpack's default cache group.
                cacheGroups: {
                    webgpuShaders: {
                        name: "webgpu-shaders",
                        chunks: "initial",
                        priority: 50,
                        enforce: true,
                        test: (module) => /\/ShadersWGSL\//.test(module.resource),
                    },
                    webglShaders: {
                        name: "webgl-shaders",
                        chunks: "initial",
                        priority: 50,
                        enforce: true,
                        test: (module) => /\/Shaders\//.test(module.resource),
                    },
                    webgpuExtensions: {
                        name: "webgpu-extensions",
                        chunks: "initial",
                        priority: 50,
                        enforce: true,
                        test: (module) => /\/WebGPU\//.test(module.resource),
                    },
                    babylonBundle: {
                        name: "babylonBundle",
                        chunks: "initial",
                        priority: 30,
                        reuseExistingChunk: true,
                        test: (module) => /\/node_modules\/@babylonjs\//.test(module.resource),
                    },
                },
            },
            usedExports: true,
            // Minifying development builds only makes them slow to produce and hard to debug.
            minimize: isProduction,
        },
        devServer: {
            static: path.resolve(appDirectory, "public"),
            compress: true,
            // The Playwright tests want a plain static server: no hot reload, no live-reload
            // websocket and no browser window, so runs stay deterministic.
            hot: !isTest,
            open: !isTest,
            webSocketServer: isTest ? false : undefined,
            // host: '0.0.0.0', // enable to access from other devices on the network
            // https: true // enable when HTTPS is needed (like in WebXR)
        },
    };
};
