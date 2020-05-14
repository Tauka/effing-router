import { PathList, RegexpList } from "@core/types";

import { pathToRegexp } from './pathToRegexp';

export const pathListToRegexpList: (pathList: PathList) => RegexpList =
  pathList => {
    return pathList.map(listItem => ({
      ...listItem,
      matcher: pathToRegexp(listItem.path)
    }))
  }