import { merge } from 'effector';
import _ from 'lodash';

import { $router, routeStores } from './router';
import { go, replace, push, pushReplace,
	pushLast, pushLastReplace, back, modifyRoute } from './events';
import createRoutesConfig, { createParamsCfgMap } from './createRoutesConfig';
import preProcessRoute from './preProcessRoute';
import tokenizePath from './tokenizePath';
import { commonPath, watchLastTwo } from './utils';

const paramsByKeys = (cfg, paramsObj) =>
	cfg.paramKeys.map(paramKey => paramsObj[paramKey]);

const isRouteCfgActive = (routesCfg, path, cfg) =>
{
	return path.some(p => routesCfg[p] === cfg);
};

const createRouter = (routesList, $deps) =>
{
	const routesCfg = createRoutesConfig(routesList);
	const paramsCfg =  createParamsCfgMap(routesCfg);

	if($deps)
		$router
			.on($deps, (router, deps) =>
			{
				const { path, params } = preProcessRoute(routesCfg, router.path, deps);
				return { path, params, deps };
			})

	$router
		.on(merge([go, replace]), (route, newPath) =>
		{
			let path = [];
			let params = {};
			if(_.isFunction(newPath))
			{
				const newRoute = newPath(route.path, route.params, route.deps);
				path = newRoute.path;
				params = newRoute.params;
			}
			else
			{
				const tokens = tokenizePath(newPath);
				const newRoute = preProcessRoute(routesCfg, tokens, route.deps);
				path = newRoute.path;
				params = newRoute.params;
			}

			return { path, params, deps: route.deps };
		})
		.on(merge([push, pushReplace]), (route, newPath) =>
		{
			const tokens = tokenizePath(newPath);
			const { path, params } = preProcessRoute(routesCfg, tokens, route.deps);

			return {
				path: [ ...route.path, ...path ],
				params: { ...route.params, ...params },
				deps: route.deps
			};
		})
		.on(merge([pushLast, pushLastReplace]), (route, newPath) =>
		{
			const oldPath = _.dropRight(route.path);
			const tokens = tokenizePath(newPath);
			const { path, params } = preProcessRoute(routesCfg, tokens, route.deps);

			return {
				path: [ ...oldPath, ...path ],
				params: { ...route.params, ...params },
				deps: route.deps
			};
		})
		.on(modifyRoute, (route, changeRouteCfg) =>
		{
			let routeCfg = changeRouteCfg;
			if(_.isFunction(changeRouteCfg))
				routeCfg = changeRouteCfg(route.path, route.params, route.deps);

			const { path: modPath, params: modParams = {} } = routeCfg;
			let path = route.path;

			if(modPath)
				path = commonPath(route.path, modPath);

			return {
				path,
				params: { ...route.params, ...modParams },
				deps: route.deps
			};
		})
		.on(back, _.noop);

	let activateMap = {};

	watchLastTwo($router, (next, prev) =>
	{
		activateMap = {};

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
	});

	return { cfg: routesCfg, routeStores };
};

export default createRouter;