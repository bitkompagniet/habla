/* global define describe, it */

const chai = require('chai');
const should = chai.should();
const analyzer = require('../lib/git-analyzer');
const path = require('path');

describe('Analyzer', () => {
	it('should be able to locate the git context', () => {
		should.exist(analyzer.locateGitContext);
		analyzer.locateGitContext.should.be.a('function');

		const startDir = path.join(process.cwd(), 'test');

		return analyzer.locateGitContext(startDir).then(config => {
			config.should.be.a('string');
			config.should.match(/\.git\/config$/);
		});
	});

	it('should be able to get the config as json', () => {
		should.exist(analyzer.info);
		analyzer.info.should.be.a('function');
		return analyzer.info().then(info => {
			info.should.be.an('object');
			info.should.contain.all.keys(['repository']);
			info.repository.should.equal('git@github.com:bitkompagniet/bitkompagniet-gitlab-helper.git');
		});
	});
});
