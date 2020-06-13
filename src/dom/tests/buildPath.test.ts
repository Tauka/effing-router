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
        path: '/last/of/us?chapter=chapterNum&mainHero'
      },
      hotel: {
        name: 'hoten',
        path: 'hotel?'
      },
      complex: {
        name: 'complex',
        path: '/complex/:pathId/woah?userId=personId'
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

test("path with query params", () =>
{
  const path = ["main", "games"];
  const params = {
    chapterNum: 2,
    mainHero: 'ellie',
  }

  expect(buildPath({ routes: path, params }, routesConfig)).toBe('/last/of/us?chapter=2&mainHero=ellie')
})

test("path with no slash and query mark, but no params", () =>
{
  const path = ["main", "hotel"];
  const params = {}

  expect(buildPath({ routes: path, params }, routesConfig)).toBe('/hotel')
})

test("itemId and queryId", () =>
{
  const path = ["main", "complex"];
  const params = {
    pathId: 3,
    personId: 2
  }

  expect(buildPath({ routes: path, params }, routesConfig)).toBe('/complex/3/woah?userId=2')
})


test("insufficient keys", () =>
{
  const path = ["main", "complex"];
  const params = {
    pathId: 3
  }

  expect(() => buildPath({ routes: path, params }, routesConfig)).toThrowError('Param personId is not defined')
})