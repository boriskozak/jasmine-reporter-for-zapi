global.__ZAPIcreds = [process.env.ZAPI_ACCESS_KEY, process.env.ZAPI_SECRET_KEY, process.env.ASSIGNEE];

const ZAPI = require('../src/zapi-service');

describe('ZapiService', () => {

    it('should return the server info', (done) => {
        ZAPI.getServerInfo().then((result) => {
            expect(result.addonServerInfo['name']).toEqual('zephyr-connect')
            done();
        })
    });


    it('should search via ZQL and return 0 results for a non existing issue', (done) => {
        query = "ISSUE = QT-XXXX";
        ZAPI.zqlSearch(query).then((result) => {
            expect(result.totalTests).toEqual(0);
            done();
        })
    });



    it('should return execution statuses', (done) => {
        ZAPI.getExecutionStatuses().then((result) => {
            done();
        })
    });


    it('should return executions for an issue', (done) => {
        issueKey = "QT-1461"
        ZAPI.getExecutionsForIssue(issueKey).then((result) => {
            expect(result.totalTests).toEqual(24);
            done();
        })
    });




})