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
  },
  {
    name: 'main',
    children: [
      { name: 'courses' },
      { name: 'signin', path: '/auth/signin?language' },
      { name: 'signup', path: '/auth/signup?language' },
    ]
  }
]

test("correct recursive path list", () => {
  expect(recursivelyFindDeepestPath(routesList, [])).toEqual([
    {
      path: '/auth/signin?language',
      routes: ['main', 'signin'],
    },
    {
      path: '/auth/signup?language',
      routes: ['main', 'signup'],
    },
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