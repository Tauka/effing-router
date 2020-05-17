const compattable = require('core-js-compat')

console.log(compattable({
    targets:
      'last 2 Chrome versions, last 2 Firefox versions, last 2 Edge versions, last 2 Opera versions, last 2 iOS version, last 2 safari version',
    filter: /^(es|web)\./
  }).targets)