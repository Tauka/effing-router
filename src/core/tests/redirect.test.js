import { restore, createEvent, createStore } from 'effector';

import { go } from '../events';
import { initializeRouter } from '../initializeRouter';

let evAuth;
let makeAdmin;
let $isNotAuth;
let $isAdmin;
let routesList;
let $router = null;
beforeEach(() =>
{
  evAuth = createEvent();
  makeAdmin = createEvent();
  $isNotAuth = restore(evAuth, false);
  $isAdmin = restore(makeAdmin, false);

  routesList = [
    {
      name: "dashboard",
      component: () => {},
      redirect: {
        condition: $isNotAuth,
        to: "auth"
      }
    },
    {
      name: "auth",
      component: () => {},
      redirect: {
        condition: $isAdmin,
        to: {
          path: ["main", "courses"],
          params: { userId: 5 }
        }
      }
    },
    {
      name: "main",
      component: () => {},
    },
    {
      name: "courses",
      component: () => {},
    },
    {
      name: "profile",
      component: () => {},
    }
  ]

  $router = createStore({ path: [], params: {} });
  wireRouter($router, routesList);
})

// const routesCfg = createRoutesConfig(routesList);

const wireRouter = ($router, routesList) =>
{
  initializeRouter({ $: $router }, routesList);
}

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

test("router is triggered upon condition store change (object query)", () =>
{
  go('/auth');

  expect($router.getState()).toEqual({
    path: ["auth"],
    params: {}
  })

  makeAdmin(true);

  expect($router.getState()).toEqual({
    path: ["main", "courses"],
    params: { userId: 5 }
  })
})

test("initial redirect", () =>
{
  evAuth(true);
  $router = createStore({ path: ["main", "dashboard"], params: {} });
  wireRouter($router, routesList);

  expect($router.getState()).toEqual({
    path: ["main", "auth"],
    params: {}
  })
})