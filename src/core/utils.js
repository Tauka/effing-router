import { createStore } from 'effector';

export const commonPath = (p1, p2) =>
{
	const newPath = [];

	for(let i = 0; i < p1.length; i ++)
	{
		if(p1[i] === p2[0])
			break;

		newPath.push(p1[i]);
	}

	for(let i = 0; i < p2.length; i ++)
	{
		newPath.push(p2[i]);
	}

	return newPath;
};

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