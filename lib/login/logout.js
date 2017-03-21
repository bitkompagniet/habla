const inquirer = require('inquirer');
const hablaDataFile = require('../habla-data-file');

module.exports = function () {
	const questions = [
		{
			type: 'confirm',
			message: 'Are you sure you want to remove all tokens from habla?',
			name: 'remove',
		},
	];

	inquirer.prompt(questions).then((answer) => {
		if (answer.remove) {
			hablaDataFile.save({});
			console.log('Tokens removed.');
		} else {
			console.log('Not removing tokens.');
		}
	}).catch(err => console.log(err));
};
