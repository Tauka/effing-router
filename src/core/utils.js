import { createStore } from 'effector';

export const duplexStore = (store, cb) =>
{
	return createStore(
		{
			next: store.getState(),
			prev: store.getState(),
		})
		.on(store, ({ next: prev }, next) => ({ next, prev }));
};

export const isObject = obj =>
{
	return typeof obj === 'object' && obj !== null;
}