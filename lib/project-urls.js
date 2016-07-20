const format = require('string-template');
const repositoryUrl = require('./repository-url');

const protocol = 'http://';

function baseUrl() {
	return repositoryUrl().then(url => `${url.match(/^git@(.+?)\.git$/)[1].replace(':', '/')}`);
}

function formatWithBase(template, extraParams) {
	return baseUrl()
		.then(url => ({ base: `${url}` }))
		.then(o => Object.assign(o, extraParams))
		.then(params => format(template, params));
}

function issuesUrl() {
	return formatWithBase(`${protocol}{base}/issues`, {});
}

function issueUrl(no) {
	return formatWithBase(`${protocol}{base}/issues/{no}`, { no });
}

module.exports = {
	baseUrl,
	issuesUrl,
	issueUrl,
};
