function type(url) {
	const githubPattern = /^git@github\.com.*/;
	return url.match(githubPattern) ? 'github' : 'gitlab';
}

function pmBase(url, type) {
	if (type === 'github') {
		return `https://${url.match(/^git@(.+?)\.git$/)[1].replace(':', '/')}`;
	}
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
	const repoType = type(repository);
	const pm = pmBase(repository, repoType);
	const issuesUrl = issues(pm);
	const issueUrl = issue(issuesUrl);

	return {
		type: repoType,
		project: pm,
		issues: issuesUrl,
		issue: issueUrl,
	};
}

module.exports = fromRepository;
