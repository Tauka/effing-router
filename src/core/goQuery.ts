import { Query, ObjectQuery, FunctionQuery, StringQuery, RoutesQuery, ParamsQuery } from './types';
import { isFunctionQuery, isObjectQuery, dropRight, isRoutesQuery, isParamsQuery, isPartialObjectQuery } from '@lib';

export const goQuery = (newPath: Query, route: ObjectQuery) =>
{
	if(isFunctionQuery(newPath))
		return goFunction(newPath, route);

	if(isObjectQuery(newPath))
		return goObject(newPath);

	if(isRoutesQuery(newPath))
		return goRoutes(newPath, route);

	if(isParamsQuery(newPath))
		return goParams(newPath, route);

	return goString(newPath, route);
}

const goFunction = (newPath: FunctionQuery, route: ObjectQuery) =>
{
	const nextRoute = newPath(route);

	if(!nextRoute)
		throw new Error('router.go expects function that returns object or array');

	if(isPartialObjectQuery(nextRoute))
		return {
			routes: [...route.routes],
			params: { ...route.params },
			...nextRoute
		};

	if(isRoutesQuery(nextRoute))
		return {
			routes: [...nextRoute],
			params: {}
		}

	if(isParamsQuery(nextRoute))
		return {
			routes: [...route.routes],
			params: {...nextRoute}
		}

	return nextRoute;
}

const goObject = (newPath: ObjectQuery) => {
	return {
		routes: [...newPath.routes],
		params: { ...newPath.params }
	}
};

const goString = (newPath: StringQuery, route: ObjectQuery) =>
{
	return {
		routes: [...dropRight(route.routes), newPath],
		params: route.params
	}
}

const goRoutes = (newPath: RoutesQuery, route: ObjectQuery) => {
	return {
		routes: [...newPath],
		params: { ...route.params }
	}
}

const goParams = (newPath: ParamsQuery, route: ObjectQuery) => {
	return {
		routes: [...route.routes],
		params: { ...route.params, ...newPath }
	}
}