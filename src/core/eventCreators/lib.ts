import { Params, Routes } from "@core/types";

export const paramsMatch = (params: Params, targetParams: Params) =>
{
    for (const targetKey in targetParams) {
        if(targetParams[targetKey] !== params[targetKey])
            return false
    }

    return true;
}

export const fullPathMatch = (path: Routes, pathStartIndex: number, targetPath: Routes) =>
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