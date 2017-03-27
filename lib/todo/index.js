const fetchData = require('./fetch-data');
const sort = require('./sort');
const _ = require('lodash');
const moment = require('moment');
const log = require('./log');

function keyGenerator(item) {
	const deadline = moment(item.deadline);
	const now = moment();
	if (!item.deadline) return 'noDeadline';
	if (deadline.isSame(now, 'day')) return 'today';
	if (deadline.isSame(now.add(1, 'day'), 'day')) return 'tomorrow';
	if (deadline.isBefore(now, 'day')) return 'past';
	if (deadline.isBetween(now, moment().endOf('week'))) return 'thisWeek';
	if (deadline.isBetween(now, moment().add(1, 'week').endOf('week'))) return 'nextWeek';
	return 'afterNextWeek';
}

module.exports = (tokens) => (() => {
	fetchData(tokens).then((collectedData) => {
		const issues = _.groupBy(sort(collectedData), keyGenerator);
		log(issues);
	}).catch(err => console.log(err));
});
