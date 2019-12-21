import { merge } from 'effector';

import buildPath from './buildPath';

import { $router } from './router';
import { go, push, replace, back,
	pushReplace, pushLast, pushLastReplace, modifyRoute } from './events';

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

const pathnameGo = basename =>
{
	if(basename && window.location.pathname.includes(basename))
		go(window.location.pathname.replace(basename, ''));
	else
		go(window.location.pathname);
};

export const bindDom = (router, $deps, basename) =>
{
	$router.watch(merge([go, push, pushLast]), route =>
	{
		const stringPath = buildPath(
			router.cfg,
			route.path,
			route.params);

		browserHistoryPush(route, stringPath, basename);
	});

	$router.watch(merge([replace, pushReplace, pushLastReplace, modifyRoute]), route =>
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

	pathnameGo(basename);

	window.onpopstate = () =>
	{
		pathnameGo(basename);
	};
};