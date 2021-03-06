import { Routes, Params } from '@core/types';
import { ROUTE_NOT_FOUND } from '@dist';

export const compilePath = (path: string, params: Params) => {
	if(path.includes('?'))
		throw new Error('Specifying search params is not supported, all unused params will be transformed into search params automatically')

	const used: Record<string, boolean> = {};
	const pathWithPathParams = compilePathParams(path, params, used);
	const unusedParams = collectUnusedParams(params, used);
	const totalPath = pathWithPathParams + compileDefaultQueryParams(unusedParams);

	if(path[0] === '/')
		return totalPath

	return '/' + totalPath;
}

const compilePathParams = (path: string, params: Params, used: Record<string, boolean>) => {
	const splitPath = path.split('/');
	const paramTokens = splitPath
		.filter(token => token.includes(':'))

	let resultPath = path;
	paramTokens.forEach(paramToken => {
		const cleanToken = paramToken.replace(':', '');
		const paramValue = params[cleanToken];
		used[cleanToken] = true;

		if(paramValue === undefined)
			throw new Error(`Param ${paramToken} is not defined`)

		resultPath = resultPath.replace(paramToken, String(params[cleanToken]));
	})

	return resultPath;
}

const collectUnusedParams = (params: Params, used: Record<string, boolean>) => {
	return Object.entries(params).reduce<Params>((unusedParams, [ paramKey, paramVal ]) => {
		if(!used.hasOwnProperty(paramKey))
			unusedParams[paramKey] = paramVal;

		return unusedParams;
	}, {})
}

export const compileDefaultPath = (pathTokens: Routes) => {
	if(pathTokens[0] === ROUTE_NOT_FOUND)
		return '/notfound';

	return '/' + pathTokens.join('/');
}

export const compileDefaultQueryParams = (paramsObj: Params) => {
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