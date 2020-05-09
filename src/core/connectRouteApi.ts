import { go, replace, set, back } from './events';
import { checkConditions } from './checkConditions';
import { pipe, noop } from '@lib';
import { goByType } from './goByType';
import { Router, ObjectQuery, RoutesConfiguration, Query } from './types';

export const connectRouteApi = ($router: Router, routesCfg: RoutesConfiguration) =>
{
	$router
		.on([go, replace, set] as any, (route: ObjectQuery, newPath: Query) =>
		{
			return pipe(
				goByType,
				checkConditions(routesCfg)
			)(newPath, route);
		})
		.on(back, noop);
}