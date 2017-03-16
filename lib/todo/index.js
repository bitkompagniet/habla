const axios = require('axios');
const _ = require('lodash');
const NodeTrello = require('node-trello');

const gitlab = axios.create({
	baseURL: 'https://git.bitkompagniet.dk/api/v3/',
	timeout: 10000,
	headers: {
		"PRIVATE-TOKEN": "-ypSz2utssd2zyhJsKmT", //eslint-ignore-quotes
	},
});

const github = axios.create({
	baseURL: 'https://api.github.com/',
	timeout: 1000,
	headers: {
		Authorization: 'Basic bmlrb2xhai5zbkBob3RtYWlsLmNvbTpLb21ta29HSDE',
	},
});

// nodeTrello is used as a wrapper for the trello api library.
const token = 'f1a0198c81c817bcad472ced8b2a09132fbe8238656fdd64081f475f3b8dc6bf';
const key = '162086b7db000391513e98bcbc35cda7';
const trello = new NodeTrello(key, token);

const fetchGitlab = new Promise((resolve, reject) => {
	gitlab.get('/issues')
	.then(resolve).catch(reject);
});

const fetchGithub = new Promise((resolve, reject) => {
	github.get('/issues')
	.then(resolve).catch(reject);
});

const fetchTrello = new Promise((resolve, reject) => {
	trello.get('/1/members/me/cards', (err, user) => {
		if (user) return resolve(user);
		return reject(err);
	});
});

module.exports = function () {
	Promise.all([fetchGithub, fetchGitlab, fetchTrello]).then((collectedIssues) => {
		console.log(collectedIssues);
	});
};
