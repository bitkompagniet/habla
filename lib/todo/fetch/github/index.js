const axios = require('axios');
const constants = require('../constants');
const endpoints = require('./endpoints');
const pickMethod = require('../pickMethod');

const github = (tokens, query) => {
	return pickMethod(query, endpoints, tokens); // picks the correct method in /endpoints based on the query object.
};

module.exports = (tokens, query) => github(tokens, query)
.catch(err => console.log(err));
