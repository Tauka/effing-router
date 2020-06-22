import { forward, createStore } from 'effector';
import { Router, Params } from '@core/types';

export const createParamStoreFactory = ($router: Router) => (routeParams: string[] | string, defaultState: any ) =>
{
    if(typeof routeParams === 'string')
        return handleString($router, routeParams, defaultState)

    if(Array.isArray(routeParams))
        return handleArray($router, routeParams, defaultState)

    const $allParams = createStore<Params>(defaultState);
    forward(
    {
        from: $router.updates.map(({ params }) => params),
        to: $allParams
    });

    return $allParams;
};

export const handleString = ($router: Router, singleParam: string, defaultState: any) =>
    $router.map(({ params }) => {
        if(params[singleParam] === undefined)
            return defaultState;

        return params[singleParam]
    });

export const handleArray = ($router: Router, routeParams: string[], defaultState: any) =>
    routeParams.map(routeParam => handleString($router, routeParam, defaultState));