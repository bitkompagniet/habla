const NodeGit = require('nodegit');

function repositoryUrl() {
	return NodeGit.Repository.discover(process.cwd(), 1, '')
		.then(path => NodeGit.Repository.open(path))
		.then(repo => repo.config())
		.then(config => config.getStringBuf('remote.origin.url'));
}

module.exports = repositoryUrl;
