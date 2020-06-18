import { restore, createEvent, createStore, clearNode } from 'effector';

import { go, replace } from '../events';
import { initializeRouter } from '../initializeRouter';

let evNotAuth;
let $isNotAuth;
let routesList;
let $router = null;
beforeEach(() =>
{
  evNotAuth = createEvent();
  $isNotAuth = restore(evNotAuth, false);

  routesList = [
    {
      name: "auth",
      component: () => {},
      children: [
        {
          name: "signin",
          component: () => {}
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

  $router = createStore({ routes: [], params: {} });
  wireRouter($router, routesList);
})

const wireRouter = ($router, routesList) =>
{
  initializeRouter({ $: $router }, routesList);
}

test("nested redirect", () =>
{
  go(['profile', 'scores']);
  expect($router.getState()).toEqual({
    routes: ["profile", "scores"],
    params: {}
  })
  evNotAuth(true);
  expect($router.getState()).toEqual({
    routes: ["auth", "signin"],
    params: {}
  })
})