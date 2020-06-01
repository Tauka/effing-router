import { createStore } from 'effector';

const $isAuth = createStore(true);
const $hasScoresPerm = createStore(true);

import { routesListToRedirectsMap } from '../routeListToRedirectsMap';

const mainRedirect = {
  to: () => ({ routes: ['profile'], params: {} }),
  condition: $isAuth.map(isAuth => !isAuth)
};
const profileRedirect = {
  to: () => ({ routes: ['main'], params: {} }),
  condition: $isAuth
};
const scoresRedirect = {
  to: () => ({ routes: ['dashboard'], params: {} }),
  condition: $hasScoresPerm.map(v => !v)
};

const routesList = [
  {
    name: 'main',
    redirect: mainRedirect
  },
  {
    name: 'profile',
    redirect: profileRedirect,
    children: [
      {
        name: 'scores',
        redirect: scoresRedirect
      }
    ]
  },
  {
    name: 'dashboard'
  }
]

test("converts routes list to redirects map", () => {
  const redirectsMap = routesListToRedirectsMap('', routesList);
  expect(redirectsMap.main).toBe(mainRedirect);
  expect(redirectsMap.profile).toBe(profileRedirect);
  expect(redirectsMap['profile.scores']).toBe(scoresRedirect);
})