import { connectRouteApi } from './connectRouteApi';
import { RoutesList, RouterConfiguration } from './types';
import { checkConditions, setupRedirects } from './redirect';
import { go } from './events';
import { routeListToObject } from './routeListToObject';

export const initializeRouter = (router: RouterConfiguration, routesList: RoutesList) =>
{
	const { $ } = router;

	const routesCfg = routeListToObject(routesList);
	connectRouteApi($, routesCfg);

	// initial redirect
	go(({ routes: path, params }) =>
	{
			const afterCheck = checkConditions(routesCfg)({ routes: path, params });
			return {
					routes: afterCheck.routes,
					params: afterCheck.params,
					replace: true
			};
	});

	// setup redirects on condition store change
	setupRedirects($, routesList);
	router._cfg = routesCfg;
};