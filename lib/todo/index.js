const axios = require('axios');
const _ = require('lodash');
const NodeTrello = require('node-trello');
const tokens = require('./tokens.json');

const gitlab = axios.create({
	baseURL: 'https://git.bitkompagniet.dk/api/v3/',
	timeout: 5000,
	headers: {
		"PRIVATE-TOKEN": "-o3K4oNZXTy9J-YFTyyo", //eslint-ignore-quotes
	},
});

const github = axios.create({
	baseURL: 'https://api.github.com/',
	timeout: 1500,
	headers: {
		Authorization: 'Basic dc7675f14e1211383d75a74997192e2d91c1048d',
	},
});

// nodeTrello is used as a wrapper for the trello api library.
const token = '62e7a1af19bb63c9288ff2c615181fd1c5eb999ac3496166765cc5ba1a4df33f';
const key = '162086b7db000391513e98bcbc35cda7';
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
	.catch(err => console.log('err'));
	// Promise.all([fetchGithub, fetchGitlab, fetchTrello]).then((collectedIssues) => {
	// 	console.log(collectedIssues[0]);
	// }).catch((error) => {
	// 	console.log(error);
	// });
};
