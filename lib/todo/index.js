const _ = require('lodash');
const moment = require('moment');
const fetch = require('./fetch');

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

function createQuery(all, limit, noDeadline, thisRepo, unassigned) {
	console.log(unassigned);
	if (limit && typeof(limit) === 'boolean') {
		throw new Error('Limit (--number) must be falsy or a number.');
	}
	return {
		limit: (limit && !all) ? limit : (all) ? false : 10,
		noDeadline,
		thisRepo,
		unassigned,
		me: true,
	};
}

module.exports = (tokens, reporter) => ((all, limit, noDeadline, thisRepo, unassigned) => {
	const query = createQuery(all, limit, noDeadline, thisRepo, unassigned);
	fetch(tokens, query).then((collectedData) => {
		const issues = _.groupBy(collectedData, keyGenerator);
		reporter(issues, query);
	}).catch(err => console.log(err));
});
