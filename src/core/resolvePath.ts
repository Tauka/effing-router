import { dropRight } from '@lib';

export const resolvePath = (currentPath: string[], newPath: string[], isAbsolute: boolean) =>
{
	let fullPath: string[];
	{
		if(isAbsolute)
			fullPath = newPath
		else
		{
			// this behavior is a bit weird from the inside
			// we have to account for relative paths that start with .. and .
			// in such case, last entry of currentPath mustn't be deleted
			// in order for this to work:
			// 1/2 + ../3/4 => 1/3/4
			// 1/2 + ./3/4 => 1/2/3/4
			if(newPath[0] === '..' || newPath[0] === '.')
				fullPath = [...currentPath, ...newPath];
			else
				fullPath = [...dropRight(currentPath), ...newPath];
		}
	}

	const stack: number[] = [];

	fullPath.forEach((pathToken, index) =>
	{
		if(pathToken === '.')
			return;

		if(pathToken === '..')
			return stack.pop();

		stack.push(index);
	});

	return stack.map(idx => fullPath[idx]);
}