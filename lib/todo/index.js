const axios = require('axios');

const github = axios.create({
	baseURL: '',
	timeout: 1000,
	headers: {}
});

const gitlab = axios.create({
	baseURL: '',
	timeout: 1000,
	headers: {}
});

const trello = axios.create({
	baseURL: '',
	timeout: 1000,
	headers: {}
});

module.exports = function (){

}
