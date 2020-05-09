import createRoutesConfig from './createRoutesConfig';
import { connectRouteApi } from './connectRouteApi';
import { redirect } from './redirect';
import { RoutesList, RouterConfiguration } from './types';
import { checkConditions } from './checkConditions';
import { go } from './events';

export const initializeRouter = (router: RouterConfiguration, routesList: RoutesList) =>
{
	const { $ } = router;

	const routesCfg = createRoutesConfig(routesList);
	connectRouteApi($, routesCfg);

	// initial redirect
	go(({ path, params }) =>
	{
			const afterCheck = checkConditions(routesCfg)({ path, params });
			return {
					path: afterCheck.path,
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