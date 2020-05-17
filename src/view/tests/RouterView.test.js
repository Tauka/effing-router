import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createStore } from 'effector';
import { render } from '@testing-library/react'

import { RouterView } from '../RouterView';
import { routeListToObject } from '../../core/routeListToObject';

const makeReactComponent = id =>
{
  return ({ childRoute, parentId }) => <div id={id}> { parentId && `parent: ${parentId}` } { childRoute({ parentId: id }) } </div>
}

const routesList = [
  {
    name: "dashboard",
    component: makeReactComponent("dashboard")
  },
  {
    name: "auth",
    component: makeReactComponent("auth")
  },
  {
    name: "main",
    component: makeReactComponent("main")
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

const routesCfg = routeListToObject(routesList);

test("basic view", () =>
{
  const $path = createStore(['main', 'dashboard']);
  const router = {
    _cfg: routesCfg,
    $path
  }

  const { container } = render(<RouterView routerConfig={router}/>)
  expect(container).toHaveDOMNesting(['main', 'dashboard']);
})

test("passing props to children", () =>
{
  const $path = createStore(['main', 'dashboard']);
  const router = {
    _cfg: routesCfg,
    $path
  }

  const { container } = render(<RouterView routerConfig={router}/>)
  const dashboard = container.querySelector("#dashboard");
  expect(dashboard).toHaveTextContent('parent: main');
})