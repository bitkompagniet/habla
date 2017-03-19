const fetchData = require('./fetch-data');
const sort = require('./sort');
const _ = require('lodash');
const moment = require('moment');
const chalk = require('chalk');

const red = chalk.red;
const blue = chalk.blue;
const white = chalk.white;

function colorToChalk(color, text) {
	switch (color) {
	case 'red': return chalk.bgRed(text);
	case 'orange': return chalk.black.bgYellow(text);
	case 'yellow': return chalk.black.bgYellow(text);
	case 'green': return chalk.bgGreen(text);
	case 'blue': return chalk.white.bgBlue(text);
	case 'indigo': return chalk.white.bgBlue(text);
	case 'violet': return chalk.bgMagenta(text);
	case null: return chalk.black.bgWhite(text);
	default: return chalk.black.bgWhite(text);
	}
}

function labelColor(labels) {
	return _.map(labels, (label) => colorToChalk(label.color, label.labelName));
}

function cutSting(text, lenght){
	const oldLength = text.length;
	const newString = text.substring(0, lenght);
	const add = (oldLength == newString.length) ? '' : '..';
	return newString + add;
}

function formatIssue(title, labels, project, link) {
	return `${cutSting(title, 50)} ${labelColor(labels)} - ${chalk.blue(project)} - ${chalk.grey(link)}`;
}


module.exports = () => {
	fetchData().then((collectedData) => {
		_.map(sort(collectedData), (data) => {
			console.log(chalk.white(formatIssue(data.title, data.labels, data.project, data.link)));
		});
	})
	.catch(err => console.log({ err }));
};

