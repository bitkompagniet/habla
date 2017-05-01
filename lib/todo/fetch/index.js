const github = require('./github');
const gitlab = require('./gitlab');
const trello = require('./trello');
const merge = require('./merge');

module.exports = function (tokens, query) {
	console.log({"q@fetch": query})
	return Promise.all([tokens.gitlab ? gitlab(tokens, query) : [], tokens.github ? github(tokens, query) : [], tokens.trello ? trello(tokens, query) : []])
	.then(merge)
	.catch(err => console.log(err));
};
