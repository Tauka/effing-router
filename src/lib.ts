import { createStore, Store, combine } from 'effector';
import { FunctionQuery, ObjectQuery, RoutesQuery, ParamsQuery, RoutesConfiguration } from '@core/types';

export type Noop = () => {};

export const duplexStore = <T>(store: Store<T>) =>
{
	return createStore(
		{
			next: store.getState(),
			prev: store.getState(),
		})
		.on(store, ({ next: prev }, next) => ({ next, prev }));
};

export const isObject = (obj: {}) =>
{
	return typeof obj === 'object' && obj !== null;
}

export const dropRight = (arr: any[]) =>
{
	return arr.slice(0, arr.length - 1);
}

export const noop = () => undefined;

export const compact = (arr: any[]) =>
{
	return arr.filter(i => Boolean(i));
}

export const pipe = <T extends any[], R>(
	fn1: (...args: T) => R,
	...fns: Array<(a: any) => any>
 ) => {
	const piped = fns.reduce((prev, fn) => {
		return (value: R) => prev(fn(value))
	}, value => value);

	return (...args: T) => piped(fn1(...args));
}

export const isFunctionQuery = (fn: any): fn is FunctionQuery => {
	return typeof fn === 'function' && fn !== null;
}

export const isObjectQuery = (arg: any): arg is ObjectQuery => {
	return typeof arg === 'object'
		&& 'routes' in arg
		&& 'params' in arg;
}

export const isPartialObjectQuery = (arg: any): arg is Partial<ObjectQuery> => {
	return typeof arg === 'object'
		&& ('routes' in arg || 'params' in arg);
}

export const isRoutesQuery = (arg: any): arg is RoutesQuery => {
	return Array.isArray(arg);
}

export const isParamsQuery = (arg: any): arg is ParamsQuery => {
	return typeof arg === 'object';
}

export const routeObjectPath: any = (obj: RoutesConfiguration, routesArr: (string | symbol)[]) => {
const path = routesArr[0];

if(routesArr.length === 1 && obj[path as any])
		return obj[path as any]

if(typeof obj[path as any] !== 'object' || obj[path as any] === null)
		throw new Error(`Invalid path, expected route at ${String(path)}`);

	if(!obj[path as any].children)
		throw new Error(`Invalid path, expected childen at ${String(path)}`);

	return routeObjectPath(obj[path as any].children, routesArr.slice(1));
}

export const every = (...booleanStores: Store<boolean>[]) => {
	return combine(booleanStores, storeValues => storeValues.every(v => v));
}

export const isSubset = <T>(superset: T[], subset: T[]) => {
	const firstKeyMatch = superset.findIndex(supersetItem => supersetItem === subset[0]);
	if(firstKeyMatch === undefined)
		return false;

	for (let i = 0; i < subset.length; i++) {
		if(superset[i + firstKeyMatch] !== subset[i])
			return false;
	}

	return true;
}

export const uninit = (functionName: string, moduleName: string) => {
	return () => {
		throw new Error(`Cannot access "${functionName}" before initialization of "${moduleName}"`);
	}
}