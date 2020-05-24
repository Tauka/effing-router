import { ObjectQuery, RoutesConfiguration, Redirect } from '../types';
import { goQuery } from '../goQuery';
import { Routes } from '../types';

export const checkConditions = (routesCfg: RoutesConfiguration) => (route: ObjectQuery) =>
{
    const { routes, params } = route;

    const result = checkConditionsRecursively(routesCfg, routes, []);
    if(result.redirect)
        return goQuery(result.redirect.to, {
            routes: result.routes,
            params
        });

    return { routes: result.routes, params };
}

const checkConditionsRecursively = (routesCfg: RoutesConfiguration, targetRoutes: Routes, accumulatedRoutes: Routes): { redirect: Redirect | null; routes: Routes } => {
    if(!targetRoutes.length)
        return { redirect: null, routes: accumulatedRoutes }

    const targetRoute = targetRoutes[0];
    if(!(targetRoute in routesCfg))
        throw new Error(`Route ${targetRoute} is not defined in routesList`)

    const { redirect, children } = routesCfg[targetRoute];

    if(redirect !== undefined && redirect.condition.getState())
    {
        if(redirect.condition.getState())
            return { redirect, routes: [...accumulatedRoutes, targetRoute] }
        else
            return { redirect: null, routes: [...accumulatedRoutes, targetRoute] }
    }

    if(!children)
        return { redirect: null, routes: [...accumulatedRoutes, targetRoute] }

    return checkConditionsRecursively(children, targetRoutes.slice(1), [...accumulatedRoutes, targetRoute])
}