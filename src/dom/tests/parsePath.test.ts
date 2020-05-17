import { parsePath } from '../parsePath';
import { pathListToRegexpList } from '../pathListToRegexpList';

const pathList = [
  {
    path: '/welcome',
    routes: ['main', 'dashboard'],
  },
  {
    path: '/lesson/:lessonId',
    routes: ['main', 'lesson'],
  },
  {
    path: '/this/is/my/home/:userId/:partyId/wow/that/:sessionId/cool/:is',
    routes: ['main', 'home'],
  },
]

const regexpList = pathListToRegexpList(pathList);

test("parsePath basic", () => {
  expect(parsePath('/welcome', regexpList)).toEqual({
    routes: ['main', 'dashboard'],
    params: {}
  })
})

test("parsePath params", () => {
  expect(parsePath('/lesson/12', regexpList)).toEqual({
    routes: ['main', 'lesson'],
    params: { lessonId: '12' }
  })

  expect(parsePath('/lesson/5', regexpList)).toEqual({
    routes: ['main', 'lesson'],
    params: { lessonId: '5' }
  })
})

test("complex path", () => {
  expect(parsePath('/this/is/my/home/3/4/wow/that/5/cool/6', regexpList)).toEqual({
    routes: ['main', 'home'],
    params: { 
      userId: '3',
      partyId: '4',
      sessionId: '5',
      is: '6'
    }
  })
})