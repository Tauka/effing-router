import { merge } from 'effector';

import buildPath from './buildPath';

import { $router } from './router';
import { go, replace, set, back } from './events';

const browserHistoryBack = () =>
	window.history.back();

const browserHistoryPush = (route, stringPath, basename = '') =>
{
	window.history.pushState(
		route,
		null,
		`${basename}${stringPath}`);
};

const browserHistoryReplace = (route, stringPath, basename = '') =>
{
	window.history.replaceState(
		route,
		null,
		`${basename}${stringPath}`);
};

const pathnameFactory = ev => basename =>
{
	if(basename && window.location.pathname.includes(basename))
		ev(window.location.pathname.replace(basename, '') + window.location.search);
	else
		ev(window.location.pathname + window.location.search);
}

const pathnameSet = pathnameFactory(set);

export const bindDom = (router, $deps, basename) =>
{
	$router.watch(go, (route, go) =>
	{
		const stringPath = buildPath(
			route.path,
			route.params);

		if(go.replace)
			return browserHistoryReplace(route, stringPath, basename);

		browserHistoryPush(route, stringPath, basename);
	});

	$router.watch(back, route =>
	{
		browserHistoryBack();
	});

	$router.watch(route =>
	{
		if(!route.path.length)
			return;

		const stringPath = buildPath(
			route.path,
			route.params);

		browserHistoryPush(route, stringPath, basename);
	})

	pathnameSet(basename);

	window.onpopstate = () =>
	{
		pathnameSet(basename);
	};
};