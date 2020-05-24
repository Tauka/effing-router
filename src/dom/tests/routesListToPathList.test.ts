import { recursivelyFindDeepestPath } from '../routesListToPathList';

const routesList = [
  {
    name: 'dashboard',
    path: '/',
    children: [
      {
        name: 'courses',
        path: '/learning'
      },
      {
        name: 'leaderboard',
        path: '/whosdabest'
      },
      {
        name: 'competition',
        path: '/mortalKombat',
        children: [
          {
            name: 'regional',
            path: '/challenge'
          },
          {
            name: 'worldwide',
            path: '/worldChallenge'
          }
        ]
      }
    ]
  },
  {
    name: 'logout',
    path: '/gtfo'
  }
]

test("correct recursive path list", () => {
  expect(recursivelyFindDeepestPath(routesList, [])).toEqual([
    {
      path: '/challenge',
      routes: ['dashboard', 'competition', 'regional'],
    },
    {
      path: '/worldChallenge',
      routes: ['dashboard', 'competition', 'worldwide'],
    },
    {
      path: '/mortalKombat',
      routes: ['dashboard', 'competition'],
    },
    {
      path: '/learning',
      routes: ['dashboard', 'courses'],
    },
    {
      path: '/whosdabest',
      routes: ['dashboard', 'leaderboard'],
    },
    {
      path: '/',
      routes: ['dashboard'],
    },
    {
      path: '/gtfo',
      routes: ['logout'],
    },
  ])
})

const routesListNoPath =
[
	{
		name: 'app',
		redirect:
		{
			to: 'dashboard',
		},
		children: [
			{
				name: 'dashboard',
			},
			{
				name: 'profile',
			},
			{
				name: 'table',
			}]
	}
]

test("no path", () => {
  expect(recursivelyFindDeepestPath(routesListNoPath, [])).toEqual([])
})