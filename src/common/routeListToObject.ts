import { RoutesList, RoutesConfiguration } from "@core/types";

export const routeListToObject: (routesList: RoutesList) => RoutesConfiguration = (routesList: RoutesList) => {
  const resultList = routesList.map(route => {
    if(!route.children)
      return route;

    return {
      ...route,
      children: routeListToObject(route.children)
    }
  })

  return arrayToObject(resultList);
}

const arrayToObject = (arr: ({name: any} & Record<string, any>)[]) => {
  return arr.reduce((obj: Record<string, any>, route) => {
    obj[String(route.name)] = route;
    return obj;
  }, {})
}