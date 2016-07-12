function pmBase(url) {
	return `${url.match(/^git@(.+?)\.git$/)[1].replace(':', '/')}`;
}

function issues(url) {
	return `${url}/issues`;
}

function issue(issuesUrl) {
	return function (no) {
		return `${issuesUrl}/${no}`;
	};
}

function fromRepository(repository) {
	const pm = pmBase(repository);
	const issuesUrl = issues(pm);
	const issueUrl = issue(issuesUrl);

	return {
		project: pm,
		issues: issuesUrl,
		issue: issueUrl,
	};
}

module.exports = fromRepository;
