import _ from 'lodash';

import createRoutesConfig from './createRoutesConfig';
import { connectRouteApi } from './connectRouteApi';
import { redirect } from './redirect';

export const initializeRouter = (router, routesList) =>
{
	const { $ } = router;

	const routesCfg = createRoutesConfig(routesList);

	$.updates.watch(route =>
		console.log('[router]', route));

	connectRouteApi($, routesCfg);

	// setup redirects on condition store change
	routesList.forEach(route =>
	{
		if(route.redirect)
			redirect($, route.path, route.redirect, routesCfg);
	})

	router._cfg = routesCfg;
};