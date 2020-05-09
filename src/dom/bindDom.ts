import { Event } from 'effector';
import buildPath from './buildPath';
import { ObjectQuery, Query, RouterConfiguration, StringQuery } from 'src/core/types';

export const bindDom = (router: RouterConfiguration, basename: string) =>
{
	const { $, go, replace, set, back } = router;
	const pathnameSet = pathnameFactory(set as Event<StringQuery>);

	$.watch(go, (route: ObjectQuery, go: Query) =>
	{
		const stringPath = buildPath(
			route.routes,
			route.params);

		if(typeof go === 'object' && go.replace)
			return browserHistoryReplace(route, stringPath, basename);

		browserHistoryPush(route, stringPath, basename);
	});

	$.watch(replace, route =>
	{
		const stringPath = buildPath(
			route.routes,
			route.params);

		browserHistoryReplace(route, stringPath, basename);
	});

	$.watch(back, () =>
	{
		browserHistoryBack();
	});

	pathnameSet(basename);

	window.onpopstate = () =>
	{
		pathnameSet(basename);
	};
};

const browserHistoryBack = () =>
	window.history.back();

const browserHistoryPush = (route: ObjectQuery, stringPath: string, basename = '') =>
{
	window.history.pushState(
		route,
		'',
		`${basename}${stringPath}`);
};

const browserHistoryReplace = (route: ObjectQuery, stringPath: string, basename = '') =>
{
	window.history.replaceState(
		route,
		'',
		`${basename}${stringPath}`);
};

const pathnameFactory = (ev: Event<StringQuery>) => (basename: string) =>
{
	if(basename && window.location.pathname.includes(basename))
		ev(window.location.pathname.replace(basename, '') + window.location.search);
	else
		ev(window.location.pathname + window.location.search);
}