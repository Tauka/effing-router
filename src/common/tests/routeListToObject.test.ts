import { routeListToObject } from '../routeListToObject';

const routeList = [
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
]

test("converts routeList to routeObject", () => {
  expect(routeListToObject(routeList)).toEqual(
    {
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
    })
})