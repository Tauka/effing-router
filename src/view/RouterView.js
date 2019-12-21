import React from 'react';
import { useStore } from 'effector-react';

const BuildComponent = ({ routesCfg, currentTokenIdx, routeStores, tokens }) =>
{
	const token = useStore(routeStores[currentTokenIdx]);

	if(!token)
		return null;

	const Component = routesCfg[token].component;

	return <Component>
		<BuildComponent
			routesCfg={routesCfg}
			currentTokenIdx={currentTokenIdx + 1}
			routeStores={routeStores}
		/>
	</Component>;
};

const RouterView = ({ routerConfig }) =>
{
	return <BuildComponent
		routesCfg={routerConfig.cfg}
		currentTokenIdx={0}
		routeStores={routerConfig.routeStores}
	/>;
};

export default RouterView;