import { ObjectQuery, RoutesConfiguration } from './types';
import { goQuery } from './goQuery';

export const checkConditions = (routesCfg: RoutesConfiguration) => (route: ObjectQuery) =>
{
    const { routes, params } = route;
    const newRoutes = [];
    const newParams = params;
    for (let i = 0; i < routes.length; i++) {
        newRoutes.push(routes[i])
        const { redirect } = routesCfg[routes[i]];
        if(redirect !== undefined && redirect.condition.getState())
            return goQuery(redirect.to, {
                routes: newRoutes,
                params: newParams
            });
    }

    return { routes: newRoutes, params: newParams };
}