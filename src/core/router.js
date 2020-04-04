import _ from 'lodash';
import { combine } from 'effector';
import { setDeps } from './events';

export const $router =  combine(
	{
		path: [],
		params: {},
		deps: {}
	});

$router.on(setDeps, (router, newDeps) =>
	({
		...router,
		deps: { ...router.deps, ...newDeps }
	}));

$router.updates.watch(route =>
	console.log('[router]', route));