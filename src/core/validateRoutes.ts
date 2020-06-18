import { Routes, RoutesConfiguration } from "./types";

export const validateRoutes = (routes: Routes, routesCfgObject?: RoutesConfiguration): boolean => {
  if(!routes.length)
    return true;

  if(!routesCfgObject)
    return false;

  if(routesCfgObject[routes[0] as string])
    return validateRoutes(routes.slice(1), routesCfgObject[routes[0] as string].children)

  return false;
}