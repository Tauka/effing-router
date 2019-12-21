import tokenizePath from './tokenizePath';

// eslint-disable-next-line max-statements
const preProcessRoute = (routesCfg, routeTokens, deps) =>
{
	const pathTokens = [];
	const paramsObj = {};
	let currentTokenIdx = 0;

	while(currentTokenIdx < routeTokens.length)
	{
		const token = routeTokens[currentTokenIdx];
		pathTokens.push(token);
		currentTokenIdx ++;
		const currentCfg = routesCfg[token];

		if(!currentCfg)
			throw Error(`Route token "${token}" does not exist`);

		const { params, optParams, redirect } = currentCfg;

		if(redirect && redirect.when(deps))
		{
			console.log('[router/redirect to]', redirect.to);
			return preProcessRoute(routesCfg, tokenizePath(redirect.to), deps);
		}

		if(params && params.length)
		{
			params.forEach(param =>
			{
				if(paramsObj[param])
					throw Error(`Param token "${param}" already exists, they must be unique`);

				paramsObj[param] = routeTokens[currentTokenIdx];
				currentTokenIdx ++;
			});
		}

		if(optParams && optParams.length)
		{
			for(let i = 0; i < optParams.length; i ++)
			{
				const token = routeTokens[currentTokenIdx];

				if(routesCfg[token])
					break;

				const param = optParams[i];
				if(paramsObj[param])
					throw Error(`Param token "${param}" already exists, they must be unique`);

				paramsObj[param] = token;
				currentTokenIdx ++;
			}
		}
	}

	return (
		{
			path: pathTokens,
			params: paramsObj
		});
};

export default preProcessRoute;