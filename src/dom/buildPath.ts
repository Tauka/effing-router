import { Path, Params } from '@core/types';

const renderPath = (pathTokens: Path) =>
{
	return '/' + pathTokens.join('/');
}

const renderParams = (paramsObj: Params) =>
{
	const searchParams = new URLSearchParams();

	Object.entries(paramsObj).forEach(([ key, val ]) =>
	{
		searchParams.set(key, String(val));
	});

	const stringParams = searchParams.toString();

	if(!stringParams)
		return '';

	return `?${stringParams}`;
}

export const buildPath = (pathTokens: Path, paramsObj: Params) =>
{
	return renderPath(pathTokens) +
		renderParams(paramsObj);
};

export default buildPath;