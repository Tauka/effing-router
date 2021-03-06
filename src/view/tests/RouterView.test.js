import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createStore } from 'effector';
import { render } from '@testing-library/react'

import { RouterView } from '../RouterView';

const makeReactComponent = id =>
{
  return ({ childRoute, parentId }) => <div id={id}> { parentId && `parent: ${parentId}` } { childRoute({ parentId: id }) } </div>
}

const routesList = [
  {
    name: "auth",
    component: makeReactComponent("auth")
  },
  {
    name: "main",
    component: makeReactComponent("main"),
    children: [
      {
        name: "dashboard",
        component: makeReactComponent("dashboard")
      },
    ]
  },
  {
    name: "courses",
    component: makeReactComponent("courses")
  },
  {
    name: "profile",
    component: makeReactComponent("profile")
  }
];


test("basic view", () =>
{
  const $routes = createStore(['main', 'dashboard']);
  const router = { $routes }

  const { container } = render(<RouterView router={router} routesList={routesList}/>)
  expect(container).toHaveDOMNesting(['main', 'dashboard']);
})

test("passing props to children", () =>
{
  const $routes = createStore(['main', 'dashboard']);
  const router = { $routes }

  const { container } = render(<RouterView router={router} routesList={routesList}/>)
  const dashboard = container.querySelector("#dashboard");
  expect(dashboard).toHaveTextContent('parent: main');
})