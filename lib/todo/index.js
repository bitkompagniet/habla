const fetchData = require('./fetch-data');
const sort = require('./sort');
const _ = require('lodash');
const moment = require('moment');
const log = require('./log');

function keyGenerator(item) {
	const m = moment(item.deadline);
	if (moment().isSame(m, 'day')) return 'today';
	if (moment().isAfter(m, 'day')) return 'past';
	return 'otherIssues';
}

module.exports = (tokens) => (() => {
	fetchData(tokens).then((collectedData) => {
		const issues = _.groupBy(sort(collectedData), keyGenerator);
		log(issues);
	}).catch(console.log);
});
