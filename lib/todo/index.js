const fetchData = require('./fetch-data');
const sort = require('./sort');
const _ = require('lodash');

module.exports = () => {
	fetchData().then((collectedData) => {
		console.log(sort(collectedData).length);
	})
	.catch(err => console.log({ err }));
};
