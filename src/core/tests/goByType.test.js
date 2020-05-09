import { goByType } from '../goByType';

test("function query", () => {
  const initialRoute = { routes: ['main', 'dashboard'], params: { userId: 5 } };
  const query = () => ({ routes: ['walterWhite'], params: { userId: 5 }});

  expect(goByType(query, initialRoute)).toEqual({
    routes: ['walterWhite'],
    params: { userId: 5 }
  })
})