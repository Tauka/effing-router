import { connectRouteApi } from './connectRouteApi';
import { RoutesList, RouterConfiguration } from './types';
import { setupRedirects, connectGoRedirects, routesListToRedirectsMap } from './redirect';
import { routeListToObject } from './routeListToObject';

export const initializeRouter = (router: RouterConfiguration, routesList: RoutesList) =>
{
	const { $ } = router;

	const routesCfg = routeListToObject(routesList);
	const redirectsMap = routesListToRedirectsMap(routesList);
	connectRouteApi($);
	connectGoRedirects($, redirectsMap);
	setupRedirects($, redirectsMap);
	router._cfg = routesCfg;
};