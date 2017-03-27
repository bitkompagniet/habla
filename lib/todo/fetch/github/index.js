const axios = require('axios');

const github = (tokens) => axios.create({
	baseURL: 'https://api.github.com/',
	timeout: 1500,
	headers: {
		Authorization: `Basic ${tokens.github}`,
	},
});

module.exports = (tokens) => github(tokens).get('/issues').then(data => data.data)
.catch(err => console.log(err));
