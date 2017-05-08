const axios = require('axios');
const _ = require('lodash');
const projectUrls = require('../../../project-urls');

const gitlab = (tokens) => axios.create({
	baseURL: `${tokens.gitlab.repo}/api/v3/`,
	timeout: 10000,
	headers: {
		"PRIVATE-TOKEN": tokens.gitlab.token, // eslint-disable-line quotes
	},
});


function getThisRepo() {
	return projectUrls.baseUrl().then(url => {
		urlSplit = url.split('/')
		return urlSplit[urlSplit.length-1];
	});
}

module.exports = {
	allRepos: {
		me: async function(tokens) {
			const issues = await gitlab(tokens).get('/issues', {per_page: 100});
			return issues.data = _.map(issues.data, (issue) => {
				const splittedUrl = _.split(issue.web_url, '/');
				issue.projectName = splittedUrl[4];
				return issue;
			});
		},

		unassigned: async function(tokens) {
			const issues = [];
			const pulls = [];
			const allProjects = await gitlab(tokens).get('/projects');
			allProjects.data.forEach(function(project) {
				pulls.push(new Promise((resolve, reject) => {
					gitlab(tokens).get(`/projects/${project.id}/issues`).then((issuesInProject)=>{
						_.forEach(issuesInProject.data, function(issue) {
							if(!issue.assignee) {
								issues.push(issue);
							}
						}, this);
						resolve();
					}).catch(reject);
				}));
			}, this);
			const promises = await Promise.all(pulls);
			return issues;
		},
	},
	thisRepo: {
		me: async function(tokens) {
			const currentProject = await getThisRepo();
			const projectSearch = await gitlab(tokens).get(`projects/search/${currentProject}`, { per_page: 100 });
			const id = (projectSearch.data[0]) ? projectSearch.data[0].id : null
			if(!id) return null;
			const issues = await gitlab(tokens).get(`projects/${id}/issues`, { per_page: 100 });
			
			// Adding project names:
			issues.data = _.map(issues.data, (issue) => {
				issue.projectName = _.split(issue.web_url, '/')[4];
				return issue;
			});

			// Sorting to unassigned out:
			issues.data = _.filter(issues.data, (issue) => {
				return issue.assignee != null; // Should be me. Not just somebody.
			});
			return issues.data
		},

		unassigned: async function(tokens) {
			const currentProject = await getThisRepo();
			const projectSearch = await gitlab(tokens).get(`projects/search/${currentProject}`, { per_page: 100 });
			const id = (projectSearch.data[0]) ? projectSearch.data[0].id : null;
			if(!id) return null;
			const issues = await gitlab(tokens).get(`projects/${id}/issues`, { per_page: 100 });
			
			// Adding project names:
			issues.data = _.map(issues.data, (issue) => {
				issue.projectName = _.split(issue.web_url, '/')[4];
				return issue;
			});

			// Sorting to assigned out:
			issues.data = _.filter(issues.data, (issue) => {
				return issue.assignee == null;
			});
			return issues.data
		},
	},
};