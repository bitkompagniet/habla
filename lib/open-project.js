const urls = require('./project-urls');
const opn = require('opn');

function openProject() {
	return urls.baseUrl().then(url => opn(`http://${url}`, { wait: false }));
}

module.exports = openProject;
