import { compact } from '@lib';

/**
 * Expecting something like '/dashboard/main?id=5&courseId=3'
 * @param {} path
 */
export const parseArgs = (path: string) =>
{
	const isAbsolute = path[0] === '/';
	const [ pathTokensString, paramsTokensString ] = path.split('?')
	const pathTokens = compact(pathTokensString.split('/'));
	const searchParams = new URLSearchParams(paramsTokensString);
	const paramsObj: {[k: string]: string} = {};

	for(const [ key, value ] of searchParams)
	{
		paramsObj[key] = value;
	}

	return {
		path: pathTokens,
		params: paramsObj,
		isAbsolute
	};
};