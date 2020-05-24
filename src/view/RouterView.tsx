import React from 'react';
import { useStoreMap } from 'effector-react';

import { RoutesConfiguration, RouterConfiguration, RouterPath, RouteObject } from '@core/types';

type ExtraProps = {[a: string]: any};
interface BuildComponentProps {
	routesCfg: RoutesConfiguration;
	currentTokenIdx: number;
	pathStore: RouterPath;
	extraProps?: ExtraProps;
}

interface RouterViewProps {
	routerConfig: RouterConfiguration;
}

const BuildComponent: React.FC<BuildComponentProps> = ({ routesCfg, currentTokenIdx, pathStore, extraProps }) =>
{
	const token = useStoreMap({
		store: pathStore,
		keys: [currentTokenIdx],
		fn: (path, [tokenIdx]) => path[tokenIdx] ?? null
	});

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
			pathStore={pathStore}
		/>;
	}

	const Component = routesCfg[token].component;

	if(!Component)
		throw new Error('Cannot find component');

	return <Component {...extraProps} childRoute={childRoute}/>
};

export const RouterView: React.FC<RouterViewProps> = ({ routerConfig }) =>
{
	return <BuildComponent
		routesCfg={routerConfig._cfg}
		currentTokenIdx={0}
		pathStore={routerConfig.$path}
	/>;
};