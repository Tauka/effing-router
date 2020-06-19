import React from 'react';
import { useStore } from 'effector-react';

import { RoutesConfiguration, RouterConfiguration, RouteObject } from '@core/types';

type ExtraProps = {[a: string]: any};
interface BuildComponentProps {
	routesCfg: RoutesConfiguration;
	currentTokenIdx: number;
	extraProps?: ExtraProps;
	routes: (string | symbol)[];
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
		if(!routesCfg[token as any].children)
			return null;

		return <BuildComponent
			extraProps={props}
			routesCfg={routesCfg[token as any].children as Record<string, RouteObject>}
			currentTokenIdx={currentTokenIdx + 1}
			routes={routes}
		/>;
	}

	if(!routesCfg[token as any])
		throw new Error(`Cannot find route ${String(token)} in path [${routes}]`);

	const Component = routesCfg[String(token)].component;

	if(!Component)
		throw new Error(`Cannot find component in "${String(token)}"`);

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