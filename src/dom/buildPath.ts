import { Path, Params, ObjectQuery, Route, RoutesObject } from '@core/types';
import { routeObjectPath } from '@lib';

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

const parsePath = (path: string, params: Params) => {
	const splitPath = path.split('/');
	const paramTokens = splitPath
		.filter(token => token.includes(':'))

	let resultPath = path;
	paramTokens.forEach(paramToken => {
		const cleanToken = paramToken.replace(':', '');
		const paramValue = params[cleanToken];

		if(paramValue === undefined)
			throw Error(`Param ${paramToken} is not defined`)

		resultPath = resultPath.replace(paramToken, String(params[cleanToken]));
	})

	return resultPath;
}

export const buildPath = ({ routes, params }: ObjectQuery, routesConfig: RoutesObject) =>
{
	const grandestChild = routeObjectPath(routesConfig, routes) as Route;

	if(grandestChild.path)
		return parsePath(grandestChild.path, params);

	return renderPath(routes) +
		renderParams(params);
};

export default buildPath;