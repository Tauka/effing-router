import React from 'react';
import { useStore } from 'effector-react';

import { RoutesConfiguration, RouterConfiguration, RouteObject } from '@core/types';

type ExtraProps = {[a: string]: any};
interface BuildComponentProps {
	routesCfg: RoutesConfiguration;
	currentTokenIdx: number;
	extraProps?: ExtraProps;
	routes: string[];
}

interface RouterViewProps {
	router: RouterConfiguration;
}

const BuildComponent: React.FC<BuildComponentProps> = ({ routesCfg, currentTokenIdx, extraProps, routes }) =>
{
	const token = routes[currentTokenIdx];

	if(!token)
		return null;

	const childRoute = (props: ExtraProps) =>
	{
		if(!routesCfg[token].children)
			return null;

		return <BuildComponent
			extraProps={props}
			routesCfg={routesCfg[token].children as Record<string, RouteObject>}
			currentTokenIdx={currentTokenIdx + 1}
			routes={routes}
		/>;
	}

	if(!routesCfg[token])
		throw new Error(`Cannot find route ${token} in path [${routes}]`);

	const Component = routesCfg[token].component;

	if(!Component)
		throw new Error(`Cannot find component in "${token}"`);

	return <Component {...extraProps} childRoute={childRoute}/>
};

export const RouterView: React.FC<RouterViewProps> = ({ router }) =>
{
	const routes = useStore(router.$routes);

	return <BuildComponent
		routesCfg={router._cfg}
		currentTokenIdx={0}
		routes={routes}
	/>;
};