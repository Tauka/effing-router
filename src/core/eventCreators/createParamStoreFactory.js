import { forward, createEvent } from 'effector';

export const createParamStoreFactory = $router => routeParams =>
{
    // single param notation
    if(typeof routeParams === 'string')
        return handleString(routeParams)

    // multiple param notation
    if(Array.isArray(routeParams))
        return handleArray(routeParams)

    const updateEvent = createEvent();
    forward(
    {
        from: $router.updates,
        to: updateEvent
    });

    return updateEvent;
};

export const handleString = ($router, singleParam) =>
{
    return $router.map(({ params }) => params[singleParam]);
}

export const handleArray = ($router, routeParams) =>
{
    return routeParams.map(routeParam => handleString($router, routeParam));
}