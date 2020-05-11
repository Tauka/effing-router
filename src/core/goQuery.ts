import { Query, ObjectQuery, FunctionQuery, StringQuery } from './types';
import { isFunctionQuery, isObjectQuery, dropRight } from '@lib';

export const goQuery = (newPath: Query, route: ObjectQuery) =>
{
	if(isFunctionQuery(newPath))
		return goFunction(newPath, route);
	
	if(isObjectQuery(newPath))
		return goObject(newPath, route);

	return goString(newPath, route);
}

const goFunction = (newPath: FunctionQuery, route: ObjectQuery) =>
{
	return newPath(route);
}

const goObject = (newPath: ObjectQuery, route: ObjectQuery) => {
	return {
		routes: [...route.routes, ...newPath.routes],
		params: {
			...route.params,
			...newPath.params
		}
	}
};

const goString = (newPath: StringQuery, route: ObjectQuery) =>
{
	return {
		routes: [...dropRight(route.routes), newPath],
		params: route.params
	}
}