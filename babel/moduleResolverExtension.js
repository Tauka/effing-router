module.exports = (babelConfig, extension) => {
  const { plugins } = babelConfig;

  let moduleResolverPluginTuple = null;
  plugins.forEach((plugin, index) => {
    if(Array.isArray(plugin) && plugin[0] === "module-resolver")
      moduleResolverPluginTuple = [plugin, index];
  })

  if(!moduleResolverPluginTuple)
    return babelConfig;

  const newPlugins = [ ...babelConfig.plugins ]
  newPlugins[moduleResolverPluginTuple[1]] = [
    'module-resolver',
    {
      ...moduleResolverPluginTuple[0][1],
      alias: {
        ...moduleResolverPluginTuple[0][1].alias,
        "@core": `./src/core/index.${extension}`,
				"@lib": `./src/lib.${extension}`,
      }
    }
  ]

  return {
    ...babelConfig,
    plugins: newPlugins
  }
}