const fetchData = require('./fetch-data');
const sort = require('./sort');
const _ = require('lodash');
const moment = require('moment');
const chalk = require('chalk');

module.exports = () => {
	fetchData().then((collectedData) => {
		_.map(sort(collectedData), (data) => {
			console.log(chalk.blue(data.title));
			console.log(chalk.red(data.project));
		});
		console.log(chalk.bgYellow('yo'));
	})
	.catch(err => console.log({ err }));
};
