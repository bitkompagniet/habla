const constants = require('./constants');

module.exports = (query, endpoints, tokens) => {
	const repoMap = {
		[constants.REPOSITORY_ALL]: 'allRepos',
		[constants.REPOSITORY_CURRENT]: 'thisRepo',
	};
	const methodMap = {
		[constants.ASSIGNED_ME]: 'me',
		[constants.UNASSIGNED]: 'unassigned',
	};
	const repo = repoMap[query.repo];
	const method = methodMap[query.assignee];

	return endpoints[repo][method](tokens);
};


