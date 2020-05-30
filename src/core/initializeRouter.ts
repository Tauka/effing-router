import { connectRouteApi } from './connectRouteApi';
import { RoutesList, RouterConfiguration } from './types';
import { setupRedirects, initialRedirect } from './redirect';
import { routeListToObject } from './routeListToObject';

export const initializeRouter = (router: RouterConfiguration, routesList: RoutesList) =>
{
	const { $ } = router;

	const routesCfg = routeListToObject(routesList);
	connectRouteApi($, routesCfg);
	initialRedirect(routesCfg);
	setupRedirects($, routesList);
	router._cfg = routesCfg;
};