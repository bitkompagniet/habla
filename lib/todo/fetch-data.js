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
}).catch(err => console.log(err));

const fetchGithub = (tokens) => github(tokens).get('/issues').then(data => data.data).catch(err => console.log(err))

function fetchTrello(tokens, method, url) {
	const token = tokens.trello.token;
	const key = tokens.trello.key;
	const trello = new NodeTrello(key, token);
	return new Promise((resolve, reject) => {
		trello[method](url, (err, payload) => {
			if (err) reject(err);
			resolve(payload);
		});
	});
}


function getBoardName(boardId, tokens) {
	return fetchTrello(tokens, 'get', `/1/boards/${boardId}`);
}

const fetchTrelloCards = (tokens) => fetchTrello(tokens, 'get', '/1/members/me/cards').then((cards) => {
	const cardPromises = _.map(cards, (card) =>
		getBoardName(card.idBoard, tokens).then((board) => {
			card.boardName = board.name;
		}).catch(err => console.log(err))
	);
	return Promise.all(cardPromises).then(() => {
		return cards;
	}).catch(err => console.log(err));
});


module.exports = function (tokens) {
	return Promise.all([tokens.gitlab ? fetchGitlab(tokens) : [], tokens.github ? fetchGithub(tokens) : [], tokens.trello ? fetchTrelloCards(tokens) : []]);
};
