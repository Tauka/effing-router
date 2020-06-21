import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";

export default [
    {
        input: "src/core/index.ts",
        output: {
            file: "./dist/index.js",
            format: "esm"
        },
        external: ['effector', 'react'],
        plugins:
        [
            resolve({
                extensions: ['.ts', '.js']
            }),
            commonjs(),
            babel({
                babelHelpers: 'runtime',
                exclude: 'node_modules/**',
                extensions: ['.ts', '.tsx']
            }),
            terser()
        ],
    },
    {
        input: "src/dom/index.ts",
        output: {
            file: "./dom/index.js",
            format: "esm"
        },
        external: ['effector'],
        plugins:
        [
            resolve({
                extensions: ['.ts', '.js']
            }),
            commonjs(),
            babel({
                babelHelpers: 'runtime',
                exclude: 'node_modules/**',
                extensions: ['.ts', '.tsx']
            }),
            terser()
        ],
    },
    {
        input: "src/view/index.ts",
        output: {
            file: "./react/index.js",
            format: "esm"
        },
        external: ['effector', 'effector-react', 'react'],
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
]