import { RoutesList, Redirect } from '@core/types';

type RedirectsMap = Record<string, Redirect>;

export const routesListToRedirectsMap = (prefix: string, routesList: RoutesList): RedirectsMap  => {
  const mapPrefix = prefix
    ? `${prefix}.` : '';
  return routesList.reduce<RedirectsMap>((redirectsMap, routeObject) => {
    const key = `${mapPrefix}${routeObject.name}`;
    if(routeObject.redirect)
      redirectsMap[key] = routeObject.redirect;

    if(routeObject.children)
      redirectsMap = {
        ...redirectsMap,
        ...routesListToRedirectsMap(key, routeObject.children)
      };

    return redirectsMap;
  }, {});
}; 