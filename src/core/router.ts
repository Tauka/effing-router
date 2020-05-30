import { createStore } from 'effector';
import { go, set, replace, back } from './events';
import { ObjectQuery, Router } from './types';

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
	go, set, replace, back
}