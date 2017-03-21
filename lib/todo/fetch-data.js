const axios = require('axios');
const _ = require('lodash');
const NodeTrello = require('node-trello'); // nodeTrello is a wrapper for the trello api library.

const gitlab = (tokens) => axios.create({
	baseURL: `${tokens.gitlab.repo}/api/v3/`,
	timeout: 10000,
	headers: {
		"PRIVATE-TOKEN": tokens.gitlab.token, // eslint-disable-line quotes
	},
});

const github = (tokens) => axios.create({
	baseURL: 'https://api.github.com/',
	timeout: 1500,
	headers: {
		Authorization: `Basic ${tokens.github}`,
	},
});

const fetchGitlab = (tokens) => gitlab(tokens).get('/issues').then((issues) => {
	return _.map(issues.data, (issue) => {
		const splittedUrl = _.split(issue.web_url, '/');
		issue.projectName = splittedUrl[4];
		return issue;
	});
});

const fetchGithub = (tokens) => github(tokens).get('/issues').then(data => data.data);

const fetchTrello = (tokens) => new Promise((resolve, reject) => {
	const token = tokens.trello.token;
	const key = tokens.trello.key;
	const trello = new NodeTrello(key, token);
	trello.get('/1/members/me/cards', (err, cards) => {
		if (cards) {
			_.map(cards, (singleUser) => {
				trello.get(`/1/boards/${singleUser.idBoard}`, (boardErr, board) => {
					if (boardErr) reject(boardErr);
					singleUser.boardName = board.name;
					return singleUser;
				});
			});
			return resolve(cards);
		}
		return reject(err);
	});
});

module.exports = function (tokens) {
	return Promise.all([tokens.gitlab ? fetchGitlab(tokens) : [], tokens.github ? fetchGithub(tokens) : [], tokens.trello ? fetchTrello(tokens) : []]);
};
