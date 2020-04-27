import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import image from '@rollup/plugin-image';
import {terser} from 'rollup-plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default {
    input: './src/index.ts',
    output: {
        dir: 'rollupDist'
    },
    plugins: [typescript(),
        image(),
        resolve(),
        terser()
    ]
};