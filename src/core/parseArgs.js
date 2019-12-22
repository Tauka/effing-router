import _ from 'lodash';

/**
 * Expecting something like '/dashboard/main?id=5&courseId=3'
 * @param {} path
 */
export const parseArgs = path =>
{
	const isAbsolute = path[0] === '/';
	const [ pathTokensString, paramsTokensString ] = path.split('?')
	const pathTokens = _.compact(pathTokensString.split('/'));
	const searchParams = new URLSearchParams(paramsTokensString);
	const paramsObj = {};

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