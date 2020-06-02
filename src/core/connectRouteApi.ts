import { go, replace, set, back } from './events';
import { checkConditions } from './redirect';
import { pipe, noop } from '@lib';
import { goQuery } from './goQuery';
import { Router, ObjectQuery, RoutesConfiguration, Query } from './types';

export const connectRouteApi = ($router: Router, routesCfg: RoutesConfiguration) =>
{
	$router
		.on([go, replace, set] as any, (route: ObjectQuery, newRoute: Query) =>
		{
			return goQuery(newRoute, route);
		})
		.on(back, noop);
}