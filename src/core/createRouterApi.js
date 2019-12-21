import _ from 'lodash';
import { forward } from 'effector';
import { useStore } from 'effector-react';
import { go, push, replace, pushReplace,
	pushLast, pushLastReplace, back, modifyRoute } from './events';

import { $router } from './router';

export default () =>
{
	const $params = $router.map(r => r.params);
	const $bottom = $router.map(r => _.last(r.path));

	const createParamStore = paramKey => $params.map(params => params[paramKey] ?? null);

	const useParams = () =>
		useStore($params);

	const useLocationBottom = () =>
		useStore($bottom);

	const subscribeToParams = (param, store) =>
	{
		const fromStore = $params.map(s => s?.[param] ?? null);
		forward({ from: fromStore, to: store });
	};

	return {
		useParams,
		subscribeToParams,
		location: { useLocationBottom },
		go,
		push,
		replace,
		back,
		pushReplace,
		pushLast,
		pushLastReplace,
		modifyRoute,
		createParamStore,
		$router
	};
};