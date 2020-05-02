import { createStore } from 'effector';

import { connectRouteApi } from '../connectRouteApi';
import { go } from '../events';

const routesCfg = 
{
  dashboard: { path: "dashboard" },
  auth: { path: "auth" },
  main: { path: "main" },
  courses: { path: "courses" },
  profile: { path: "profile" },
}

let $router = null;
beforeEach(() =>
{
  $router = createStore({ path: [], params: {} });
  connectRouteApi($router, routesCfg);
})

test("absolute path", () =>
{
  go('/profile');

  expect($router.getState()).toEqual({
    path: ["profile"],
    params: {}
  })

  go('/auth')

  expect($router.getState()).toEqual({
    path: ["auth"],
    params: {}
  })
})

test("no slash at the beginning", () =>
{
  go('/profile/main');

  expect($router.getState()).toEqual({
    path: ["profile", "main"],
    params: {}
  })

  go('auth')

  expect($router.getState()).toEqual({
    path: ["profile", "auth"],
    params: {}
  })
})

test("appending with ./", () =>
{
  go('/profile/main');

  expect($router.getState()).toEqual({
    path: ["profile", "main"],
    params: {}
  })

  go('./auth')

  expect($router.getState()).toEqual({
    path: ["profile", "main", "auth"],
    params: {}
  })
})

test("editing path with ../", () =>
{
  go('/profile/main/courses');

  expect($router.getState()).toEqual({
    path: ["profile", "main", "courses"],
    params: {}
  })

  // equivalent of go('auth')
  go('../auth')

  expect($router.getState()).toEqual({
    path: ["profile", "main", "auth"],
    params: {}
  })

  go('../../courses')

  expect($router.getState()).toEqual({
    path: ["profile", "courses"],
    params: {}
  })
})

test("complex relative path building", () =>
{
  go('/profile/main/courses/dashboard/profile');

  expect($router.getState()).toEqual({
    path: ["profile", "main", "courses", "dashboard", "profile"],
    params: {}
  })

  go('.././../../././../auth/dashboard')

  expect($router.getState()).toEqual({
    path: ["profile", "auth", "dashboard"],
    params: {}
  })
})

test("wrong relative path building", () =>
{
  go('/profile/main');

  expect($router.getState()).toEqual({
    path: ["profile", "main"],
    params: {}
  })

  // excessive .. do not take effect
  go('../../../../../../auth')

  expect($router.getState()).toEqual({
    path: ["auth"],
    params: {}
  })
})

test("params", () =>
{
  go('/profile/main?pageId=3&routeId=2');

  expect($router.getState()).toEqual({
    path: ["profile", "main"],
    params: {
      pageId: "3",
      routeId: "2"
    }
  })
})

test("duplicate params", () =>
{
  go('/profile/main?pageId=3&pageId=4');

  expect($router.getState()).toEqual({
    path: ["profile", "main"],
    params: {
      pageId: "4"
    }
  })
})