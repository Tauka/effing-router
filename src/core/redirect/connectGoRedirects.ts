import { sample, Store, forward, createStore } from 'effector';

import { routesListToRedirectsMap } from './routesListToRedirectsMap';
import { RoutesList, Router, Redirect, Query } from '@core/types';
import { go } from '../events';

export const connectGoRedirects = ($router: Router, routesList: RoutesList) => {
  const redirectsMap = routesListToRedirectsMap(routesList);
  const redirectStores = redirectsMapToRedirectsStores(redirectsMap);
  const $redirectToken = createStore<string | null>(null);
  sample({
    source: redirectStores,
    clock: $router,
    fn: (redirectStores, router) => {
      return router.routes.find(routeName =>
        redirectStores[routeName]);
    },
    target: $redirectToken
  });

  forward({
    from: $redirectToken.map(routeName => { if(routeName) return redirectsMap[routeName].to }) as Store<Query>,
    to: go
  })
}

const redirectsMapToRedirectsStores = (redirectsMap: Record<string, Redirect>) => {
  return Object.entries(redirectsMap).reduce<Record<string, Store<boolean>>>((redirectStores, [ key, value ]) => {
    redirectStores[key] = value.condition;
    return redirectStores;
  }, {})
}