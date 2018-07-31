const JiraService = require('../src/jira-service');

describe('JiraService', () => {

    let options;
    beforeEach(() => {
        options = {
            jiraUrl: 'https://' + process.env.JIRASUBDOMAIN + '.atlassian.net/rest/api/2',
            jiraUser: process.env.JIRAUSER,
            jiraPassword: process.env.JIRAPASSWORD
        }
    });

    it(`should get the jira given a key`, (done) => {

    	let jiraKey = "TOPS-5902"
        let jiraService = JiraService(options);

        jiraService.getIssueIdByKey(jiraKey).then((issueId) => {
           expect(issueId).toEqual('94394');
           done();
        })


    });





})