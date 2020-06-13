import { Routes, Params } from '@core/types';

export const compilePath = (path: string, params: Params) => {
	const used: Record<string, boolean> = {};
	const pathWithPathParams = compilePathParams(path, params, used);
	const pathWithQueryParams = compileQueryParams(pathWithPathParams, params, used);
	const unusedParams = collectUnusedParams(params, used);
	const totalPath = pathWithQueryParams + compileDefaultQueryParams(unusedParams);

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

const compileQueryParams = (path: string, params: Params, used: Record<string, boolean>) => {
	const [pathWithoutQuery, concatenadedQueryParams ] = path.split('?');
	if(!concatenadedQueryParams)
		return pathWithoutQuery;

	const sp = new URLSearchParams(concatenadedQueryParams);
	for (const [key, val] of sp.entries()) {
		const paramKey = val ? val : key;
		if(params[paramKey] === undefined)
				throw new Error(`Param ${val} is not defined`)

		sp.set(key, String(params[paramKey]))
		used[paramKey] = true;
	}

	return pathWithoutQuery + '?' + sp.toString();
}

const collectUnusedParams = (params: Params, used: Record<string, boolean>) => {
	return Object.entries(params).reduce<Params>((unusedParams, [ paramKey, paramVal ]) => {
		if(!used.hasOwnProperty(paramKey))
			unusedParams[paramKey] = paramVal;

		return unusedParams;
	}, {})
}

export const compileDefaultPath = (pathTokens: Routes) => {
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