import _ from 'lodash';

/**
 * Creates pathToken-routeCfg map
 * @example
 * {
 *   quiz: [{ path: 'quiz', params, ... }]
 * }
*/
const parseRoutePath = (cfg, route) =>
{
	const tokens = _.compact(route.path.split('/'));
	const pathToken = tokens[0];
	const paramsTokens = tokens.slice(1);
	// assume path always starts from routeToken and has only 1 of it
	if(cfg[pathToken])
		throw Error(`Path "${pathToken}" is already declared`);

	cfg[pathToken] = {};
	// remove : from params
	if(paramsTokens)
	{
		const paramObj = _.transform(paramsTokens, (paramObj, token) =>
		{
			if(!token.includes(':'))
				throw Error(`${token}: There must be only one path token, or add : to make it param token`);

			if(token.includes('?'))
			{
				paramObj.optParams.push(token.slice(2));
				return;
			}

			paramObj.params.push(token.slice(1));
		}, { params: [], optParams: [] });

		cfg[pathToken] = paramObj;
	}

	cfg[pathToken] =
	{
		path: pathToken,
		...cfg[pathToken],
		..._.omit(route, ['path'])
	};
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