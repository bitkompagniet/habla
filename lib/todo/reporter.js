const moment = require('moment');
const chalk = require('chalk');
const _ = require('lodash');
const columnify = require('columnify');

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
	const oldLength = text ? text.length : '';
	const newString = text ? text.substring(0, lenght) : '';
	const add = (oldLength === newString.length) ? '' : '...';
	return newString.substring(0, lenght - 3) + add;
}

function format(title, labels, project, link, deadline) {
	const b = chalk.bold;
	const possibleDeadline = (deadline) ? moment(deadline).format('Do MMM YY') + ' ' : 'none';
	return ({ title: '- ' + b(cutString(title, 40)) + ' ' + _.join(labelColor(labels), ' '), project: chalk.underline(project), deadline: possibleDeadline, link: chalk.grey(link) });
}

function sortByDate(issues) {
	return _.sortBy(issues, (issue) => {
		if (issue.deadline != null) return moment(issue.deadline).unix();
		return null;
	});
}

function reportGrouping(issues, group, headline, headlineColor, rowColor, limit) {
	if (issues[group]) {
		let tableData = [{ title: headlineColor.bold(headline), project: chalk.bold('Project'), deadline: chalk.bold('Deadline'), link: chalk.bold('Url (command-click to open)') }];
		const sliceIfChosen = limit ? _.slice : next => (next);
		_.forEach(sliceIfChosen(sortByDate(issues[group]), 0, limit), (issue) => {
			tableData = _.concat(tableData, format(issue.title, issue.labels, issue.project, issue.link, issue.deadline));
		});
		console.log(rowColor(columnify(tableData, { columnSplitter: '  | ', showHeaders: false })));
		if (limit) console.log(rowColor(`Currently limiting issues to ${limit}. Use flag --all to show all issues`));
		console.log();
		console.log();
	}
}

module.exports = (sortedIssues, query) => {
	reportGrouping(sortedIssues, 'past', 'Past deadline:', chalk.red, chalk.white);
	reportGrouping(sortedIssues, 'today', 'Due today:', chalk.green, chalk.white);
	reportGrouping(sortedIssues, 'tomorrow', 'Due tomorrow:', chalk.green, chalk.white);
	reportGrouping(sortedIssues, 'thisWeek', 'Due this week:', chalk.green, chalk.white);
	reportGrouping(sortedIssues, 'nextWeek', 'Due next week:', chalk.white, chalk.white);
	reportGrouping(sortedIssues, 'afterNextWeek', 'Due after next week:', chalk.grey, chalk.white);
	if (sortedIssues.noDeadline && _.keys(sortedIssues).length === 1) { // if the there is not other groupings than noDeadline, then it should niether be grey font or limited.
		reportGrouping(sortedIssues, 'noDeadline', 'No deadline:', chalk.green, chalk.white);
	} else {
		reportGrouping(sortedIssues, 'noDeadline', 'No deadline:', chalk.grey, chalk.grey, query.limit);
	}
};
