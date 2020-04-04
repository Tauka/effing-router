import React, { useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';

const BuildComponent = ({ routesCfg, currentTokenIdx, pathStore, tokens, extraProps }) =>
{
	const token = useStoreMap({
		store: pathStore,
		keys: [currentTokenIdx],
		fn: (path, [tokenIdx]) => path[tokenIdx] ?? null
	});

	const ChildRoute = useMemo(() =>
	{
		return props =>
			<>
				<BuildComponent
					extraProps={props}
					routesCfg={routesCfg}
					currentTokenIdx={currentTokenIdx + 1}
					pathStore={pathStore}
				/>
			</>
	}, []);

	if(!token)
		return null;

	const Component = routesCfg[token].component;

	return <Component {...extraProps} ChildRoute={ChildRoute}/>
};

const RouterView = ({ router }) =>
{
	return <BuildComponent
		routesCfg={router.cfg.routes}
		currentTokenIdx={0}
		pathStore={router.cfg.$path}
	/>;
};

export default RouterView;