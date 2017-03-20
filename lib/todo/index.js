const fetchData = require('./fetch-data');
const sort = require('./sort');
const _ = require('lodash');
const moment = require('moment');
const log = require('./log');


// function keyGenerator(item) {
// 	var m = moment(item.deadline);

// 	if m.isBefore(moment()) {
// 		return 'past';
// 	}

// 	if (deadline === null) return 'No deadline';
// }

module.exports = () => {
	const sortedIssues = {
		today: [],
		past: [],
		otherIssues: [],
	};

	// _.groupBy(collectedData, keyGenerator)

	fetchData().then((collectedData) => {
		_.map(sort(collectedData), (data) => {
			if (moment().isSame(data.deadline, 'day')) {
				sortedIssues.today = _.concat(sortedIssues.today, data);
			} else if (moment().isAfter(data.deadline, 'day')) {
				sortedIssues.past = _.concat(sortedIssues.past, data);
			} else {
				sortedIssues.otherIssues = _.concat(sortedIssues.otherIssues, data);
			}
		});
		log(sortedIssues);
	}).catch(console.log);
};
