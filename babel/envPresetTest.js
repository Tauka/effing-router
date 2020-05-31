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
    ]
  }
}