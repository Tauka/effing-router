import { goByType } from '../goByType';

test("function query", () => {
  const initialRoute = { path: ['main', 'dashboard'], params: { userId: 5 } };
  const query = () => ({ path: ['walterWhite'], params: { userId: 5 }});

  expect(goByType(query, initialRoute)).toEqual({
    path: ['walterWhite'],
    params: { userId: 5 }
  })
})