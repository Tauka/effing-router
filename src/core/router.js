import { createStore } from 'effector';
import { go, set, replace, back } from './events';

export const $router =  createStore(
{
	path: [],
	params: {}
});

export const $path = $router.map(r => r.path);
export const $params = $router.map(r => r.params);

export const router = {
	$: $router,
	$path,
	$params,
	go, set, replace, back
}