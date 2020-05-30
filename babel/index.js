const base = require('./base');
const moduleResolverExtension = require('./moduleResolverExtension');

module.exports = {
  ...base,
  env: {
    dev: {
      ...moduleResolverExtension(base, 'js'),
    }
  }
}