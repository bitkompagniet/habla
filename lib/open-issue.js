const pmUrls = require('./project-urls');
const opn = require('opn');
const NodeGit = require('nodegit');

function currentBranchIssueNo() {
	return NodeGit.Repository.open(process.cwd())
		.then(repo => repo.getCurrentBranch())
		.then(branch => branch.name())
		.then(name => {
			const match = name.match(/issues?\/(\d+)$/);
			return match ? match[1] : null;
		});
}

function openUrl(url) {
	console.log('trip')
	return opn(url, { wait: false });
}

function openIssues() {
	return pmUrls.issuesUrl().then(openUrl);
}

function openIssue(no) {
	return pmUrls.issueUrl(no).then(openUrl);
}

function resolveAndOpen(no = null) {
	if (!no) {
		return currentBranchIssueNo().then(
			resolvedNo => (resolvedNo ? openIssue(resolvedNo) : openIssues())
		);
	}

	return openIssue(no);
}

module.exports = resolveAndOpen;
