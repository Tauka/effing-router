import buildPath from './buildPath';

export const bindDom = (router, basename) =>
{
	const { $, go, replace, set, back } = router;
	const pathnameSet = pathnameFactory(set);

	$.watch(go, (route, go) =>
	{
		const stringPath = buildPath(
			route.path,
			route.params);

		if(typeof go === 'object' && go.replace)
			return browserHistoryReplace(route, stringPath, basename);

		browserHistoryPush(route, stringPath, basename);
	});

	$.watch(replace, (route, go) =>
	{
		const stringPath = buildPath(
			route.path,
			route.params);

		browserHistoryReplace(route, stringPath, basename);
	});

	$.watch(back, route =>
	{
		browserHistoryBack();
	});

	pathnameSet(basename);

	window.onpopstate = () =>
	{
		console.log('onpopstate');
		pathnameSet(basename);
	};
};

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