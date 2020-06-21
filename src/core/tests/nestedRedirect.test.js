import { restore, createEvent, createStore, clearNode } from 'effector';

import { go, replace } from '../events';
import { initializeRouter } from '../initializeRouter';
import { $router } from '../router';

let evNotAuth;
let $isNotAuth;
let routesList;
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

  wireRouter(routesList);
  $router.setState($router.defaultState);
})

const wireRouter = (routesList) =>
{
  initializeRouter(routesList);
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