import { restore, createEvent, clearNode } from 'effector';

import { go, replace } from '../events';
import { initializeRouter } from '../initializeRouter';
import { ROUTE_NOT_FOUND } from '../constants';
import { $router } from '../router';

let evNotAuth;
let makeAdmin;
let $isNotAuth;
let $isAdmin;
let routesList;
beforeEach(() =>
{
  evNotAuth = createEvent();
  makeAdmin = createEvent();
  $isNotAuth = restore(evNotAuth, false);
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
        to: () => ({
          routes: ["main", "courses"],
          params: { userId: 5 }
        })
      },
      children: [
        {
          name: "signin",
          component: () => {}
        }
      ]
    },
    {
      name: "main",
      component: () => {},
      children: [
        {
          name: "courses",
          component: () => {},
        }
      ]
    },
    {
      name: "profile",
      component: () => {},
      children: [
        {
          name: "scores",
          component: () => {},
          redirect: {
            condition: $isNotAuth,
            to: ["auth", "signin"]
          }
        }
      ]
    }
  ]

  $router.setState($router.defaultState);
  wireRouter($router, routesList);
})

afterEach(() => {
  clearNode(evNotAuth);
  clearNode(makeAdmin);
  clearNode($router);
  clearNode($isNotAuth);
  clearNode($isAdmin);
})

const wireRouter = ($router, routesList) =>
{
  initializeRouter(routesList);
}

test("router is triggered upon condition store change", () =>
{
  go('dashboard');

  expect($router.getState()).toEqual({
    routes: ["dashboard"],
    params: {}
  })

  evNotAuth(true);

  expect($router.getState()).toEqual({
    routes: ["auth"],
    params: {}
  })
})

test("router is triggered upon condition store change (object query)", () =>
{
  go('auth');

  expect($router.getState()).toEqual({
    routes: ["auth"],
    params: {}
  })

  makeAdmin(true);

  expect($router.getState()).toEqual({
    routes: ["main", "courses"],
    params: { userId: 5 }
  })
})

test("initial redirect", () =>
{
  evNotAuth(true);
  $router.setState($router.defaultState);
  wireRouter($router, routesList);
  replace(() => ({
    routes: ["dashboard"],
    params: {}
  }))

  expect($router.getState()).toEqual({
    routes: ["auth"],
    params: {}
  })
})

test("do not redirect if not in routes", () =>
{
  go('main');
  expect($router.getState()).toEqual({
    routes: ["main"],
    params: {}
  })
  evNotAuth(true);
  expect($router.getState()).toEqual({
    routes: ["main"],
    params: {}
  })
})

test("redirect upper level", () =>
{
  go(['auth', 'signin']);
  expect($router.getState()).toEqual({
    routes: ["auth", "signin"],
    params: {}
  })
  makeAdmin(true);
  expect($router.getState()).toEqual({
    routes: ["main", "courses"],
    params: { userId: 5 }
  })
})

test("redirect on go", () =>
{
  makeAdmin(true);
  go(['auth', 'signin']);
  expect($router.getState()).toEqual({
    routes: ["main", "courses"],
    params: { userId: 5 }
  })
})

test("nonexitent route - 404", () =>
{
  go(['auth', 'karamba']);
  expect($router.getState()).toEqual({
    routes: [ROUTE_NOT_FOUND],
    params: {}
  })
})