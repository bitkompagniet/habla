const inquirer = require('inquirer');
const hablaDataFile = require('../habla-data-file');

module.exports = function () {
	const questions = [
		{
			message: 'Please goto: https://github.com/settings/tokens to generate a personal access token, and enter it here:',
			name: 'token',
		},
	];

	inquirer.prompt(questions).then((answer) => {
		const data = hablaDataFile.load();
		data.github = answer.token;
		hablaDataFile.save(data);
	}).catch(err => console.log(err));
};
