import { routesObjectToRoutesList } from '../routesObjectToRoutesList';

const routesObject = {
  dashboard: {
    name: 'dashboard',
    children: {
      courses: { name: 'courses' },
      leaderboard: { name: 'leaderboard' },
      competition: {
        name: 'competition',
        children: {
          regional: { name: 'regional' },
          worldwide: { name: 'worldwide' },
        }
      },
    }
  },
  logout: { name: 'logout' }
}

test("convert routes config to routes list", () => {
  expect(routesObjectToRoutesList(routesObject)).toEqual([
    {
      name: 'dashboard',
      children: [
        {
          name: 'courses'
        },
        {
          name: 'leaderboard'
        },
        {
          name: 'competition',
          children: [
            {
              name: 'regional'
            },
            {
              name: 'worldwide'
            }
          ]
        }
      ]
    },
    {
      name: 'logout'
    }
  ]);
})