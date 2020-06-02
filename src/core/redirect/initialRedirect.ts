import { replace } from '@core/events';
import { checkConditions } from './checkConditions';
import { RouteObject } from '@core/types';

export const initialRedirect = (routesCfg: Record<string, RouteObject>) => {
  replace(({ routes, params }) =>
	{
			const afterCheck = checkConditions(routesCfg)({ routes, params });
			return {
					routes: afterCheck.routes,
					params: afterCheck.params
			};
	});
}