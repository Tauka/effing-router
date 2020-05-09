import { forward, createEvent } from 'effector';
import { Router } from '@core/types';

export const createParamStoreFactory = ($router: Router) => (routeParams: string[] | string) =>
{
    if(typeof routeParams === 'string')
        return handleString($router, routeParams)

    if(Array.isArray(routeParams))
        return handleArray($router, routeParams)

    const updateEvent = createEvent();
    forward(
    {
        from: $router.updates,
        to: updateEvent
    });

    return updateEvent;
};

export const handleString = ($router: Router, singleParam: string) =>
    $router.map(({ params }) => params[singleParam]);

export const handleArray = ($router: Router, routeParams: string[]) =>
    routeParams.map(routeParam => handleString($router, routeParam));