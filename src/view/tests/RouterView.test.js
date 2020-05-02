import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createStore } from 'effector';
import { render } from '@testing-library/react'

import { RouterView } from '../RouterView';
import { createRoutesConfig } from '../../core/createRoutesConfig';

const makeReactComponent = id =>
{
  return ({ childRoute, parentId }) => <div id={id}> { parentId && `parent: ${parentId}` } { childRoute({ parentId: id }) } </div>
}

const routesList = [
  {
    path: "dashboard",
    component: makeReactComponent("dashboard")
  },
  {
    path: "auth",
    component: makeReactComponent("auth")
  },
  {
    path: "main",
    component: makeReactComponent("main")
  },
  {
    path: "courses",
    component: makeReactComponent("courses")
  },
  {
    path: "profile",
    component: makeReactComponent("profile")
  }
];

const routesCfg = createRoutesConfig(routesList);

test("basic view", () =>
{
  const $path = createStore(['main', 'dashboard']);
  const router = {
    _cfg: routesCfg,
    $path
  }

  const { container } = render(<RouterView router={router}/>)
  expect(container).toHaveDOMNesting(['main', 'dashboard']);
})

test("passing props to children", () =>
{
  const $path = createStore(['main', 'dashboard']);
  const router = {
    _cfg: routesCfg,
    $path
  }

  const { container } = render(<RouterView router={router}/>)
  const dashboard = container.querySelector("#dashboard");
  expect(dashboard).toHaveTextContent('parent: main');
})