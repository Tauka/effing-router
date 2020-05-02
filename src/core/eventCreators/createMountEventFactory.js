import { guard, sample } from 'effector';

import { duplexStore } from '../utils';

export const createMountEventFactory = $router => mountCfg =>
{
    if(typeof mountCfg === 'string')
    {
        const $path = $router.map(({ path }) => path);
        const $mountIndex = $path.map(p => p.findIndex(token => token === mountCfg));

        return sample(
        {
            source: $router,
            clock: guard($mountIndex, { filter: idx => idx > -1 }),
        })
    }

    if(typeof mountCfg === 'object' && mountCfg !== null)
    {
        const { path, params } = mountCfg;

        let pathChange = false;
        let paramChange = false;

        return sample(
        {
            source: $router,
            clock: guard(duplexStore($router), { filter: ({ prev, next }) => 
            {
                if(path && params)
                    return pathCheck(prev.path, next.path, path)
                        && paramsCheck(prev.params, next.params, params)

                if(path)
                    return pathCheck(prev.path, next.path, path)

                if(params)
                    return paramsCheck(prev.params, next.params, params);
            } })
        })
    }
}

const pathCheck = (prevPath, nextPath, targetPath) =>
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

const paramsCheck = (prevParams, nextParams, targetParams) =>
{
    for (const targetKey in targetParams) 
    {
        if(targetParams[targetKey] !== nextParams[targetKey])
            return false;
    }

    return true;
}

const fullPathMatch = (path, pathStartIndex, targetPath) =>
{
    for (let i = 0; i < targetPath.length; i++)
    {
        if(path[i + pathStartIndex] !== targetPath[i])
            return false;
    }

    return true;
}