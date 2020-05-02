import _ from 'lodash';
import { go, replace, set, back } from './events';

import { parseArgs } from './parseArgs';
import { resolvePath } from './resolvePath';
import { checkConditions } from './checkConditions';

export const connectRouteApi = ($router, routesCfg) =>
{
	$router
		.on([go, set], (route, newPath) =>
		{
			let path = [];
			let params = {};
			if(_.isFunction(newPath))
			{
				const newRoute = newPath(route.path, route.params, route.deps);
				path = newRoute.path;
				params = newRoute.params;
			}
			else
			{
				const newRoute = parseArgs(newPath);
				path = resolvePath(route.path, newRoute.path, newRoute.isAbsolute)
				params = newRoute.params;
			}

			const afterCheck = checkConditions(path, params, routesCfg);
			return { path: afterCheck.path, params: afterCheck.params };
		})
		.on(back, _.noop);
}