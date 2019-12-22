export { default as createRouter } from './core/createRouter';
export { bindDom } from './core/dom';
import api from './api';
export { default as RouterView } from './view/RouterView';

const { go, replace, back } = api;

export { go, replace, back }