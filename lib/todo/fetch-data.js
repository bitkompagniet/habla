const axios = require('axios');
const _ = require('lodash');
const NodeTrello = require('node-trello');
const tokens = require('../../tokens');
const async = require('async');

const gitlab = axios.create({
	baseURL: `https://${tokens.gitlab.repo}/api/v3/`,
	timeout: 10000,
	headers: {
		"PRIVATE-TOKEN": tokens.gitlab.token, // eslint-disable-line quotes
	},
});

const github = () => axios.create({
	baseURL: 'https://api.github.com/',
	timeout: 1500,
	headers: {
		Authorization: `Basic ${tokens.github}`,
	},
});

// nodeTrello is a wrapper for the trello api library.
const token = tokens.trello.token;
const key = tokens.trello.key;
const trello = new NodeTrello(key, token);

const fetchGitlab = new Promise((resolve, reject) => {
	gitlab.get('/issues')
	.then((issues) => {
		_.map(issues.data, (issue) => {
			const splittedUrl = _.split(issue.web_url, '/');
			issue.projectName = splittedUrl[4];
			return issue;
		});
		resolve(issues.data);
	}).catch(reject);
});

const fetchGithub = () => github().get('/issues').then(data => data.data);

// const fetchGithub = new Promise((resolve, reject) => {
// 	github.get('/issues')
// 	.then((data) => resolve(data.data)).catch(reject);
// });

const fetchTrello = new Promise((resolve, reject) => {
	trello.get('/1/members/me/cards', (err, cards) => {
		if (cards) {
			_.map(cards, (singleUser) => {
				trello.get(`/1/boards/${singleUser.idBoard}`, (boardErr, board) => {
					if (boardErr) reject(boardErr);
					singleUser.boardName = board.name;
					return singleUser;
				});
			});
		}

		if (cards) return resolve(cards);
		return reject(err);
	});
});

module.exports = function () {
	return Promise.all([fetchGitlab, fetchGithub, fetchTrello]);
};
