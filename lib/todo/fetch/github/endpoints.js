const axios = require('axios');
const nodegit = require('nodegit');
const projectUrls = require('../../../project-urls');
const _ = require('lodash');

const github = (tokens) => axios.create({
	baseURL: 'https://api.github.com/',
	timeout: 3000,
	headers: {
		Authorization: `Basic ${tokens.github}`,
	},
});

const getUser = (tokens) => axios.create({
	baseURL: 'https://api.github.com/user',
	timeout: 3000,
	headers: {
		Authorization: `Basic ${tokens.github}`,
	},
});

function getThisRepo() {
	return projectUrls.baseUrl().then(url => {
		const repo = url.split('https://github.com/')[1];
		return `http://api.github.com/repos/${repo}`;
	});
}

const currentGithubProject = (tokens) => {
	return getThisRepo().then(url =>
		axios.create({
			baseURL: url,
			timeout: 3000,
			headers: {
				Authorization: `Basic ${tokens.github}`,
			},
		})
	);
};



module.exports = {
	allRepos: {
		me: async function (tokens) {
			const response = await github(tokens).get('/issues');
			return response.data;
		},

		unassigned: async function(tokens) {
			const response = await github(tokens).get('/issues', {
				params: {
					filter: 'all',
				},
			})
			return response.data
		},
	},
	thisRepo: {
		me: async function(tokens) {
			username = await getUser(tokens).login;
			const githubProject = await currentGithubProject(tokens);
			const issues = await githubProject.get('/issues', { params: { assignee: username}});
			const repo = await getThisRepo();
			return issues.data.map(issue => _.merge(issue, { repository: { name : repo }}));
		},

		unassigned: async function(tokens) {
			const githubProject = await currentGithubProject(tokens);
			const issues = await githubProject.get('/issues', { params: { assignee: 'none'}});
			const repo = await getThisRepo();
			return issues.data.map(issue => _.merge(issue, { repository: { name : repo }}));
		},
	},
};
