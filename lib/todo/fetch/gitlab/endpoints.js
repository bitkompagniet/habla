const axios = require('axios');
const _ = require('lodash');

const gitlab = (tokens) => axios.create({
	baseURL: `${tokens.gitlab.repo}/api/v3/`,
	timeout: 20000,
	headers: {
		"PRIVATE-TOKEN": tokens.gitlab.token, // eslint-disable-line quotes
	},
});

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
			await allProjects.data.forEach(function(project) {
				pulls.push(new Promise((resolve, reject) => {
					gitlab(tokens).get(`/projects/${project.id}/issues`).then((issuesInProject)=>{
						issuesInProject.data.forEach(function(issue) {
							if(!issue.assignee) {
								console.log(issue)
								issues.push(issue);
							}
							resolve();
						}, this);
					}).catch((e)=> console.log(e))
				}));
			}, this);
			await Promise.all(pulls);
			console.log('issues')

			return issues;
		},
	},
	thisRepo: {
		me: async function(tokens) {

		},

		unassigned: async function(tokens) {

		},
	},
};