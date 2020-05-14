import { Event } from 'effector';
import buildPath from './buildPath';
import { ObjectQuery, Query, RouterConfiguration, RegexpList } from 'src/core/types';
import { routesListToPathList } from './routesListToPathList';
import { routesObjectToRoutesList } from './routesObjectToRoutesList';
import { pipe } from '@lib';
import { pathListToRegexpList } from './pathListToRegexpList';
import { parsePath } from './parsePath';

export const bindDom = (router: RouterConfiguration, basename: string) =>
{
	const { $, go, replace, set, back, _cfg } = router;
	const regexpList = pipe(
		routesObjectToRoutesList,
		routesListToPathList,
		pathListToRegexpList
	)(_cfg);
	const pathnameSet = pathnameFactory(regexpList, set as Event<ObjectQuery>);

	$.watch(go, (route: ObjectQuery, go: Query) => {
		const stringPath = buildPath(route, _cfg);

		if(typeof go === 'object' && go.replace)
			return browserHistoryReplace(route, stringPath, basename);

		browserHistoryPush(route, stringPath, basename);
	});

	$.watch(replace, route => {
		const stringPath = buildPath(route, _cfg);
		browserHistoryReplace(route, stringPath, basename);
	});

	$.watch(back, () => {
		browserHistoryBack();
	});

	pathnameSet(basename);

	window.onpopstate = () => {
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

const pathnameFactory = (regexpList: RegexpList, ev: Event<ObjectQuery>) => (basename: string) =>
{
	const stringPath = basename && window.location.pathname.includes(basename)
		? window.location.pathname.replace(basename, '') + window.location.search
		: window.location.pathname + window.location.search;

	ev(parsePath(stringPath, regexpList));
}