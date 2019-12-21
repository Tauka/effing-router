import _ from 'lodash';
import { combine } from 'effector';

export const $router =  combine(
	{
		path: [],
		params: {},
		deps: {}
	});

//FIXME: try to use useStoreMap
export const routeStores = _.range(20).map(idx =>
{
	return $router.map(r =>
	{
		return r.path[idx] ?? null;
	});
});

$router.updates.watch(route =>
	console.log('[router]', route));