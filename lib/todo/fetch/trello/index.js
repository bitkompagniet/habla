const pickMethod = require('../pickMethod');
const endpoints = require('./endpoints');



module.exports = (tokens, query) => pickMethod(query, endpoints, tokens);
