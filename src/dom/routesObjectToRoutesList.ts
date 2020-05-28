import { RoutesConfiguration, RoutesList, Route } from "@core/types";

type routesConfigToRoutesList = (routesConfig: RoutesConfiguration) => RoutesList

export const routesObjectToRoutesList: routesConfigToRoutesList = routesConfig => {
  const routesList = Object.values(routesConfig).map(routeConfig => {
    if(routeConfig.children)
      return {
        ...routeConfig,
        children: routesObjectToRoutesList(routeConfig.children)
      }

    return routeConfig as Route
  })

  return routesList;
}