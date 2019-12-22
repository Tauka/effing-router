import { merge } from 'effector';
import _ from 'lodash';

import { $router, routeStores } from './router';
import { go, replace, set, back } from './events';
import createRoutesConfig from './createRoutesConfig';
import preProcessRoute from './preProcessRoute';
import { connectRouteHooks } from './routeHooks';

const createRouter = (routesList, $deps) =>
{
	const routesCfg = createRoutesConfig(routesList);

	if($deps)
		$router
			.on($deps, (router, deps) =>
			{
				const { path, params } = preProcessRoute(routesCfg, router.path, deps);
				return { path, params, deps };
			})

	$router
		.on([go, replace, set], (route, newPath) =>
		{
			let path = [];
			let params = {};
			if(_.isFunction(newPath))
			{
				const newRoute = newPath(route.path, route.params, route.deps);
				path = newRoute.path;
				params = newRoute.params;
			}
			else
			{
				const tokens = tokenizePath(newPath);
				const newRoute = preProcessRoute(routesCfg, tokens, route.deps);
				path = newRoute.path;
				params = newRoute.params;
			}

			return { path, params, deps: route.deps };
		})
		.on(back, _.noop);

		connectRouteHooks($router, routesCfg);

	return { cfg: routesCfg, routeStores };
};

export default createRouter;