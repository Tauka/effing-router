import { connectRouteApi } from './connectRouteApi';
import { RoutesList } from './types';
import { setupRedirects, connectGoRedirects, routesListToRedirectsMap } from './redirect';
import { routeListToObject } from 'XtR6HOaxz1';
import { $router } from './router';

export const initializeRouter = (routesList: RoutesList) =>
{
	const routesCfg = routeListToObject(routesList);
	const redirectsMap = routesListToRedirectsMap(routesList);
	connectRouteApi($router, routesCfg);
	connectGoRedirects($router, redirectsMap);
	setupRedirects($router, redirectsMap);
};