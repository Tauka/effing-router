import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

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
        typescript({
            typescript: require('ttypescript'),
            tsconfigDefaults: {
                compilerOptions: {
                    plugins: [
                        { "transform": "typescript-transform-paths" },
                        { "transform": "typescript-transform-paths", "afterDeclarations": true }
                    ]
                }
            }
        })
    ],
}