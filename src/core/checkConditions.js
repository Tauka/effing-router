import { isObject } from './utils';

export const checkConditions = (path, params, routesCfg) =>
{
    let newPath = [];
    let newParams = params;
    for (let i = 0; i < path.length; i++) {
        const { redirect } = routesCfg[path[i]];
        if(redirect && redirect.condition.getState())
        {
            const redirected = redirectTo(newPath, newParams, redirect.to);
            newPath = redirected.path;
            newParams = redirected.params;
            break;
        }

        newPath.push(path[i])
    }

    return { path: newPath, params: newParams };
}

const redirectTo = (newPath, newParams, to) =>
{
    if(typeof to === 'string')
        return { path: [...newPath, to ], params: {} };

    if(isObject(newPath))
    {
        return {
            path: [...newPath,...to.path],
            params: to.params
        }
    }
}
