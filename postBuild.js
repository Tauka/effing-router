const fs = require('fs');
const glob = require("glob")

const effingRouterKey = '9yua0xKsSi';
const routeListToObjectKey = 'XtR6HOaxz1';

const REPLACE_MAP = {
  [effingRouterKey]: '../dist',
  [routeListToObjectKey]: '../common/routeListToObject.js'
}

const REACT_BUNDLE_PATH = './react-bundle/index.js';
const CORE_BUNDLE_PATH = './dist/index.js';
const DOM_BUNDLE_PATH = './dom/index.js';

const reactBundle = fs.readFileSync(REACT_BUNDLE_PATH, 'utf-8');
const coreBundle = fs.readFileSync(CORE_BUNDLE_PATH, 'utf-8');
const domBundle = fs.readFileSync(DOM_BUNDLE_PATH, 'utf-8');


fs.writeFileSync(REACT_BUNDLE_PATH, reactBundle
  .replace(effingRouterKey, REPLACE_MAP[effingRouterKey])
  .replace(routeListToObjectKey, REPLACE_MAP[routeListToObjectKey]));
fs.writeFileSync(CORE_BUNDLE_PATH, coreBundle.replace(routeListToObjectKey, REPLACE_MAP[routeListToObjectKey]));
fs.writeFileSync(DOM_BUNDLE_PATH, domBundle.replace(routeListToObjectKey, REPLACE_MAP[routeListToObjectKey]));
fs.renameSync('./react-bundle', './react');

glob("dom/**/*.d.ts", (err, files) => {
  if(err)
    throw err;

  files.forEach(filename =>
  {
    const fileContent = fs.readFileSync(filename, 'utf-8');
    fs.writeFileSync(filename, fileContent.replace('/core/', '/dist/core/'))
  })
})

glob("react/**/*.d.ts", (err, files) => {
  if(err)
    throw err;

  files.forEach(filename =>
  {
    const fileContent = fs.readFileSync(filename, 'utf-8');
    fs.writeFileSync(filename, fileContent.replace('/core/', '/dist/core/'))
  })
})

glob("common/**/*.d.ts", (err, files) => {
  if(err)
    throw err;

  files.forEach(filename =>
  {
    const fileContent = fs.readFileSync(filename, 'utf-8');
    fs.writeFileSync(filename, fileContent.replace('/core/', '/dist/core/'))
  })
})