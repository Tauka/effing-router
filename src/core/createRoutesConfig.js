import _ from 'lodash';
import { createGate } from 'effector-react';

/**
 * Creates pathToken-routeCfg map
 * @example
 * {
 *   quiz: [{ path: 'quiz', params, ... }]
 * }
*/
const parseRoutePath = (cfg, route) =>
{
	const pathToken = route.path;
	if(cfg[pathToken])
		throw Error(`Path "${pathToken}" is already declared`);

	cfg[pathToken] = route;
};

/**
 * Creates param-routeCfg map
 * in order to efficiently traverse activation functions for those with changed
 * params
 * This hashmap allows O(1) lookups
 * @example
 * {
 *   itemId: [{ path: 'quiz', params, ... }]
 * }
 */
export const createParamsCfgMap = routesConfig =>
{
	return _.transform(routesConfig, (paramsConfig, currentRouteCfg) =>
	{
		_.transform(currentRouteCfg.paramKeys, (paramsConfig, paramKey) =>
		{
			if(!paramsConfig[paramKey])
				paramsConfig[paramKey] = [];

			paramsConfig[paramKey].push(currentRouteCfg);
		}, paramsConfig);
	}, {});
};

const createRoutesConfig = routesList =>
{
	return routesList.reduce((cfg, route, idx) =>
	{
		if(!route.path)
			throw Error(`Missing required route property "path" at ${idx} index`);

		if(!route.component)
			throw Error(`Missing required route property "component" at ${idx} index`);

		parseRoutePath(cfg, route);
		return cfg;
	}, {});
};

export default createRoutesConfig;