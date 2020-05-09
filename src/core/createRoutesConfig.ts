import { RoutesConfiguration, RoutesList, Route } from './types';

/**
 * Creates routeToken-routeCfg map
 * @example
 * {
 *   quiz: [{ routes: 'quiz', params, ... }]
 * }
*/
const parseRouteTokens = (cfg: RoutesConfiguration, route: Route) =>
{
	const routeToken = route.name;
	if(cfg[routeToken])
		throw Error(`Route "${routeToken}" is already declared`);

	cfg[routeToken] = route;
};

export const createRoutesConfig = (routesList: RoutesList) =>
{
	return routesList.reduce((cfg, route, idx) =>
	{
		if(!route.name)
			throw Error(`Missing required route property "name" at ${idx} index`);

		if(!route.component)
			throw Error(`Missing required route property "component" at ${idx} index`);

		parseRouteTokens(cfg, route);
		return cfg;
	}, {});
};

export default createRoutesConfig;