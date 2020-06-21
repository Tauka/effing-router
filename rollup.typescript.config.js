import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default [
    {
        input: "src/core/index.ts",
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
            typescript({
                typescript: require('ttypescript'),
                tsconfigDefaults: {
                    compilerOptions: {
                        plugins: [
                            { "transform": "typescript-transform-paths" },
                            { "transform": "typescript-transform-paths", "afterDeclarations": true }
                        ]
                    }
                },
                tsconfig: "tsconfig.json"
            })
        ],
    },
    {
        input: "src/view/index.ts",
        output: {
            file: "react-bundle/index.js",
            format: "esm"
        },
        external: ['effector', 'effector-react', 'react', '@babel/runtime-corejs3'],
        plugins:
        [
            resolve({
                extensions: ['.tsx', '.ts', '.js']
            }),
            commonjs(),
            typescript({
                typescript: require('ttypescript'),
                tsconfigDefaults: {
                    compilerOptions: {
                        plugins: [
                            { "transform": "typescript-transform-paths" },
                            { "transform": "typescript-transform-paths", "afterDeclarations": true }
                        ]
                    }
                },
                tsconfig: "tsconfig/tsconfig.view.json"
            })
        ],
    },
    {
        input: "src/dom/index.ts",
        output: {
            file: "dom/index.js",
            format: "esm"
        },
        external: ['effector', 'effector-react', 'react', '@babel/runtime-corejs3'],
        plugins:
        [
            resolve({
                extensions: ['.tsx', '.ts', '.js']
            }),
            commonjs(),
            typescript({
                typescript: require('ttypescript'),
                tsconfigDefaults: {
                    compilerOptions: {
                        plugins: [
                            { "transform": "typescript-transform-paths" },
                            { "transform": "typescript-transform-paths", "afterDeclarations": true }
                        ]
                    }
                },
                tsconfig: "tsconfig/tsconfig.dom.json"
            })
        ],
    },
    {
        input: "src/common/routeListToObject.ts",
        output: {
            file: "common/routeListToObject.js",
            format: "esm"
        },
        external: ['effector', 'effector-react', 'react', '@babel/runtime-corejs3'],
        plugins:
        [
            resolve({
                extensions: ['.tsx', '.ts', '.js']
            }),
            commonjs(),
            typescript({
                typescript: require('ttypescript'),
                tsconfigDefaults: {
                    compilerOptions: {
                        plugins: [
                            { "transform": "typescript-transform-paths" },
                            { "transform": "typescript-transform-paths", "afterDeclarations": true }
                        ]
                    }
                },
                tsconfig: "tsconfig/tsconfig.common.json"
            })
        ],
    }
]