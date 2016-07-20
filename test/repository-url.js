/* global define describe, it */

require('chai').should();
const repoUrl = require('../lib/repository-url');

describe('repository-url', () => {
	it('should resolve to git@github.com:bitkompagniet/habla.git', () => {
		repoUrl.should.be.a('function');

		return repoUrl().then(url => {
			url.should.be.a('string');
			url.should.equal('git@github.com:bitkompagniet/habla.git');
		});
	});
});
