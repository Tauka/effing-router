module.exports = (babelConfig) => {
  return {
    ...babelConfig,
    presets: [
      [
        '@babel/env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      '@babel/preset-react',
      "@babel/typescript",
    ],
    plugins: 
    [
      '@babel/plugin-transform-runtime',
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      ["module-resolver", {
        "root": ["./"],
        "alias": {
          "^@core/(.+)": "./src/core/\\1",
          "@core": "./src/core/index.ts",
          "@lib": "./src/lib.ts",
          "@dist": "./src/core/index.ts",
          "@common": "./src/common/index.ts",
        }
      }]
    ]
  }
}