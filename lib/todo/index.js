const axios = require('axios');
const _ = require('lodash');
const NodeTrello = require('node-trello');
const tokens = require('../../tokens');

const gitlab = axios.create({
	baseURL: `https://${tokens.gitlab.repo}/api/v3/`,
	timeout: 5000,
	headers: {
		"PRIVATE-TOKEN": tokens.gitlab.token, //eslint-ignore-quotes
	},
});

const github = axios.create({
	baseURL: 'https://api.github.com/',
	timeout: 1500,
	headers: {
		Authorization: 'Basic ' + tokens.github,
	},
});

// nodeTrello is used as a wrapper for the trello api library.
const token = tokens.trello.token;
const key = tokens.trello.key;
const trello = new NodeTrello(key, token);

const fetchGitlab = new Promise((resolve, reject) => {
	gitlab.get('/issues')
	.then((data) => resolve(data.data)).catch(reject);
});

const fetchGithub = new Promise((resolve, reject) => {
	github.get('/issues')
	.then((data) => resolve(data.data)).catch(reject);
});

const fetchTrello = new Promise((resolve, reject) => {
	trello.get('/1/members/me/cards', (err, user) => {
		if (user) return resolve(user);
		return reject(err);
	});
});

module.exports = function () {
	Promise.all([fetchGitlab, fetchGithub, fetchTrello])
	.then((collectedData) => {
		console.log(collectedData);
	})
	.catch(err => console.log({ err }));
};
