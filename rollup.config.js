import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/index.js",
        format: "esm"
    },
    external: ['effector', 'effector-react', 'react', '@babel/runtime-corejs3'],
    plugins:
    [
        resolve({
            extensions: ['.tsx', '.ts', '.js']
        }),
        commonjs(),
        babel({
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
            extensions: ['.ts', '.tsx']
        }),
        terser()
    ],
}