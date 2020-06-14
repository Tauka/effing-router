import { sample, Store, forward, createStore } from 'effector';

import { Router, Redirect, Query, Routes } from '@core/types';
import { go } from '../events';

export const connectGoRedirects = ($router: Router, redirectsMap: Record<string, Redirect>) => {
  const redirectStores = redirectsMapToRedirectsStores(redirectsMap);
  const $redirectToken = createStore<string | null>(null);
  sample({
    source: redirectStores,
    clock: $router,
    fn: (redirectStores, router) => {
      return findTruthyRedirectKey(redirectStores, router.routes);
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

const findTruthyRedirectKey = (redirectStores: Record<string, boolean>, routes: Routes) => {
  let redirectStoreKey = ''
  for(let i = 0; i < routes.length; i++) {
    if(i === 0)
      redirectStoreKey += routes[i];
    else
      redirectStoreKey += '.' + routes[i];

    if(redirectStores[redirectStoreKey])
      return redirectStoreKey;
  }

  return undefined;
}