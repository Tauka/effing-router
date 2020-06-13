import { Routes, Params, ObjectQuery, Route, RoutesConfiguration } from '@core/types';
import { routeObjectPath } from '@lib';

export const buildPath = ({ routes, params }: ObjectQuery, routesConfig: RoutesConfiguration) =>
{
	const grandestChild = routeObjectPath(routesConfig, routes) as Route;

	if(grandestChild.path)
		return compilePath(grandestChild.path, params);

	return renderDefaultPath(routes) +
		renderQueryParams(params);
};

const compilePath = (path: string, params: Params) => {
	const splitPath = path.split('/');
	const paramTokens = splitPath
		.filter(token => token.includes(':'))
	const used: Record<string, boolean> = {};

	let resultPath = path;
	paramTokens.forEach(paramToken => {
		const cleanToken = paramToken.replace(':', '');
		const paramValue = params[cleanToken];
		used[cleanToken] = true;

		if(paramValue === undefined)
			throw Error(`Param ${paramToken} is not defined`)

		resultPath = resultPath.replace(paramToken, String(params[cleanToken]));
	})

	const unusedParams = collectUnusedParams(params, used);
	resultPath += renderQueryParams(unusedParams);
	return resultPath;
}

const collectUnusedParams = (params: Params, used: Record<string, boolean>) => {
	return Object.entries(params).reduce<Params>((unusedParams, [ paramKey, paramVal ]) => {
		if(!used.hasOwnProperty(paramKey))
			unusedParams[paramKey] = paramVal;

		return unusedParams;
	}, {})
}

const renderDefaultPath = (pathTokens: Routes) => {
	return '/' + pathTokens.join('/');
}

const renderQueryParams = (paramsObj: Params) => {
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

export default buildPath;