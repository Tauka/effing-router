import { go, replace, set, back } from './events';
import { noop } from '@lib';
import { goQuery } from './goQuery';
import { Router, ObjectQuery, Query } from './types';

export const connectRouteApi = ($router: Router) =>
{
	$router
		.on([go, replace, set] as any, (route: ObjectQuery, newRoute: Query) =>
		{
			return goQuery(newRoute, route);
		})
		.on(back, noop);
}