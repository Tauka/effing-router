import React, { useMemo } from 'react';
import { useStoreMap } from 'effector-react';

const BuildComponent = ({ routesCfg, currentTokenIdx, pathStore, extraProps }) =>
{
	const token = useStoreMap({
		store: pathStore,
		keys: [currentTokenIdx],
		fn: (path, [tokenIdx]) => path[tokenIdx] ?? null
	});

	const childRoute = props =>
		<BuildComponent
			extraProps={props}
			routesCfg={routesCfg}
			currentTokenIdx={currentTokenIdx + 1}
			pathStore={pathStore}
		/>;

	if(!token)
		return null;

	const Component = routesCfg[token].component;

	return <Component {...extraProps} childRoute={childRoute}/>
};

export const RouterView = ({ router }) =>
{
	return <BuildComponent
		routesCfg={router._cfg}
		currentTokenIdx={0}
		pathStore={router.$path}
	/>;
};