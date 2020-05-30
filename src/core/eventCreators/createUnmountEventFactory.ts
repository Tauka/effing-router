import { guard, sample } from 'effector';

import { duplexStore } from '@lib';
import { Router, ObjectQuery } from '@core/types';
import { paramsMatch, fullRoutesMatch } from './lib';

export const createUnmountEventFactory = ($router: Router) => (unmountCfg: ObjectQuery | string) =>
{
    if(typeof unmountCfg === 'string')
        return handleString($router, unmountCfg);

    if(typeof unmountCfg === 'object' && unmountCfg !== null)
        return handleObject($router, unmountCfg);
}

const handleString = ($router: Router, unmountCfg: string) => {
    const evUnmount = guard(duplexStore($router), {
        filter: ({ next, prev }) =>
        {
            const prevIdx = prev.routes.findIndex(t => t === unmountCfg);
            const nextIdx = next.routes.findIndex(t => t === unmountCfg);

            if(prevIdx === -1)
                return false;

            return nextIdx !== prevIdx;
        }
    })

    return sample(
    {
        source: $router,
        clock: evUnmount
    })
}

const handleObject = ($router: Router, unmountCfg: ObjectQuery) => {
    const { routes: targetRoutes, params: targetParams } = unmountCfg;

    const evUnmount = guard(duplexStore($router), 
    {
        filter: ({ next, prev }) =>
        {
            const prevPathTargetStartMatchIndex = prev.routes.findIndex(token => token === targetRoutes[0]);
            const nextPathTargetStartMatchIndex = next.routes.findIndex(token => token === targetRoutes[0]);
            const didPrevPathMatch = fullRoutesMatch(prev.routes, prevPathTargetStartMatchIndex, targetRoutes);
            const didNextPathMatch = fullRoutesMatch(next.routes, nextPathTargetStartMatchIndex, targetRoutes);
            const didPrevParamsMatch = paramsMatch(prev.params, targetParams);
            const didNextParamsMatch = paramsMatch(next.params, targetParams);

            if(targetRoutes && targetParams)
                return (didPrevPathMatch && didPrevParamsMatch)
                    && (!didNextPathMatch || !didNextParamsMatch)

            if(targetRoutes)
                return didPrevPathMatch && !didNextPathMatch;

            if(targetParams)
                return didPrevParamsMatch && !didNextParamsMatch;

            return false;
        }
    })

    return sample(
    {
        source: $router,
        clock: evUnmount
    })
}