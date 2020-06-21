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
        external: ['effector', 'react', '@common'],
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
            })
        ],
    },
    {
        input: "src/dom/index.ts",
        output: {
            file: "./dom/index.js",
            format: "esm"
        },
        external: ['effector', '@common'],
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
            })
        ],
    },
    {
        input: "src/view/index.ts",
        output: {
            file: "./react-bundle/index.js",
            format: "esm"
        },
        external: ['effector', 'effector-react', 'react', '@common', '@dist'],
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
            })
        ],
    },
    {
        input: "src/common/index.ts",
        output: {
            file: "./common/index.js",
            format: "esm"
        },
        plugins:
        [
            resolve({
                extensions: ['.tsx', '.ts', '.js']
            }),
            babel({
                babelHelpers: 'runtime',
                exclude: 'node_modules/**',
                extensions: ['.ts', '.tsx']
            })
        ],
    }
]