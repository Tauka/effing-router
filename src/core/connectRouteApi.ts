import { go, replace, set, back } from './events';
import { checkConditions } from './redirect';
import { pipe, noop } from '@lib';
import { goQuery } from './goQuery';
import { Router, ObjectQuery, RoutesConfiguration, Query } from './types';

export const connectRouteApi = ($router: Router, routesCfg: RoutesConfiguration) =>
{
	const checkConditionsWithCfg = checkConditions(routesCfg);

	$router
		.on([go, replace, set] as any, (route: ObjectQuery, newRoute: Query) =>
		{
			return pipe(
				goQuery,
				checkConditionsWithCfg
			)(newRoute, route);
		})
		.on(back, noop);
}