const program = require('commander');
const analyzer = require('./lib/git-analyzer');
const pmUrls = require('./lib/url-generator');
const opn = require('opn');
const pck = require('./package.json');
const version = pck.version;
const NodeGit = require('nodegit');

function urls() {
	return analyzer.info()
		.then(info => pmUrls(info.repository));
}

function open(url) {
	return opn(url, { wait: false });
}

function branchIssueNo(name) {
	const match = name.match(/issues?\/(\d+)$/);
	return match ? match[1] : null;
}

function resolvedIssueNo() {
	return NodeGit.Repository.open(process.cwd())
		.then(repo => repo.getCurrentBranch())
		.then(branch => branch.name())
		.then(name => branchIssueNo(name));
}

function resolvedIssueTarget(no) {
	const target = no ? Promise.resolve(no) : resolvedIssueNo();
	return target
		.then(resolvedNo => urls().then(u => (resolvedNo ? u.issue(resolvedNo) : u.issues)));
}

program
	.version(version)
	.description('Does snazzy things.')
	.option('-b, --bullshit', 'Does nothing really.');

program
	.command('i [no]')
	.alias('issue')
	.description('Open issues in project.')
	.action(no => resolvedIssueTarget(no).then(target => open(target)));

program.parse(process.argv);

if (process.argv.slice().length <= 2) {
	urls().then(u => open(u.project));
}
