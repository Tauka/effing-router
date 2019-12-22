import React from 'react';
import { useStore, useStoreMap } from 'effector-react';

const BuildComponent = ({ routesCfg, currentTokenIdx, pathStore, tokens }) =>
{
	const token = useStoreMap({
		store: pathStore,
		keys: [currentTokenIdx],
		fn: (path, [tokenIdx]) => path[tokenIdx]
	});

	if(!token)
		return null;

	const Component = routesCfg[token].component;

	return <Component>
		<BuildComponent
			routesCfg={routesCfg}
			currentTokenIdx={currentTokenIdx + 1}
			pathStore={pathStore}
		/>
	</Component>;
};

const RouterView = ({ routerConfig }) =>
{
	return <BuildComponent
		routesCfg={routerConfig.cfg}
		currentTokenIdx={0}
		pathStore={routerConfig.router.$path}
	/>;
};

export default RouterView;