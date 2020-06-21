import { createStore } from 'effector';
import { go, set, replace, back } from './events';
import { ObjectQuery, Router } from './types';
import { uninit } from '@lib';

export const $router: Router =  createStore<ObjectQuery>(
{
	routes: [],
	params: {}
});

export const $routes = $router.map(r => r.routes);
export const $params = $router.map(r => r.params);

export const router = {
	$: $router,
	$routes,
	$params,
	go, set, replace, back,
	createParamStore: uninit("createParamStore", "effing-router/utils"),
	createUnmountEvent: uninit("createUnmountEvent", "effing-router/utils"),
	createMountEvent: uninit("createMountEvent", "effing-router/utils"),
}