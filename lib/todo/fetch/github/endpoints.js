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
		if(repo) return {link: `http://api.github.com/repos/${repo}`, name: repo};
		return null;
	});
}

const currentGithubProject = async function(tokens) {
	const repo = await getThisRepo();
	if(repo && repo.link) {
		return await axios.create({
			baseURL: repo.link,
			timeout: 3000,
			headers: {
				Authorization: `Basic ${tokens.github}`,
			},
		});
	}
	return null;

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
			const data = await response.data.filter((issue) => (issue.assignee == null));
			return data;
		},
	},
	thisRepo: {
		me: async function(tokens) {
			username = await getUser(tokens).login;
			const githubProject = await currentGithubProject(tokens);
			
			if(!githubProject) return null;
			const issues = await githubProject.get('/issues', { params: { assignee: username}});
			const repo = await getThisRepo();
			return issues.data.map(issue => _.merge(issue, { repository: { name : repo.name	 }}));
		
		},

		unassigned: async function(tokens) {
			const githubProject = await currentGithubProject(tokens);
			if(!githubProject) return null;
			const issues = await githubProject.get('/issues', { params: { assignee: 'none'}});
			const repo = await getThisRepo();
			return issues.data.map(issue => _.merge(issue, { repository: { name : repo.name }}));
		},
	},
};
