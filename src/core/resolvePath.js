import _ from 'lodash';

export const resolvePath = (currentPath, newPath, isAbsolute) =>
{
	let fullPath
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
				fullPath = [..._.dropRight(currentPath), ...newPath];
		}
	}

	const stack = [];

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