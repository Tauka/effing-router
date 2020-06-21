import { connectRouteApi } from './connectRouteApi';
import { RoutesList } from './types';
import { setupRedirects, connectGoRedirects, routesListToRedirectsMap } from './redirect';
import { routeListToObject } from '@common';
import { $router } from './router';

export const initializeRouter = (routesList: RoutesList) =>
{
	if(!routesList)
		throw new Error(`You must provide "routesList"`)

	const routesCfg = routeListToObject(routesList);
	const redirectsMap = routesListToRedirectsMap(routesList);
	connectRouteApi($router, routesCfg);
	connectGoRedirects($router, redirectsMap);
	setupRedirects($router, redirectsMap);
};