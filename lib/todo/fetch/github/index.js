const axios = require('axios');
const assigned = require('./assigned');

const github = (tokens, query) => {
	return assigned.me(tokens);
};

module.exports = (tokens) => github(tokens).get('/issues').then(data => data.data)
.catch(err => console.log(err));
