const base = require('./base');
const moduleResolverExtension = require('./moduleResolverExtension');
const envPresetTest = require('./envPresetTest');

module.exports = {
  ...base,
  env: {
    dev: {
      ...moduleResolverExtension(base, 'js'),
    },
    test: {
      ...envPresetTest(base)
    }
  }
}