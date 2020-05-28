import { forward, guard } from 'effector';
import { go } from '../events';
import { Redirect, RoutesList, Router, Route } from '../types';

export const setupRedirects = ($router: Router, routesList: RoutesList) => {
  routesList.forEach(route => {
    if (route.redirect) redirect($router, route);
  });
}

export const redirect = ($router: Router, route: Route) =>
{
  const { to, condition } = route.redirect as Redirect;

  const $isCurrentRouteInRouter =
    $router.map(({ routes }) =>
      routes.some(routeName =>
          routeName === route.name))

  forward({
      from: guard(condition, { filter: $isCurrentRouteInRouter }),
      to: go.prepend(() => to)
  })
}