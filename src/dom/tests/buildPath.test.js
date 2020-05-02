import { buildPath } from '../buildPath';

test("basic buildPath", () =>
{
  const path = ["main", "dashboard"];
  const params = {
    userId: 3,
    courseId: 6
  }

  expect(buildPath(path, params)).toBe('/main/dashboard?userId=3&courseId=6')
})

test("only path", () =>
{
  const path = ["main", "dashboard"];
  const params = {}

  expect(buildPath(path, params)).toBe('/main/dashboard')
})

test("only params", () =>
{
  const path = [];
  const params = {
    userId: 3,
    courseId: 6
  }

  expect(buildPath(path, params)).toBe('/?userId=3&courseId=6')
})