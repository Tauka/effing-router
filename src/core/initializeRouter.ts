import { connectRouteApi } from './connectRouteApi';
import { redirect } from './redirect';
import { RoutesList, RouterConfiguration } from './types';
import { checkConditions } from './checkConditions';
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
	routesList.forEach(route =>
	{
		if(route.redirect)
			redirect(route.redirect);
	})

	router._cfg = routesCfg;
};