import { watchLastTwo } from './utils';
import { createParamsCfgMap } from './createRoutesConfig';

const paramsByKeys = (cfg, paramsObj) =>
	cfg.paramKeys.map(paramKey => paramsObj[paramKey]);

const isRouteCfgActive = (routesCfg, path, cfg) =>
{
	return path.some(p => routesCfg[p] === cfg);
};

const enterLeaveActivation = (next, prev, routesCfg) =>
{
	const activateMap = {}

	const pathDiffTokenIdx = next.path.findIndex((nextToken, idx) =>
			prev.path[idx] !== nextToken);

	if(pathDiffTokenIdx !== -1)
	{
		for(let i = pathDiffTokenIdx; i < next.path.length; i ++)
		{
			const prevCfg = routesCfg[prev.path[i]];
			const nextCfg = routesCfg[next.path[i]];

			if(nextCfg.activate && nextCfg.paramKeys)
			{
				nextCfg.activate(...paramsByKeys(nextCfg, next.params));
				activateMap[nextCfg.path] = true;
			}

			if(nextCfg.activate && !nextCfg.paramKeys)
				nextCfg.activate(next.params);

			if(prevCfg && prevCfg.deactivate)
				prevCfg.deactivate(next.params);
		}
	}

	return activateMap;
}

const paramKeyActivation = (next, prev, activateMap, paramsCfg) =>
{
	Object.keys(paramsCfg).forEach(paramKey =>
	{
		if(prev.params[paramKey] !== next.params[paramKey])
		{
			paramsCfg[paramKey].forEach(cfg =>
			{
				if(!activateMap[cfg.path] && isRouteCfgActive(routesCfg, next.path, cfg))
					cfg.activate(...paramsByKeys(cfg, next.params));
			});
		}
	});
}

export const connectRouteHooks = ($router, routesCfg) =>
{
	const paramsCfg =  createParamsCfgMap(routesCfg);

	watchLastTwo($router, (next, prev) =>
	{
		const activateMap = enterLeaveActivation(next, prev, routesCfg);
		paramKeyActivation(next, prev, activateMap, paramsCfg, );
	});
};