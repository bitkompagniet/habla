const format = require('string-template');
const repositoryUrl = require('./repository-url');

const protocol = 'http://';

function baseUrl() {
	return repositoryUrl()
		.then(url => {
			if (url.match(/^https/i)) {
				return url.replace(/\.git$/, '');
			} else {
				return `http://${url.match(/^git@(.+?)\.git$/)[1].replace(':', '/')}`;
			}
		});
}

function formatWithBase(template, extraParams) {
	return baseUrl()
		.then(url => ({ base: `${url}` }))
		.then(o => Object.assign(o, extraParams))
		.then(params => format(template, params));
}

function issuesUrl() {
	return baseUrl().then(base => formatWithBase(`${base}/issues`, {}));
}

function issueUrl(no) {
	return baseUrl().then(base => formatWithBase(`${base}/issues/${no}`, {}));
}

module.exports = {
	baseUrl,
	issuesUrl,
	issueUrl,
};
