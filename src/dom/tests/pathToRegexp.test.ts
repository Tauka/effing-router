import { pathToRegexp } from '../pathToRegexp';

test("pathToRegexp basic", () => {
  const { keys, regexp } = pathToRegexp('/welcome');

  expect(keys.length).toBe(0);
  expect(regexp.exec('/welcome')).not.toBe(null);
  expect(regexp.exec('/welcome/tauka')).toBe(null);
})

test("pathToRegexp with params", () => {
  const { keys, regexp } = pathToRegexp('/lesson/:lessonId');

  expect(keys.length).toBe(1);
  expect(regexp.exec('/lesson/5')).not.toBe(null);
  expect(regexp.exec('/lesson/tauka')).not.toBe(null);
  expect(regexp.exec('/lesson/5/6')).toBe(null);
})

test("pathToRegexp with multiple params", () => {
  const { keys, regexp } = pathToRegexp('/lesson/:lessonId/:courseId');

  expect(keys.length).toBe(2);
  expect(regexp.exec('/lesson/5')).toBe(null);
  expect(regexp.exec('/lesson/tauka')).toBe(null);
  expect(regexp.exec('/lesson/5/6')).not.toBe(null);
})

test("complex path", () => {
  const { keys, regexp } = pathToRegexp('/this/is/my/home/:userId/:partyId/wow/that/:sessionId/cool/:is');

  expect(keys.length).toBe(4);
  expect(regexp.exec('/this/is/my/home/5/6/wow/that/7/cool/8')).not.toBe(null);
})