const inquirer = require('inquirer');
const isUrl = require('is-url');
const hablaDataFile = require('../habla-data-file');

module.exports = function () {
	const questions = [
		{
			message: 'Please enter the url of your gitlab instance',
			name: 'url',
			validate: (inp) => isUrl(inp) ? (true) : ('Please enter a valid URL'),
		},
		{
			message: (answers) => {
				let addSlash = '/';
				if (answers.url.charAt(answers.url.length - 1) === '/') {
					addSlash = '';
				}
				return `Please goto: ${answers.url}${addSlash}profile/personal_access_tokens to generate a personal access token, and enter it here:`;
			},
			name: 'token',
		},
	];

	inquirer.prompt(questions).then((answer) => {
		// const data = {}
		const data = hablaDataFile.load();
		data.gitlab = {
			token: answer.token,
			repo: answer.url,
		};
		hablaDataFile.save(data);
		// return console.log(hablaDataFile.load().gitlab.token);
	}).catch(err => console.log(err));
};
