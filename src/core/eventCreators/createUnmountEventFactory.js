import { guard, sample } from 'effector';

import { duplexStore } from '../utils';

export const createUnmountEventFactory = $router => unmountCfg =>
{
    let evUnmount = null;
    if(typeof unmountCfg === 'string') {
        evUnmount = guard(duplexStore($router), 
        {
            filter: ({ next, prev }) =>
            {
                const prevIdx = prev.path.findIndex(t => t === unmountCfg);
                const nextIdx = next.path.findIndex(t => t === unmountCfg);

                if(prevIdx === -1)
                    return false;

                return nextIdx !== prevIdx;
            }
        })
    }

    if(typeof unmountCfg === 'object' && unmountCfg !== null) {
        const { path: targetPath, params: targetParams } = unmountCfg;

        evUnmount = guard(duplexStore($router), 
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
            }
        })
    }

    if(evUnmount === null)
        throw Error('createUnmountEvent argument is neither string nor object');

    return sample(
    {
        source: $router,
        clock: evUnmount
    })
}

const paramsMatch = (params, targetParams) =>
{
    for (const targetKey in targetParams) {
        if(targetParams[targetKey] !== params[targetKey])
            return false
    }

    return true;
}

const fullPathMatch = (path, pathStartIndex, targetPath) =>
{
    if(pathStartIndex === -1)
        return false;

    for (let i = 0; i < targetPath.length; i++)
    {
        if(path[i + pathStartIndex] !== targetPath[i])
            return false;
    }

    return true;
}