import { guard, sample } from 'effector';

import { duplexStore } from '@lib';
import { Router, ObjectQuery } from '@core/types';
import { paramsMatch, fullPathMatch } from './lib';

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
            const prevIdx = prev.path.findIndex(t => t === unmountCfg);
            const nextIdx = next.path.findIndex(t => t === unmountCfg);

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
    const { path: targetPath, params: targetParams } = unmountCfg;

    const evUnmount = guard(duplexStore($router), 
    {
        filter: ({ next, prev }) =>
        {
            const prevPathTargetStartMatchIndex = prev.path.findIndex(token => token === targetPath[0]);
            const nextPathTargetStartMatchIndex = next.path.findIndex(token => token === targetPath[0]);
            const didPrevPathMatch = fullPathMatch(prev.path, prevPathTargetStartMatchIndex, targetPath);
            const didNextPathMatch = fullPathMatch(next.path, nextPathTargetStartMatchIndex, targetPath);
            const didPrevParamsMatch = paramsMatch(prev.params, targetParams);
            const didNextParamsMatch = paramsMatch(next.params, targetParams);

            if(targetPath && targetParams)
                return (didPrevPathMatch && didPrevParamsMatch)
                    && (!didNextPathMatch || !didNextParamsMatch)

            if(targetPath)
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