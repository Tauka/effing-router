import { goQuery } from '../goQuery';

test("function query full replace", () => {
  const initialRoute = { routes: ['main', 'dashboard'], params: { userId: 5 } };
  const query = () => ({ routes: ['walterWhite'], params: { userId: 5 }});

  expect(goQuery(query, initialRoute)).toEqual({
    routes: ['walterWhite'],
    params: { userId: 5 }
  })
})

test("object query - full replace", () => {
  const initialRoute = { routes: ['main', 'dashboard'], params: { userId: 5 } };
  const query = { routes: ['walterWhite'], params: { courseId: 6 }}

  expect(goQuery(query, initialRoute)).toEqual({
    routes: ['walterWhite'],
    params: { courseId: 6 }
  })
})

test("string query - last replace", () => {
  const initialRoute = { routes: ['main', 'dashboard'], params: { userId: 5 } };
  const query = 'walterWhite';

  expect(goQuery(query, initialRoute)).toEqual({
    routes: ['main', 'walterWhite'],
    params: { userId: 5 }
  })
})