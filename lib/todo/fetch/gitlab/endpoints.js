const axios = require('axios');
const _ = require('lodash');

const gitlab = (tokens) => axios.create({
	baseURL: `${tokens.gitlab.repo}/api/v3/`,
	timeout: 10000,
	headers: {
		"PRIVATE-TOKEN": tokens.gitlab.token, // eslint-disable-line quotes
	},
});

module.exports = {
	allRepos: {
		me: async function(tokens) {
            const issues = await gitlab(tokens).get('/issues', {per_page: 50})
            return issues.data = _.map(issues.data, (issue) => {
                const splittedUrl = _.split(issue.web_url, '/');
                issue.projectName = splittedUrl[4];
                return issue;
            });
		},

		unassigned: async function(tokens) {

		},
	},
	thisRepo: {
		me: async function(tokens) {

		},

		unassigned: async function(tokens) {

		},
	},
};