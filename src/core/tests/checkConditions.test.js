import { createStore } from 'effector';

import { checkConditions } from '../redirect';

const $isNotAuth = createStore(true);

const routesCfg = 
{
  dashboard: {
    path: "dashboard",
    children: {
      main: {
        path: "main",
        redirect: {
          condition: $isNotAuth,
          to: "auth"
        },
        children: {
          courses: { path: "courses" },
        }
      },
    }
  },
  auth: { path: "auth" }
}

test("redirect if condition is met, and drop children", () =>
{
  const path = ["dashboard", "main", "courses"];
  const params = { userId: 5 };

  const newRoute = checkConditions(routesCfg)({ routes: path, params });

  expect(newRoute).toEqual({
    routes: ["dashboard", "auth"],
    params: { userId: 5 }
  })
})

test("object query notation", () =>
{
  const path = ["dashboard", "main", "courses"];
  const params = { userId: 5 };

  routesCfg.dashboard.children.main.redirect.to = {
    routes: ["auth", "promo"],
    params: { tab: "login" }
  }

  const newRoute = checkConditions(routesCfg)({ routes: path, params });

  expect(newRoute).toEqual({
    routes: ["auth", "promo"],
    params: { tab: "login" }
  })
})