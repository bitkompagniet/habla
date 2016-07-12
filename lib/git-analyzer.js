const fs = require('fs');
const path = require('path');
const ini = require('ini');

function locateGitContext(searchDir = null) {
	const current = searchDir || process.cwd();

	return new Promise((resolve, reject) => {
		fs.readdir(current, (readdirErr, files) => {
			if (files.indexOf('.git') > -1) {
				const configPath = path.join(current, '.git', 'config');

				fs.stat(configPath, (statErr, configStat) => {
					if (!statErr && configStat) {
						return resolve(configPath);
					}

					return reject(new Error(`Git repository without config: ${path.join(current, '.git')}`));
				});
			}

			if (path.dirname(current) === current) return reject(new Error('No git repository.'));

			return locateGitContext(path.dirname(current))
				.then(gc => resolve(gc))
				.catch(err => reject(err));
		});
	});
}

function config(startDir) {
	return locateGitContext(startDir).then(gc =>
		new Promise((resolve, reject) => {
			fs.readFile(gc, 'utf8', (err, content) => (err ? reject(err) : resolve(ini.parse(content))));
		})
	);
}

function info(startDir) {
	return config(startDir)
		.then(gc => ({
			repository: gc['remote "origin"'].url,
		}));
}

module.exports = {
	config,
	locateGitContext,
	info,
};
