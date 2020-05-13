import { parsePath } from '../parsePath';

const pathList = [
  {
    path: '/welcome',
    query: {
      routes: ['main', 'dashboard'],
      params: {}
    },
  },
  {
    path: '/lesson/:lessonId',
    query: {
      routes: ['main', 'lesson'],
      params: {}
    },
  },
  {
    path: '/this/is/my/home/:userId/:partyId/wow/that/:sessionId/cool/:is',
    query: {
      routes: ['main', 'home'],
      params: {}
    },
  },
]

test("parsePath basic", () => {
  expect(parsePath('/welcome', pathList)).toEqual({
    routes: ['main', 'dashboard'],
    params: {}
  })
})

test("parsePath params", () => {
  expect(parsePath('/lesson/12', pathList)).toEqual({
    routes: ['main', 'lesson'],
    params: { lessonId: '12' }
  })

  expect(parsePath('/lesson/5', pathList)).toEqual({
    routes: ['main', 'lesson'],
    params: { lessonId: '5' }
  })
})

test("complex path", () => {
  expect(parsePath('/this/is/my/home/3/4/wow/that/5/cool/6', pathList)).toEqual({
    routes: ['main', 'home'],
    params: { 
      userId: '3',
      partyId: '4',
      sessionId: '5',
      is: '6'
    }
  })
})