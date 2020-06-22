import { Store, Event } from 'effector';
import React from 'react';

export type Routes = (string | symbol)[];
export type Params = Record<string, string | number | boolean | null>;
export type ObjectQuery = {
	routes: Routes;
  params: Params;
}
export type FunctionQuery = (a: ObjectQuery) => Partial<ObjectQuery> | RoutesQuery | ParamsQuery;
export type StringQuery = string;
export type RoutesQuery = Routes;
export type ParamsQuery = Params;
export type Query = FunctionQuery | ObjectQuery | StringQuery;

export type Router = Store<ObjectQuery>;
export type RouterPath = Store<Routes>;
export type RouterParams = Store<Params>;
export interface RouterBase {
	$: Router;
  $routes: RouterPath;
  $params: RouterParams;
  go: Event<Query>;
  replace: Event<Query>;
  back: Event<void>;
}
export type ChangeRouter = Event<Query> | Event<void>;

export interface Redirect {
  condition: Store<boolean>;
  to: Query;
}
export interface Route {
  name: string | symbol;
  component?: React.ComponentType<any>;
  path?: string;
  children?: Array<Route>;
  redirect?: Redirect;
}

export interface RouteObject {
  name: string | symbol;
  component?: React.ComponentType<any>;
  path?: string;
  children?: Record<string, RouteObject>;
  redirect?: Redirect;
}

export type RoutesConfiguration = Record<string | symbol, RouteObject>;
export type RoutesList = Array<Route>;
export type PathList = {
  path: string;
  routes: (string | symbol)[];
}[]
export type RegexpList = {
  path: string;
  routes: string[];
  matcher: {
    keys: { name: string | symbol }[];
    regexp: RegExp;
  };
}[]