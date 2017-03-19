const fetchData = require('./fetch-data');
const sort = require('./sort');
const _ = require('lodash');
const moment = require('moment');
const chalk = require('chalk');
const async = require('async');

function colorToChalk(color, text) {
	switch (color) {
	case 'red': return chalk.white.bgRed(text);
	case 'orange': return chalk.black.bgYellow(text);
	case 'yellow': return chalk.black.bgYellow(text);
	case 'green': return chalk.bgGreen(text);
	case 'blue': return chalk.white.bgBlue(text);
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

function formatIssue(title, labels, project, link, deadline) {
	const possibleDeadline = (deadline) ? deadline : '';
	return `	${chalk.bold(cutString(title, 50))} ${_.join(labelColor(labels), ' ')} - ${chalk.underline(project)} ${possibleDeadline} - ${chalk.grey(link)}`;
}

module.exports = () => {
	let today = [];
	let past = [];
	let otherIssues = [];

	fetchData().then((collectedData) => {
		_.map(sort(collectedData), (data) => {
			if (moment().isSame(data.deadline, 'day')) {
				today = _.concat(today, data);
			} else if (moment().isAfter(data.deadline, 'day')) {
				past = _.concat(past, data);
			} else {
				otherIssues = _.concat(otherIssues, data);
			}
		});

		if (today.length) {
			console.log(chalk.green.bold('Due today:'));
			_.forEach(today, (issue) => {
				console.log(chalk.white(formatIssue(issue.title, issue.labels, issue.project, issue.link)));
			});
		}

		if (past.length) {
			console.log('');
			console.log(chalk.red.bold('Past deadline:'));
			past = _.sortBy(past, (issue) => {
				if (issue.deadline != null) return moment(issue.deadline).dayOfYear();
				return 1000;
			});
			_.forEach(past, (issue) => {
					console.log(chalk.white(formatIssue(issue.title, issue.labels, issue.project, issue.link)));
			});
		}

		let color;
		if (!past.length && !past.length) {
			color = chalk.white;
			console.log(chalk.white.bold.underline('Issues:'));
		} else {
			color = chalk.grey;
			console.log('');
			console.log(chalk.white('Others:'));
		}

		otherIssues = _.sortBy(otherIssues, (issue) => {
			if (issue.deadline != null) return moment(issue.deadline).dayOfYear();
			return 1000;
		});
		_.forEach(_.slice(otherIssues, 0, 10), (issue) => {
			console.log(color(formatIssue(issue.title, issue.labels, issue.project, issue.link, issue.deadline)));
		});
	}).catch(console.log);
};
