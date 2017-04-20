const axios = require('axios');

module.exports = {
    me: (tokens) => axios.create({
		baseURL: 'https://api.github.com/',
		timeout: 3000,
		headers: {
			Authorization: `Basic ${tokens.github}`,
		},
	}),
}