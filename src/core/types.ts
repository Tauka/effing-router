import { Store, Event } from 'effector';
import React from 'react';

export type Path = string[];
export type Params = Record<string, string | number>;
export type ObjectQuery = {
	routes: Path;
  params: Params;
  replace?: boolean;
}
export type FunctionQuery = (a: ObjectQuery) => ObjectQuery;
export type StringQuery = string;
export type Query = FunctionQuery | ObjectQuery | StringQuery;

export type Router = Store<ObjectQuery>;
export type RouterPath = Store<Path>;
export type RouterParams = Store<Params>;
export interface RouterConfiguration {
	$: Router;
  _cfg: RoutesConfiguration;
  $path: RouterPath;
  $params: RouterParams;
  go: Event<Query>;
  set: Event<Query>;
  replace: Event<Query>;
  back: Event<void>;
}
export type ChangeRouter = Event<Query> | Event<void>;

export interface Redirect {
  condition: Store<boolean>;
  to: Query;
}
export interface Route {
  name: string;
  component: React.ComponentType<any>;
  path: string;
  children: [Route];
  redirect?: Redirect;
}

export interface RouteObject {
  name: string;
  component: React.ComponentType<any>;
  path: string;
  children: Record<string, Route>;
  redirect?: Redirect;
}

export interface RoutesConfiguration {
  [a: string]: Route;
}
export type RoutesList = [Route];
export type RoutesObject = Record<string, RouteObject>