import { RegexpList, ObjectQuery, Params } from "@core/types";
import { compact } from "@lib";

export const parsePath = (path: string, regexpList: RegexpList) => {
  const [pathWithoutSearch, searchParamsString] = path.split('?');
  const searchParamsObject = parseSearchParams(searchParamsString);

  let execResult: RegExpExecArray | null= null;
  let pathItem: RegexpList[0] | null = null;
  for (let i = 0; i < regexpList.length; i++) {
    execResult = regexpList[i].matcher.regexp.exec(pathWithoutSearch)
    if(execResult !== null)
    {
      pathItem = regexpList[i];
      break;
    }
  }

  if(execResult === null || pathItem === null)
    return {
      routes: defaultRoutesParser(pathWithoutSearch),
      params: searchParamsObject
    }

  if(!pathItem.matcher.keys.length)
    return {
      routes: pathItem.routes,
      params: searchParamsObject
    }

  return pathItem.matcher.keys.reduce((matchedQuery, key, index) => {
    matchedQuery.params[key.name as any] = (execResult as RegExpExecArray)[index + 1];
    return matchedQuery
  }, {
    routes: pathItem.routes,
    params: { ...searchParamsObject }
  } as ObjectQuery)
}

const defaultRoutesParser = (pathTokensString: string) => {
  const pathTokens = compact(pathTokensString.split('/'));
  return pathTokens;
}

const parseSearchParams = (searchParamsString: string) => {
  const searchParams = new URLSearchParams(searchParamsString);
  const params: Params = {}
  for (const [key, val] of searchParams.entries()) {
    params[key] = val;
  }

  return params;
}