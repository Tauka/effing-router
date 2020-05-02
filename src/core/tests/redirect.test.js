import { restore, createEvent, createStore } from 'effector';

import { connectRouteApi } from '../connectRouteApi';
import { go } from '../events';
import { createRoutesConfig } from '../createRoutesConfig';
import { redirect } from '../redirect';

const evAuth = createEvent();
const $isNotAuth = restore(evAuth, false);

const routesList = [
  {
    path: "dashboard",
    component: () => {},
    redirect: {
      condition: $isNotAuth,
      to: "auth"
    }
  },
  {
    path: "auth",
    component: () => {},
  },
  {
    path: "main",
    component: () => {},
  },
  {
    path: "courses",
    component: () => {},
  },
  {
    path: "profile",
    component: () => {},
  }
]

const routesCfg = createRoutesConfig(routesList);

const wireRouter = $router =>
{
  connectRouteApi($router, routesCfg);
  routesList.forEach(route =>
	{
		if(route.redirect)
			redirect($router, route.path, route.redirect, routesCfg);
	})
}

let $router = null;
beforeEach(() =>
{
  $router = createStore({ path: [], params: {} });
  wireRouter($router);
})

test("router is triggered upon condition store change", () =>
{
  go('/dashboard');

  expect($router.getState()).toEqual({
    path: ["dashboard"],
    params: {}
  })

  evAuth(true);

  expect($router.getState()).toEqual({
    path: ["auth"],
    params: {}
  })
})

test("initial redirect", () =>
{
  evAuth(true);
  $router = createStore({ path: ["main", "dashboard"], params: {} });
  wireRouter($router);

  expect($router.getState()).toEqual({
    path: ["main", "auth"],
    params: {}
  })
})