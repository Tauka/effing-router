import React, { useMemo } from 'react';
import { useStore } from 'effector-react';

import { routeListToObject } from '@common';
import { RoutesConfiguration, RouterBase, RouteObject, RoutesList } from '@core/types';

type ExtraProps = {[a: string]: any};
interface BuildComponentProps {
	routesObject: RoutesConfiguration;
	currentTokenIdx: number;
	extraProps?: ExtraProps;
	routes: (string | symbol)[];
}

interface RouterViewProps {
	router: RouterBase;
	routesList: RoutesList;
}

const BuildComponent: React.FC<BuildComponentProps> = ({ routesObject: routesCfg, currentTokenIdx, extraProps, routes }) =>
{
	const token = routes[currentTokenIdx];

	if(!token)
		return null;

	const childRoute = (props: ExtraProps) =>
	{
		if(!routesCfg[token as any].children)
			return null;

		return <BuildComponent
			extraProps={props}
			routesObject={routesCfg[token as any].children as Record<string, RouteObject>}
			currentTokenIdx={currentTokenIdx + 1}
			routes={routes}
		/>;
	}

	if(!routesCfg[token as any])
		throw new Error(`Cannot find route ${String(token)} in path [${routes.map(String)}]`);

	const Component = routesCfg[token].component;

	if(!Component)
		throw new Error(`Cannot find component in "${String(token)}"`);

	return <Component {...extraProps} childRoute={childRoute}/>
};

export const RouterView: React.FC<RouterViewProps> = ({ router, routesList }) =>
{
	if(!router)
		throw new Error(`You must provide "router" from "effing-router" as prop`)

	if(!routesList)
		throw new Error(`You must provide "routesList" as prop`)

	const routes = useStore(router.$routes);
	const routesObject = useMemo(() => routeListToObject(routesList), [])

	return <BuildComponent
		routesObject={routesObject}
		currentTokenIdx={0}
		routes={routes}
	/>;
};