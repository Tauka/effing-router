import { goQuery } from '../goQuery';

test("() => { routes, params } - replace what you can, leave the rest", () => {
  const initialRoute = { routes: ['main', 'dashboard'], params: { userId: 5 } };
  const query = () => ({ routes: ['walterWhite'], params: { bookId: 3 }});

  expect(goQuery(query, initialRoute)).toEqual({
    routes: ['walterWhite'],
    params: { bookId: 3 }
  })

  const query2 = () => ({ routes: ['heisenberg'] });
  expect(goQuery(query2, initialRoute)).toEqual({
    routes: ['heisenberg'],
    params: { userId: 5 }
  })

  const query3 = () => ({ params: { roomId: 7 } });
  expect(goQuery(query3, initialRoute)).toEqual({
    routes: ['main', 'dashboard'],
    params: { roomId: 7 }
  })
})

test("{ routes, params } - full replace", () => {
  const initialRoute = { routes: ['main', 'dashboard'], params: { userId: 5 } };
  const query = { routes: ['walterWhite'], params: { courseId: 6 }}

  expect(goQuery(query, initialRoute)).toEqual({
    routes: ['walterWhite'],
    params: { courseId: 6 }
  })
})

test(`"" - last replace`, () => {
  const initialRoute = { routes: ['main', 'dashboard'], params: { userId: 5 } };
  const query = 'walterWhite';

  expect(goQuery(query, initialRoute)).toEqual({
    routes: ['main', 'walterWhite'],
    params: { userId: 5 }
  })
})

test("[] - full replace of routes, no change to params", () => {
  const initialRoute = { routes: ['main', 'dashboard'], params: { userId: 5 } };
  const query = ['auth', 'signin'];

  expect(goQuery(query, initialRoute)).toEqual({
    routes: ['auth', 'signin'],
    params: { userId: 5 }
  })
})

test("() => [] - full replace of routes, empty params", () => {
  const initialRoute = { routes: ['main', 'dashboard'], params: { userId: 5 } };
  const query = () => ['auth', 'signin'];

  expect(goQuery(query, initialRoute)).toEqual({
    routes: ['auth', 'signin'],
    params: {}
  })
})

test("() => {} - no change to routes, replace params", () => {
  const initialRoute = { routes: ['main', 'dashboard'], params: { userId: 5 } };
  const query = () => ({ isAdmin: true });

  expect(goQuery(query, initialRoute)).toEqual({
    routes: ['main', 'dashboard'],
    params: { isAdmin: true }
  })
})