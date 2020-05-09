import { createStore } from 'effector';

import { checkConditions } from '../checkConditions';

const $isNotAuth = createStore(true);

const routesCfg = 
{
  dashboard: { path: "dashboard" },
  auth: { path: "auth" },
  main: {
    path: "main",
    redirect: {
      condition: $isNotAuth,
      to: "auth"
    }
  },
  courses: { path: "courses" },
}

test("redirect if condition is met, and drop children", () =>
{
  const path = ["dashboard", "main", "courses"];
  const params = { userId: 5 };

  const newRoute = checkConditions(routesCfg)({ path, params });

  expect(newRoute).toEqual({
    path: ["dashboard", "auth"],
    params: {}
  })
})

test("object query notation", () =>
{
  const path = ["dashboard", "main", "courses"];
  const params = { userId: 5 };

  routesCfg.main.redirect.to = {
    path: ["auth", "promo"],
    params: { tab: "login" }
  }

  const newRoute = checkConditions(routesCfg)({ path, params });

  expect(newRoute).toEqual({
    path: ["dashboard", "auth", "promo"],
    params: { userId: 5, tab: "login" }
  })
})