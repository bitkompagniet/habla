const fetchData = require('./fetch-data');
const sort = require('./sort');
const _ = require('lodash');
const moment = require('moment');
const chalk = require('chalk');

const red = chalk.red;
const blue = chalk.blue;
const white = chalk.white;


module.exports = () => {
	fetchData().then((collectedData) => {
		_.map(sort(collectedData), (data) => {
			console.log(white(data.title + red(moment(data.deadline).toDate())));
		});
		console.log(chalk.bgYellow('yo'));
	})
	.catch(err => console.log({ err }));
};
