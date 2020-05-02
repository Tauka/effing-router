import { go } from './events';

export const redirect = ($router, sourcePath, redirectCfg, routesCfg) =>
{
    const { to, condition } = redirectCfg;

    if(!routesCfg.hasOwnProperty(to))
        throw Error(`No such route path: ${routePathName}`);

    const conditionValue = condition.getState()

    // initial redirect
    go((path, params) =>
    {
        return {
            path: path.map(pathToken =>
                conditionValue && pathToken === sourcePath
                    ? to
                    : pathToken),
            params,
            replace: true
        };
    });

    $router.on(condition, (router, cond) =>
    {
        if(!cond)
            return router;

        let changed = false;

        const newPath = router.path.map(pathToken =>
        {
            if(pathToken === sourcePath)
            {
                changed = true;
                return to;
            }

            return pathToken;
        })

        if(!changed)
            return router;

        return { path: newPath, params: router.params }
    });
}