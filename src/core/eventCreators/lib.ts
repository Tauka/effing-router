import { Params, Path } from "@core/types";

export const paramsMatch = (params: Params, targetParams: Params) =>
{
    for (const targetKey in targetParams) {
        if(targetParams[targetKey] !== params[targetKey])
            return false
    }

    return true;
}

export const fullPathMatch = (path: Path, pathStartIndex: number, targetPath: Path) =>
{
    if(pathStartIndex === -1)
        return false;

    for (let i = 0; i < targetPath.length; i++)
    {
        if(path[i + pathStartIndex] !== targetPath[i])
            return false;
    }

    return true;
}