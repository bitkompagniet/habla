#!/usr/bin/env node

const reporter = require('./lib/todo/reporter');
const logout = require('./lib/login/logout');
const trello = require('./lib/login/trello');
const github = require('./lib/login/github');
const gitlab = require('./lib/login/gitlab');
const hablaDataFile = require('./lib/habla-data-file');
const program = require('commander');
const pck = require('./package.json');
const tokens = hablaDataFile.load();
const todo = require('./lib/todo');
const version = pck.version;
const openIssue = require('./lib/open-issue');
const openProject = require('./lib/open-project');

program
	.version(version)
	.description('Opens Github and Gitlab pages from git repositories.');

program
	.command('i [no]')
	.alias('issue')
	.description('Open issues list or specific issue. Will resolve the issue if the current branch is called issue/no.') // eslint-disable-line max-len
	.action(openIssue);

program
	.command('todo')
	.option('-a, --all', 'Remove limit from task-list')
	.option('-n, --number [amount]', 'Amount of tasks shown (is overwritten by --all)')
	.option('-c, --current', 'Only shows tasks from the current repository. ')
	.option('-w, --withoutdeadline', 'Only shows tasks without deadlines')
	.option('-u, --unassigned', 'Only shows unassigned tasks')
	.description('Lists issues on Github, Gitlab and trello according to their deadline. ')
	.parse(process.argv)
	.action((() => {
		const args = program.args[0];
		if (args.number && typeof(args.number) === 'boolean') {
			console.log('Please specify amount of tasks when using --number  (-n [amount])');
		} else {
			console.log('sag: ' + args.unassigned);
			todo(tokens, reporter)(args.all, args.number, args.withoutdeadline, args.current, true); // (all, limit, noDeadline, thisRepo, unassigned)
		}
	}));

program
	.command('gitlab')
	.description('Login with gitlab')
	.action(gitlab);

program
	.command('github')
	.description('Login with github')
	.action(github);

program
	.command('trello')
	.description('Login with trello')
	.action(trello);

program
	.command('logout')
	.description('Delete API authentication tokens')
	.action(logout);

program.parse(process.argv);

if (process.argv.slice().length <= 2) {
	openProject();
}
