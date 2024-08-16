const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// App directory
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: path.resolve(appDirectory, "src/index.ts"),
    output: {
        filename: "js/[name].js",
        path: path.resolve("./dist/"),
        chunkFilename: "js/[name].[contenthash].js",
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
                test: /\.m?js/,
            },
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
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(appDirectory, "public/index.html"),
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                webgpuShaders: {
                    name: "webgpu-shaders",
                    chunks: "all",
                    priority: 50,
                    enforce: true,
                    test: (module) => /\/ShadersWGSL\//.test(module.resource),
                },
                webglShaders: {
                    name: "webgl-shaders",
                    chunks: "all",
                    priority: 50,
                    enforce: true,
                    test: (module) => /\/Shaders\//.test(module.resource),
                },
                webgpuExtensions: {
                    name: "webgpu-extensions",
                    chunks: "all",
                    priority: 50,
                    enforce: true,
                    test: (module) => /\/WebGPU\//.test(module.resource),
                },
                babylonBundle: {
                    name: "babylonBundle",
                    chunks: "all",
                    priority: 30,
                    reuseExistingChunk: true,
                    test: (module) => /\/node_modules\/@babylonjs\//.test(module.resource),
                },
            },
        },
        usedExports: true,
        minimize: true,
    },
};
