const _ = require('lodash');
const moment = require('moment');
const colorNamer = require('color-namer');

function dateOrNull(date) {
	if (date) return moment(date);
	return null;
}

function createDataStructure(title, description, milestone, deadline, labels, project, link, from) {
	return {
		title,
		description,
		deadline,
		labels,
		project,
		link,
		milestone,
		from,
	};
}

function createLabel(labels) {
	const sorted = _.map(labels, (label) => {
		return {
			labelName: label.name ? label.name : label,
			color: label.color ? colorNamer(label.color).roygbiv[0].name : null,
		};
	});
	return sorted;
}

function sortGithub(issues) {
	return _.map(issues, (issue) => {
		let dueDate = null;
		if (issue.milestone != null && issue.milestone.due_on != null) {
			dueDate = issue.milestone.due_on;
		}
		return createDataStructure(issue.title, issue.body, issue.milestone, dateOrNull(dueDate), createLabel(issue.labels), issue.repository.name, issue.html_url, 'GitHub');
	});
}

function sortGitlab(issues) {
	return _.map(issues, (issue) => {
		let dueDate = null;
		if (issue.milestone != null && issue.milestone.due_date != null) {
			dueDate = issue.milestone.due_date;
		}
		if (issue.due_date != null) {
			dueDate = issue.due_date;
		}
		return createDataStructure(issue.title, issue.description, issue.milestone, dateOrNull(dueDate), createLabel(issue.labels), issue.projectName, issue.web_url, 'GitLab');
	});
}

function sortTrello(issues) {
	return _.map(issues, (issue) => {
		const dueDate = issue.due;
		return createDataStructure(issue.name, issue.desc, null, dateOrNull(dueDate), createLabel(issue.labels), issue.boardName, issue.shortUrl, 'Trello');
	});
}


module.exports = function (data) {
	return _.concat(sortGitlab(data[0]), sortGithub(data[1]), sortTrello(data[2]));
};
