import { connectRouteApi } from './connectRouteApi';
import { RoutesList, RouterConfiguration } from './types';
import { setupRedirects, connectGoRedirects } from './redirect';
import { routeListToObject } from './routeListToObject';

export const initializeRouter = (router: RouterConfiguration, routesList: RoutesList) =>
{
	const { $ } = router;

	const routesCfg = routeListToObject(routesList);
	connectRouteApi($);
	connectGoRedirects($, routesList);
	setupRedirects($, routesList);
	router._cfg = routesCfg;
};