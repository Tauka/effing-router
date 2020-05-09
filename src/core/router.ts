import { createStore } from 'effector';
import { go, set, replace, back } from './events';
import { ObjectQuery, Router } from './types';

export const $router: Router =  createStore<ObjectQuery>(
{
	path: [],
	params: {}
});

$router.watch(router => console.log('[router]', router))

export const $path = $router.map(r => r.path);
export const $params = $router.map(r => r.params);

export const router = {
	$: $router,
	$path,
	$params,
	go, set, replace, back
}