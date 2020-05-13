import { PathList, PathListWithMatcher, ObjectQuery } from "@core/types";
import { pathToRegexp } from './pathToRegexp';

export const pathListToRegexpList: (pathList: PathList) => PathListWithMatcher =
  pathList => {
    return pathList.map(listItem => ({
      ...listItem,
      matcher: pathToRegexp(listItem.path)
    }))
  }

export const parsePath = (path: string, pathList: PathList) => {
  // FIXME: it should be done statically inside bindDom call
  const listWithMatcher = pathListToRegexpList(pathList)

  let execResult: RegExpExecArray | null= null;
  let pathItem: PathListWithMatcher[0] | null = null;
  for (let i = 0; i < listWithMatcher.length; i++) {
    execResult = listWithMatcher[i].matcher.regexp.exec(path)
    if(execResult !== null)
    {
      pathItem = listWithMatcher[i];
      break;
    }
  }

  if(execResult === null || pathItem === null)
    return {
      routes: {},
      params: []
    }

  if(!pathItem.matcher.keys.length)
    return pathItem.query;

  return pathItem.matcher.keys.reduce((matchedQuery, key, index) => {
    matchedQuery.params[key.name] = (execResult as RegExpExecArray)[index + 1];
    return matchedQuery
  }, {
    routes: pathItem.query.routes,
    params: {}
  } as ObjectQuery)
}