import { RegexpList, ObjectQuery } from "@core/types";

export const parsePath = (path: string, regexpList: RegexpList) => {
  let execResult: RegExpExecArray | null= null;
  let pathItem: RegexpList[0] | null = null;
  for (let i = 0; i < regexpList.length; i++) {
    execResult = regexpList[i].matcher.regexp.exec(path)
    if(execResult !== null)
    {
      pathItem = regexpList[i];
      break;
    }
  }

  if(execResult === null || pathItem === null)
    return {
      routes: [],
      params: {}
    }

  if(!pathItem.matcher.keys.length)
    return {
      routes: pathItem.routes,
      params: {}
    }

  return pathItem.matcher.keys.reduce((matchedQuery, key, index) => {
    matchedQuery.params[key.name] = (execResult as RegExpExecArray)[index + 1];
    return matchedQuery
  }, {
    routes: pathItem.routes,
    params: {}
  } as ObjectQuery)
}