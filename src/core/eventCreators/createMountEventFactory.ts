import { guard, sample } from 'effector';

import { ObjectQuery, Router, Routes, RoutesQuery } from '@core/types';
import { duplexStore, isRoutesQuery } from '@lib';
import { paramsMatch, fullRoutesMatch } from './lib';

type MountConfiguration = ObjectQuery | string | RoutesQuery;

export const createMountEventFactory = ($router: Router) => (mountCfg: MountConfiguration) =>
{
    if(typeof mountCfg === 'string')
        return handleString($router, mountCfg);

    if(isRoutesQuery(mountCfg))
        return handleArray($router, mountCfg);

    return handleObject($router, mountCfg);
}

const handleArray = ($router: Router, mountCfg: RoutesQuery) => {
    return handleObject($router, {
        routes: mountCfg
    })
}

const handleString = ($router: Router, mountCfg: string) => {
    const $routes = $router.map(({ routes }) => routes);
    const $mountIndex = $routes.map(p => p.findIndex(token => token === mountCfg));

    return sample(
    {
        source: $router,
        clock: guard($mountIndex, { filter: idx => idx > -1 }),
    })
}

const handleObject = ($router: Router, mountCfg: Partial<ObjectQuery>) => {
    const { routes, params } = mountCfg;

    return sample(
    {
        source: $router,
        clock: guard(duplexStore($router), { filter: ({ prev, next }) => 
        {
            if(routes && params)
                return pathCheck(prev.routes, next.routes, routes)
                    && paramsMatch(next.params, params)

            if(routes)
                return pathCheck(prev.routes, next.routes, routes)

            if(params)
                return paramsMatch(next.params, params);

            return false;
        } })
    })
}

const pathCheck = (prevPath: Routes, nextPath: Routes, targetPath: Routes) =>
{
    const nextPathTargetStartMatchIndex = nextPath.findIndex(token => token === targetPath[0]);
    const prevPathTargetStartMatchIndex = prevPath.findIndex(token => token === targetPath[0]);
    const didPrevPathMatch = fullRoutesMatch(prevPath, prevPathTargetStartMatchIndex, targetPath);
    const didNextPathMatch = fullRoutesMatch(nextPath, nextPathTargetStartMatchIndex, targetPath);

    // if it's no longer in path
    if(nextPathTargetStartMatchIndex === -1)
        return false;

    if(!didPrevPathMatch && didNextPathMatch)
        return true;

    if(didNextPathMatch && prevPathTargetStartMatchIndex !== nextPathTargetStartMatchIndex)
        return true;

    return false;
}