import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
    input: "src/index.js",
    output: {
        file: "rollup-dist/index.js",
        format: "esm"
    },
    external: ["lodash"],
    plugins:
    [
        babel({ runtimeHelpers: true }),
        terser()
    ],
}