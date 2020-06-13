import { ObjectQuery, Route, RoutesConfiguration } from '@core/types';
import { routeObjectPath } from '@lib';
import { compilePath, compileDefaultPath, compileDefaultQueryParams } from './compilePath';

export const buildPath = ({ routes, params }: ObjectQuery, routesConfig: RoutesConfiguration) =>
{
	const grandestChild = routeObjectPath(routesConfig, routes) as Route;

	if(grandestChild.path)
		return compilePath(grandestChild.path, params);

	return compileDefaultPath(routes) +
		compileDefaultQueryParams(params);
};