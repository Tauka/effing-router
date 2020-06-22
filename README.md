# Effing-router

Effing-router is a config-based router with support of [effector](https://github.com/zerobias/effector) as first-class citizen

* Excellent integration with **effector**
* Full **Typescript** support
* **ES modules** and **tree-shaking** support
* Modularity and **customizations**

## How it works (or why another routing library)
`effing-router` utilizes different routing model than react-router.

Instead of **parsing** url and rendering routes that match path, `effing-router` offers routing by specifying routes (parts of your application) that you want to render, and **url** gets compiled out of routes as *side-effect*.

## Installation
```
npm install effing-router

# yarn
yarn add effing-router
```


## Getting started
```javascript
import { router, initializeRouter } from 'effing-router';
import { bindDom } from 'effing-router/dom';
import { RouterView } from 'effing-router/react';

const Main = ({ childRoute }) => {
  return <div>
    <h1> Main </h1>
    <div>
      { childRoute() }
    </div>
  </div>
}

const Profile = () => {
  return <div>
    This is my profile
    <a onClick={() => router.go('news')}> Go to news </a>
  </div>
}

const News = () => {
  return <div>
    News
    <a onClick={() => router.go('profile')}> Go to profile </a>
  </div>
}

const Auth = () => {
  return <div> Signin </div>
}

const routes = [
  {
    name: 'main',
    component: Main,
    children: [
      {
        name: 'profile',
        component: Profile,
        path: '/myProfile'
      },
      {
        name: 'news',
        component: News,
        path: '/news'
      }
    ]
  },
  {
    name: 'auth',
    component: Auth
  }
]

initializeRouter(routes)
bindDom(router, routes)

// rendering routes
export const App = () => {
  return <RouterView
    router={router}
    routesList={routesList}
  />
}
```

## Working with effector
### Fetching data on route mount
```javascript
import { forward, createEffect, restore } from 'effector';
import { router } from 'effing-router';

const fxGetStats = createEffect().use(statsApi);
const $stats = restore(fxGetStats, null);

forward({
  from: router.createMountEvent("dashboard"),
  to: fxGetStats
});
```

Demo: https://codesandbox.io/s/clever-firefly-89zp4?file=/src/features/Dashboard.tsx

### Cleaning up on route unmount
```javascript
import { createEvent, restore } from 'effector';
import { router } from 'effing-router';

const setData = createEvent<string[]>();
const $data = restore(setData, []);

const evDashboardUnmount = router.createUnmountEvent("dashboard");
$data.reset(evDashboardUnmount);
```

Demo: https://codesandbox.io/s/great-cache-jfnq9?file=/src/features/Dashboard.tsx

### Working with params
```javascript
import { router } from 'effing-router';

const $userId = router.createParamsStore('userId'),
$userId.watch(id => console.log('new user id: ', id))

router.go({ userId: 5 }); // 'new user id: 5'
router.go({ userId: 6 }); // 'new user id: 6'
```

Demo: https://codesandbox.io/s/determined-jennings-t6fjq?file=/src/features/Dashboard.tsx

### Syncing store with url
```javascript
import { restore, createEvent } from 'effector';
import { router } from 'effing-router';

const setPosition = createEvent();
const positionString = new URLSearchParams(location.search).get('position');
const $position = restore(setPosition, positionString ? JSON.parse(positionString) : { x: 0, y: 0 });

// router.go, router.replace are usual effector events
forward({
  from: $position,
  to: router.replace.prepend((position) => ({ position: JSON.stringify(position) }))
})
```

Demo: https://codesandbox.io/s/hungry-pare-lrsvx?file=/src/features/Dashboard.tsx

## Core API

### `router`
Main instance of router, it is a collection of events and functions that perform routing. Router state consists of two main part: **routes** and **params**
```javascript
{
  routes: ['main', 'users'],
  params: { userId: 5 }
}
```

**Routes** specify *what you want to render*, i.e. what parts of your application, which are identified by their respective *name* on routes list.

**Params** specifty *how you want to render*, it can contain any data related to route state. You can persist any application data in params.

### `initializeRouter(router, routesList)`

Accepts router object and list of routes configuration

#### Route configuration shape
```javascript
{
  name: 'main',
  component: Main,
  children: [
    {
      name: 'news',
      component: News,
      path: '/news/:newsId'
    },
    {
      name: 'users',
      component: Users,
      redirect: {
        condition: $noUsers,
        to: 'news'
      }
    }
  ]
}
```

Only required prop is `name`. However, if you use `RouterView` from `effing-router/react`, you will have to specify `component`

#### Redirects
Redirect configuration can be specified for each route, it consists of two required properties: `condition` and `to`. 

`condition` is a boolean store, and if has value `true`, redirects to `to`. It is reactive, which means redirect can be triggered both on `router.go` and when condition store becomes `true`

`to` can be any form of argument of `router.go`, basically `router.go` gets called with `to`

#### Compiling path

`path` is used to compile url. When specifiying route, the grandest child's `path` will be used, parents `path` will be ignored

```javascript
// state
{
  routes: ['main', 'news'],
  params: { newsId: 7 }
}

/*
* router will look for 'news' route's path,
* because it is present, path will be compiled to
* 
* /news/7
*/
```

If not specified, path will be compiled from route names **concatenated** with **/** as delimeter, all params will be compiled with `URLSearchParams`.

```javascript
// state
{
  routes: ['main', 'users'],
  params: { userId: 5 }
}

/*
* there is not path specified for 'users',
* by default it will be compiled to
*
* /main/users?userId=5
*/
```

### `router.go`
Used to navigate to new route
```javascript
import { router } from 'effing-router';

// relative routing, changes between siblings
// ['main', 'news'] => ['main', 'music']
router.go('music');

// absolute routing, does not change params
router.go(['main', 'music']);

// routing based on previous route
router.go(prevRoute => {
  routes: [...prevRouter.routes, 'main', 'music'],
  params: {
    ...prevRouter.params
    userCount: prevRouter.params.userCount + 1
  }
});

// writes new key-value params, overwrites if exists
router.go({ userId: 5 });
```

You can find more overloads in docs.

### `router.replace`
It has same signatures as `go`, but instead of pushing new entry into history stack, it replaces last

### `router.createMountEvent`
Creates event that is triggered when particular route (optionally with particular params) is visited.

Can be useful to perform on mount logic
```javascript
router.createMountEvent(['main', 'music']) // triggered when router.go(['main', 'music'])

router.createMountEvent({
  routes: ['main', 'music'],
  params: { musicId: 5 }
}) // triggered only when visited with particular params
```

### `router.createUnmountEvent`
It has same signatures as `createMountEvent`, but gets triggered when you leave particular route (optionally with particular params)

### `router.createParamsStore`
Create store that holds value of particular param, gets updated when that param is changed

```javascript
const $userId = createParamsStore('userId');
```

See [Working with params](#working-with-params)

## DOM API

DOM API is separated from core to its own module at `effing-router/dom`

### `bindDom(router, routesList, basename = '')`
Accepts router instance. It will synchronize router state with **browser url**. It will have no effect in non-browser environments.

## React API

API for rendering routes as React components, it's located at `effing-router/react`

### `<RouterView router routesList/>`
Renders route tree

#### childRoute()

Each rendered component gets passed a `childRoute` function as prop, it is used to render child routes, and you can also pass additional props inside

```javascript
const Main = ({ childRoute }) => {
  return <div>
    Main route
    { childRoute({ someExtraProp: 3 }) }
  </div>
}
```

### `useRouter()`

Hook for accessing current router state. Also can be useful for conditional rendering
```javascript
import { useRouter } from 'effing-router/react';

const Users = ({ childRoute }) => {
  const { path, params } = useRouter();

  return <div>
    User id: { params.userId }
    {path.includes('news') && <News/>}
  </div>
}
```

## License

[MIT](LICENSE)