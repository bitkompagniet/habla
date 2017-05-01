const axios = require('axios');
const _ = require('lodash');
const endpoints = require('./endpoints');
const pickMethod = require('../pickMethod');

const gitlab = (tokens, query) => {
	return pickMethod(query, endpoints, tokens); // picks the correct method in /endpoints based on the query object.
};

module.exports = (tokens, query) => gitlab(tokens, query)
.catch(err => console.log(err));