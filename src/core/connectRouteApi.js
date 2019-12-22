import _ from 'lodash';
import { go, replace, set, back } from './events';

import { parseArgs } from './parseArgs';
import { resolvePath } from './resolvePath';

export const connectRouteApi = $router =>
{
	$router
		.on([go, replace, set], (route, newPath) =>
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

			return { path, params, deps: route.deps };
		})
		.on(back, _.noop);
}