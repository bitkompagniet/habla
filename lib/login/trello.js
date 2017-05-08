const inquirer = require('inquirer');
const hablaDataFile = require('../habla-data-file');

module.exports = function () {
	const questions = [
		{
			message: 'Please goto: https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Habla&key=162086b7db000391513e98bcbc35cda7 to generate a personal access token, and enter it here:',
			name: 'token',
		},
	];

	inquirer.prompt(questions).then((answer) => {
		const data = hablaDataFile.load();
		data.trello = {
			key: '162086b7db000391513e98bcbc35cda7',
			token: answer.token,
		};
		hablaDataFile.save(data);
	}).catch(err => console.log(err));
};
