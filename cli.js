const todo = require('./lib/todo');

// #!/usr/bin/env node

const program = require('commander');
const pck = require('./package.json');
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
	.description('Lists issues on Github, Gitlab and trello according to their deadline. ')
	.action(todo);

program.parse(process.argv);

if (process.argv.slice().length <= 2) {
	openProject();
}
