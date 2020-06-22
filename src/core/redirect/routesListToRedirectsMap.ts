import { RoutesList, Redirect } from '@core/types';

type RedirectsMap = Record<string, Redirect>;

export const routesListToRedirectsMap = (routesList: RoutesList)  => {
  return collectRedirectsRecursively('', routesList);
};

const collectRedirectsRecursively = (prefix: string, routesList: RoutesList) => {
  const mapPrefix = prefix
    ? `${prefix}.` : '';
  return routesList.reduce<RedirectsMap>((redirectsMap, routeObject) => {
    const key = `${mapPrefix}${String(routeObject.name)}`;
    if(routeObject.redirect)
      redirectsMap[key] = routeObject.redirect;

    if(routeObject.children)
      redirectsMap = {
        ...redirectsMap,
        ...collectRedirectsRecursively(key, routeObject.children)
      };

    return redirectsMap;
  }, {});
}