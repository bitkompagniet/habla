const github = require('./github');
const gitlab = require('./gitlab');
const trello = require('./trello');
const merge = require('./merge');

module.exports = function (tokens) {
	Promise.all([tokens.gitlab ? gitlab(tokens) : [], tokens.github ? github(tokens) : [], tokens.trello ? trello(tokens) : []])
	.then((res) => {
		return merge(res);
	});
};
