/**
 * Builds string path from pathTokens and paramsObj
 * @param {Object} routesCfg
 * @param {Array} pathTokens
 * @param {Object} paramsObj
 */
const buildPath = (routesCfg, pathTokens, paramsObj) =>
{
	let currentTokenIdx = 0;
	let path = '';

	while(currentTokenIdx < pathTokens.length)
	{
		const token = pathTokens[currentTokenIdx];
		path += `/${token}`;

		const { params, optParams } = routesCfg[token];

		if(params && params.length)
			path += '/' + params
				.map(param => paramsObj[param])
				.join('/');

		if(optParams && optParams.length)
		{
			const trueOptParams = optParams.reduce((acc, param) =>
			{
				if(paramsObj[param])
					acc.push(paramsObj[param]);

				return acc;
			}, []);

			if(trueOptParams.length)
				path += '/' + trueOptParams.join('/');
		}

		currentTokenIdx ++;
	}

	return path;
};

export default buildPath;