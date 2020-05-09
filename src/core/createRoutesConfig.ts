import { RoutesConfiguration, RoutesList, Route } from './types';

/**
 * Creates pathToken-routeCfg map
 * @example
 * {
 *   quiz: [{ path: 'quiz', params, ... }]
 * }
*/
const parseRoutePath = (cfg: RoutesConfiguration, route: Route) =>
{
	const pathToken = route.name;
	if(cfg[pathToken])
		throw Error(`Path "${pathToken}" is already declared`);

	cfg[pathToken] = route;
};

export const createRoutesConfig = (routesList: RoutesList) =>
{
	return routesList.reduce((cfg, route, idx) =>
	{
		if(!route.name)
			throw Error(`Missing required route property "name" at ${idx} index`);

		if(!route.component)
			throw Error(`Missing required route property "component" at ${idx} index`);

		parseRoutePath(cfg, route);
		return cfg;
	}, {});
};

export default createRoutesConfig;