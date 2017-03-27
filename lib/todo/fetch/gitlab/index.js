const axios = require('axios');
const _ = require('lodash');

const gitlab = (tokens) => axios.create({
	baseURL: `${tokens.gitlab.repo}/api/v3/`,
	timeout: 10000,
	headers: {
		"PRIVATE-TOKEN": tokens.gitlab.token, // eslint-disable-line quotes
	},
});

module.exports = (tokens) => gitlab(tokens).get('/issues').then((issues) => {
	return _.map(issues.data, (issue) => {
		const splittedUrl = _.split(issue.web_url, '/');
		issue.projectName = splittedUrl[4];
		return issue;
	});
})
.catch(err => console.log(err));
