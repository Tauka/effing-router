import { createStore, Store, combine } from 'effector';
import { FunctionQuery, ObjectQuery, RoutesQuery, ParamsQuery } from '@core/types';

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

export const routeObjectPath: any = (obj: Record<string, any>, pathArr: string[]) => {
	const path = pathArr[0];

	if(pathArr.length === 1)
		return obj[path]

	if(typeof obj[path] !== 'object' || obj[path] === null)
		throw new Error(`Invalid path, expected route at ${path}`);

	if(!obj[path].children)
		throw new Error(`Invalid path, expected childen at ${path}`);

	return routeObjectPath(obj[path].children, pathArr.slice(1));
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