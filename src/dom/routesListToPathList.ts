import { RoutesList, PathList } from "@core/types";

export const routesListToPathList = (routesList: RoutesList) => {
  return recursivelyFindDeepestPath(routesList, []);
}

export const recursivelyFindDeepestPath = (routesList: RoutesList, routes: string[]) => {
  const routesListSortedByChildrenPresence = [...routesList].sort(a => {
    if(a.children)
      return -1

    return 1
  })

  return routesListSortedByChildrenPresence.reduce<PathList>((pathList, routeConfig) => {
    const result: PathList = [...pathList];
    if(routeConfig.children)
      result.push(...recursivelyFindDeepestPath(routeConfig.children, [...routes, routeConfig.name]))

    if(routeConfig.path)
      result.push({
        path: routeConfig.path,
        routes: [...routes, routeConfig.name],
      })

    return result;
  }, [])
}