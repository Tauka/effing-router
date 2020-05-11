import { buildPath } from '../buildPath';

const routesConfig = {
  main: {
    name: 'main',
    children:
    {
      dashboard: {
        name: 'dashboard',
        path: '/welcome'
      },
      course: {
        name: 'course',
        path: '/lesson/:lessonId'
      },
      home: {
        name: 'home',
        path: '/this/is/my/home/:userId/:partyId/wow/that/:sessionId/cool/:is'
      }
    }
  },
}

test("simple path defined", () =>
{
  const path = ["main", "dashboard"];
  const params = {}

  expect(buildPath({ routes: path, params }, routesConfig)).toBe('/welcome')
})

test("path with params", () =>
{
  const path = ["main", "course"];
  const params = {
    lessonId: 5
  }

  expect(buildPath({ routes: path, params }, routesConfig)).toBe('/lesson/5')
})

test("complex path with params", () =>
{
  const path = ["main", "home"];
  const params = {
    userId: 5,
    partyId: 6,
    sessionId: 7,
    is: 8
  }

  expect(buildPath({ routes: path, params }, routesConfig)).toBe('/this/is/my/home/5/6/wow/that/7/cool/8')
})