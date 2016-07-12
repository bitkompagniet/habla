const chai = require('chai');
const should = chai.should();
const analyzer = require('../lib/git-analyzer');
const pmUrls = require('../lib/url-generator');

describe('url-generator', () => {

	it('should correctly generate an info object', () => {

		return analyzer.info()
			.then(info => pmUrls(info.repository))
			.then(urls => {
				urls.type.should.equal('github');
				urls.project.should.equal('https://github.com/bitkompagniet/bitkompagniet-gitlab-helper');
				urls.issues.should.equal('https://github.com/bitkompagniet/bitkompagniet-gitlab-helper/issues');
				urls.issue.should.be.a('function');
				urls.issue(1).should.equal('https://github.com/bitkompagniet/bitkompagniet-gitlab-helper/issues/1');
			});

	});

});