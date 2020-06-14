import { forward, guard } from 'effector';
import { go } from '../events';
import { Redirect, Router } from '../types';
import { every, isSubset } from '@lib';

export const setupRedirects = ($router: Router, redirectsMap: Record<string, Redirect>) => {
  Object.entries(redirectsMap).forEach(([ redirectKey, redirect]) => {
    setRedirect($router, redirect, redirectKey);
  });
}

export const setRedirect = ($router: Router, redirect: Redirect, redirectKey: string) =>
{
  const { to, condition } = redirect;

  const $isCurrentRouteInRouter =
    $router.map(({ routes }) =>
    {
      const routeKeys = nestedKeyToRouteKeys(redirectKey)
      if(typeof routeKeys === 'string')
        return routes.some(route => route === routeKeys)
      else
        return isSubset(routes, routeKeys)
    })

  forward({
      from: guard(condition, { filter: every($isCurrentRouteInRouter, condition) }),
      to: go.prepend(() => to)
  })
}

const nestedKeyToRouteKeys = (nestedKey: string) => {
  if(!nestedKey.includes('.'))
    return nestedKey;

  return nestedKey.split('.');
}