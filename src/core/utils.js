import { createStore } from 'effector';

export const watchLastTwo = (store, cb) =>
{
	return createStore(
		{
			next: store.getState(),
			prev: store.getState(),
		})
		.on(store, ({ next: prev }, next) => ({ next, prev }))
		.watch(({ next, prev }) => cb(next, prev));
};