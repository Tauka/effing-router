import { buildPath } from '../buildPath';

const routesConfig = {
  main: {
    name: 'main',
    path: '/',
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
      },
      ratings: {
        name: 'ratings'
      },
      games: {
        name: 'games',
        path: '/last/of/us'
      },
      complex: {
        name: 'complex',
        path: '/complex/:pathId/woah'
      }
    }
  },
}

test("simple path defined", () =>
{
  const path = ["main", "dashboard"];
  const params = {}

  expect(buildPath({ routes: ["main", "dashboard"], params: {} }, routesConfig)).toBe('/welcome')
  expect(buildPath({ routes: ['main'], params: {} }, routesConfig)).toBe('/')
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

test("no path at grandest child", () =>
{
  const path = ["main", "ratings"];
  const params = {
    userId: 5
  }

  expect(buildPath({ routes: path, params }, routesConfig)).toBe('/main/ratings?userId=5')
})

test("path with unused params", () =>
{
  const path = ["main", "course"];
  const params = {
    lessonId: 5,
    bookId: 3,
    roomId: 2
  }

  expect(buildPath({ routes: path, params }, routesConfig)).toBe('/lesson/5?bookId=3&roomId=2')
})

test("insufficient keys", () =>
{
  const path = ["main", "complex"];
  const params = {
    wrathId: 3
  }

  expect(() => buildPath({ routes: path, params }, routesConfig)).toThrowError('Param :pathId is not defined')
})