/* global define describe, it */

const chai = require('chai');
chai.should();
const repoUrl = require('../lib/repository-url');
const pmUrls = require('../lib/url-generator');

describe('url-generator', () => {
	it('should correctly generate an info object', () =>
		repoUrl()
			.then(url => pmUrls(url))
			.then(urls => {
				urls.project.should.equal('github.com/bitkompagniet/habla');
				urls.issues.should.equal('github.com/bitkompagniet/habla/issues');
				urls.issue.should.be.a('function');
				urls.issue(1).should.equal('github.com/bitkompagniet/habla/issues/1');
			})
	);
});
