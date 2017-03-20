const moment = require('moment');
const chalk = require('chalk');
const _ = require('lodash');

function colorToChalk(color, text) {
	switch (color) {
	case 'red': return chalk.white.bold.bgRed(text);
	case 'orange': return chalk.black.bgYellow(text);
	case 'yellow': return chalk.black.bgYellow(text);
	case 'green': return chalk.bgGreen(text);
	case 'blue': return chalk.white.bold.bgBlue(text);
	case 'indigo': return chalk.white.bgBlue(text);
	case 'violet': return chalk.white.bgMagenta(text);
	case null: return chalk.black.bgWhite(text);
	default: return chalk.black.bgWhite(text);
	}
}

function labelColor(labels) {
	return _.map(labels, (label) => colorToChalk(label.color, label.labelName));
}

function cutString(text, lenght) {
	const oldLength = text.length;
	const newString = text.substring(0, lenght);
	const add = (oldLength === newString.length) ? '' : '...';
	return newString.substring(0, lenght - 3) + add;
}

function format(title, labels, project, link, deadline) {
	const b = chalk.bold;
	const possibleDeadline = (deadline) ? b('- ') + moment(deadline).format('MMM Do YY') + ' ' : '';
	return `	${b(cutString(title, 50))} ${_.join(labelColor(labels), ' ')} ${b('-')} ${chalk.underline(project)} ${possibleDeadline}${b('|')} ${chalk.grey(link)}`;
}

function sortByDate(issues) {
	return _.sortBy(issues, (issue) => {
		if (issue.deadline != null) return moment(issue.deadline).unix();
		return null;
	});
}

module.exports = function (sortedIssues) {
	if (sortedIssues.today) {
		console.log(chalk.green.bold('Due today:'));
		_.forEach(sortedIssues.today, (issue) => {
			console.log(chalk.white(format(issue.title, issue.labels, issue.project, issue.link)));
		});
	}

	if (sortedIssues.past) {
		console.log('');
		console.log(chalk.red.bold('Past deadline:'));
		sortedIssues.past = sortByDate(sortedIssues.past);
		_.forEach(sortedIssues.past, (issue) => {
			console.log(chalk.white(format(issue.title, issue.labels, issue.project, issue.link)));
		});
	}

	let color;
	if (!sortedIssues.past && !sortedIssues.today) {
		color = chalk.white;
		console.log(chalk.white.bold.underline('Issues:'));
	} else {
		color = chalk.grey;
		console.log('');
		console.log(chalk.white('Others:'));
	}

	sortedIssues.otherIssues = sortByDate(sortedIssues.otherIssues);
	_.forEach(_.slice(sortedIssues.otherIssues, 0, 10), (issue) => {
		console.log(color(format(issue.title, issue.labels, issue.project, issue.link, issue.deadline)));
	});
};
