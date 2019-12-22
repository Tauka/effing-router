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
	$router.watch(go, route =>
	{
		const stringPath = buildPath(
			router.cfg,
			route.path,
			route.params);

		browserHistoryPush(route, stringPath, basename);
	});

	$router.watch(replace, route =>
	{
		const stringPath = buildPath(
			router.cfg,
			route.path,
			route.params);

		browserHistoryReplace(route, stringPath, basename);
	});

	if($deps)
		$router.watch($deps, route =>
		{
			const stringPath = buildPath(
				router.cfg,
				route.path,
				route.params);

			if(!stringPath)
				return;

			browserHistoryReplace(route, stringPath, basename);
		});

	$router.watch(back, route =>
	{
		browserHistoryBack();
	});

	pathnameSet(basename);

	window.onpopstate = () =>
	{
		pathnameSet(basename);
	};
};