const renderPath = pathTokens =>
{
	return '/' + pathTokens.join('/');
}

const renderParams = paramsObj =>
{
	const searchParams = new URLSearchParams();

	Object.entries(paramsObj).forEach(([ key, val ]) =>
	{
		searchParams.set(key, val);
	});

	const stringParams = searchParams.toString();

	if(!stringParams)
		return '';

	return `?${stringParams}`;
}

const buildPath = (routesCfg, pathTokens, paramsObj) =>
{
	return renderPath(pathTokens) +
		renderParams(paramsObj);
};

export default buildPath;