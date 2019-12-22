import { merge, combine } from 'effector';
import _ from 'lodash';

import { $router } from './router';
import createRoutesConfig from './createRoutesConfig';
import { connectRouteApi } from './connectRouteApi';
import { connectRouteHooks } from './connectRouteHooks';

const createRouter = (routesList, $deps) =>
{
	const routesCfg = createRoutesConfig(routesList);

	const $path = $router.map(r => r.path);
	const $params = $router.map(r => r.params);

	if($deps)
		$router
			.on($deps, (router, deps) =>
			{
				const { path, params } = preProcessRoute(routesCfg, router.path, deps);
				return { path, params, deps };
			})

	connectRouteApi($router);
	connectRouteHooks($router, routesCfg);

	return { cfg: routesCfg, router:
		{
			$path,
			$params
		}};
};

export default createRouter;