// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json';

const plugins = [
    typescript({
        tsconfig: './tsconfig.json',
    }),
];
const input = 'src/VideoWorker.ts';

export default [
    {
        input,
        output: {file: pkg.main, format: 'cjs', sourcemap: true},
        plugins,
    },
]