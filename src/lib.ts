import { createStore, Store } from 'effector';
import { FunctionQuery, ObjectQuery } from '@core/types';

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
	...fns: Array<(a: R) => R>
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
	return typeof arg === 'object';
}