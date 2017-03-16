const axios = require('axios');
const _ = require('lodash');

const gitlab = axios.create({
	baseURL: 'https://git.bitkompagniet.dk/api/v3/projects?private_token=qw-sCq3whD4nerKXnrNh',
	timeout: 10000,
	// headers: {
	// 	// Authorization: 'PRIVATE-TOKEN CZGNqHPLDF1WfZe9rsuY',
	// }
});

const github = axios.create({
	baseURL: 'https://api.github.com/',
	timeout: 1000,
	headers: {
		Authorization: 'Basic bmlrb2xhai5zbkBob3RtYWlsLmNvbTpLb21ta29HSDE',
	}
});

const trello = axios.create({
	baseURL: '',
	timeout: 1000,
	headers: {}
});

module.exports = function (){
	gitlab.get('/').then((res) =>{
		console.log(res)
	}).catch(err=>console.log(err))

}
