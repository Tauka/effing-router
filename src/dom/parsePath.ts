import { RegexpList, ObjectQuery, Params } from "@core/types";
import { compact } from "@lib";

const defaultParser = (path: string) => {
 	const [ pathTokensString, paramsTokensString ] = path.split('?')
 	const pathTokens = compact(pathTokensString.split('/'));
 	const searchParams = new URLSearchParams(paramsTokensString);
 	const paramsObj: Params = {};

 	for(const [ key, value ] of searchParams)
 	{
 		paramsObj[key] = value;
 	}

 	return {
 		routes: pathTokens,
 		params: paramsObj
 	};

}

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
    return defaultParser(path);

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