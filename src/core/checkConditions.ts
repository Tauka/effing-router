import { ObjectQuery, RoutesConfiguration } from './types';
import { goByType } from './goByType';

export const checkConditions = (routesCfg: RoutesConfiguration) => (route: ObjectQuery) =>
{
    const { path, params } = route;
    const newPath = [];
    const newParams = params;
    for (let i = 0; i < path.length; i++) {
        newPath.push(path[i])
        const { redirect } = routesCfg[path[i]];
        if(redirect !== undefined && redirect.condition.getState())
            return goByType(redirect.to, {
                path: newPath,
                params: newParams
            });
    }

    return { path: newPath, params: newParams };
}