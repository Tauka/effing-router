import { merge, combine, forward, createEvent, guard } from 'effector';
import _ from 'lodash';

import { $router } from './router';
import createRoutesConfig from './createRoutesConfig';
import { connectRouteApi } from './connectRouteApi';
import { connectRouteHooks } from './connectRouteHooks';
import { setDeps, go } from './events';

const createRouter = (routesList, $deps) =>
{
	const routesCfg = createRoutesConfig(routesList);
	const $path = $router.map(r => r.path);
	const $params = $router.map(r => r.params);

	routesList.forEach(route =>
	{
		routesCfg[route.path].store =
			$router.map(({ path }) => path.includes(route.path));
	});

	connectRouteApi($router);

	const redirect = guardCfg =>
	{
		const { when, to, condition } = guardCfg;

		if(!routesCfg.hasOwnProperty(when) || !routesCfg.hasOwnProperty(to))
			throw Error(`No such route path: ${routePathName}`);

		const conditionValue = condition.getState()

		// initial redirect
		go((path, params) =>
			({
				path: path.map(pathToken =>
					conditionValue && pathToken === when
						? to
						: pathToken),
				params,
				replace: true
			}));

		$router.on(condition, (router, cond) =>
		{
			if(!cond)
				return router;

			let changed = false;

			const newPath = router.path.map(pathToken =>
			{
				if(pathToken === when)
				{
					changed = true;
					return to;
				}

				return pathToken;
			})

			if(!changed)
				return router;

			return { path: newPath, params: router.params }
		});
	}

	const createMountEvent = routerPathName =>
	{
		const evMount = createEvent(`[router/mount] ${routerPathName}`);
		forward(
		{
			from: routesCfg[routerPathName],
			to: evMount
		})

		return evMount;
	}

	const createUpdateEvent = routeParams =>
	{
		if(params)
		{
			return guard(
				{
					source: $router,
					filter: $router.map(({ path, params }) =>
						routeParams.some(param => params.includes(param)))
				});
		}

		const updateEvent = createEvent(`[router/update] ${routePathName}`);
		forward(
		{
			from: $router.updates,
			to: updateEvent
		});

		return updateEvent;
	}

	return {
		cfg:
		{
			routes: routesCfg,
			$path
		},
		$router,
		redirect,
		createMountEvent,
		createUpdateEvent
	};
};

export default createRouter;