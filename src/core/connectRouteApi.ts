import { go, replace, set, back } from './events';
import { noop } from '@lib';
import { goQuery } from './goQuery';
import { Router, ObjectQuery, Query, RouteObject } from './types';
import { validateRoutes } from './validateRoutes';
import { ROUTE_NOT_FOUND } from './constants'

export const connectRouteApi = ($router: Router, routesCfg: Record<string, RouteObject>) =>
{
	$router
		.on([go, replace, set] as any, (route: ObjectQuery, newRoute: Query) =>
		{
			const newState = goQuery(newRoute, route);
			if(!validateRoutes(newState.routes, routesCfg))
				return { routes: [ROUTE_NOT_FOUND], params: {} }

			return newState;
		})
		.on(back, noop);
}