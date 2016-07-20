/* global define describe, it */

require('chai').should();
const projectUrls = require('../lib/project-urls');

describe('project-urls', () => {
	const expectedBaseUrl = 'github.com/bitkompagniet/habla';
	const expectedIssuesUrl = 'github.com/bitkompagniet/habla/issues';
	const usedIssueNo = 11;
	const expectedSingleIssueUrl = `github.com/bitkompagniet/habla/issues/${usedIssueNo}`;

	it('should be an object', () => {
		projectUrls.should.be.an('object');
		projectUrls.issueUrl.should.be.a('function');
	});

	it(`should return the baseUrl ${expectedBaseUrl}`, () => {
		projectUrls.baseUrl.should.be.a('function');
		return projectUrls.baseUrl().then(url => {
			url.should.be.a('string');
			url.should.equal(expectedBaseUrl);
		});
	});

	it(`should return the issues url ${expectedIssuesUrl}`, () => {
		projectUrls.issuesUrl.should.be.a('function');
		projectUrls.issuesUrl().then(url => {
			url.should.be.a('string');
			url.should.equal(expectedIssuesUrl);
		});
	});

	it(`should return the url ${expectedSingleIssueUrl} for issue no ${usedIssueNo}`, () => {
		projectUrls.issueUrl.should.be.a('function');
		projectUrls.issueUrl().then(url => {
			url.should.be.a('string');
			url.should.equal(expectedSingleIssueUrl);
		});
	});
});
