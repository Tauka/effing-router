import { guard, sample } from 'effector';

import { ObjectQuery, Router, Routes } from '@core/types';
import { duplexStore } from '@lib';
import { paramsMatch, fullPathMatch } from './lib';

type MountConfiguration = ObjectQuery | string;

export const createMountEventFactory = ($router: Router) => (mountCfg: MountConfiguration) =>
{
    if(typeof mountCfg === 'string')
        return handleString($router, mountCfg);

    if(typeof mountCfg === 'object' && mountCfg !== null)
        return handleObject($router, mountCfg);
}

const handleString = ($router: Router, mountCfg: string) => {
    const $path = $router.map(({ routes: path }) => path);
    const $mountIndex = $path.map(p => p.findIndex(token => token === mountCfg));

    return sample(
    {
        source: $router,
        clock: guard($mountIndex, { filter: idx => idx > -1 }),
    })
}

const handleObject = ($router: Router, mountCfg: ObjectQuery) => {
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
    const didPrevPathMatch = fullPathMatch(prevPath, prevPathTargetStartMatchIndex, targetPath);
    const didNextPathMatch = fullPathMatch(nextPath, nextPathTargetStartMatchIndex, targetPath);

    // if it's no longer in path
    if(nextPathTargetStartMatchIndex === -1)
        return false;

    if(!didPrevPathMatch && didNextPathMatch)
        return true;

    if(didNextPathMatch && prevPathTargetStartMatchIndex !== nextPathTargetStartMatchIndex)
        return true;

    return false;
}