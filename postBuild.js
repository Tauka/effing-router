const fs = require('fs-extra');
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

const coreDts = glob.sync("dist/**/*.d.ts")
coreDts.forEach(filename =>
{
  const fileContent = fs.readFileSync(filename, 'utf-8');
  if(filename.includes('dist/core/'))
  {
    const upperDir = filename.replace('dist/core/', 'dist/');
    fs.ensureFileSync(upperDir);
    fs.writeFileSync(
      upperDir, // move to upper directory
      fileContent
    )
  }
})

const domDts = glob.sync("dom/**/*.d.ts")
domDts.forEach(filename =>
{
  const fileContent = fs.readFileSync(filename, 'utf-8');
  if(filename.includes('dom/dom/')) {
    const upperDir = filename.replace('dom/dom/', 'dom/');
    fs.ensureFileSync(upperDir);
    fs.writeFileSync(
      upperDir, // move to upper directory
      fileContent.replace('/core/', '/dist/core/'))
  } else {
    fs.writeFileSync(filename, fileContent.replace('/core/', '/dist/core/'))
  }
})

const reactDts = glob.sync("react/**/*.d.ts");
reactDts.forEach(filename =>
  {
    const fileContent = fs.readFileSync(filename, 'utf-8');
    if(filename.includes('react/view/')) {
      const upperDir = filename.replace('react/view/', 'react/');
      fs.ensureFileSync(upperDir);
      fs.writeFileSync(
        upperDir, // move to upper directory
        fileContent.replace('/core/', '/dist/core/'))
    } else {
      fs.writeFileSync(filename, fileContent.replace('/core/', '/dist/core/'))
    }
  })

const commonDts = glob.sync("common/**/*.d.ts");
commonDts.forEach(filename =>
{
  const fileContent = fs.readFileSync(filename, 'utf-8');
  if(filename.includes('common/common/')) {
    const upperDir = filename.replace('common/common/', 'common/');
    fs.ensureFileSync(upperDir);
    fs.writeFileSync(
      upperDir, // move to upper directory
      fileContent.replace('/core/', '/dist/core/'))
  } else {
    fs.writeFileSync(filename, fileContent.replace('/core/', '/dist/core/'))
  }
})

// cleanup .d.ts copies
fs.removeSync('dist/core');
fs.removeSync('react/view');
fs.removeSync('dom/dom');
fs.removeSync('common/common');