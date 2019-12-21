import _ from 'lodash';

const tokenizePath = path =>
{
	return _.compact(path.split('/'));
};

export default tokenizePath;