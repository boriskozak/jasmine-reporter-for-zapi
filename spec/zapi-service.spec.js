global.__ZAPIcreds = [process.env.ZAPI_ACCESS_KEY, process.env.ZAPI_SECRET_KEY, process.env.ASSIGNEE];

const ZAPI = require('../src/zapi-service');

describe('ZapiService', () => {

    xit('should return the server info', (done) => {
        ZAPI.getServerInfo().then((result) => {
            expect(result.addonServerInfo['name']).toEqual('zephyr-connect')
            done();
        })
    });


    xit('should search via ZQL and return 0 results for a non existing issue', (done) => {
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


    xit('should return executions for an issue', (done) => {
        issueKey = "QT-1461"
        ZAPI.getExecutionsForIssue(issueKey).then((result) => {
            expect(result.totalTests).toEqual(24);
            done();
        })
    });

    xit('should return a cycle given a cycle name', (done) => {
        projectId = 15100
        versionId = -1
        cycleName = "Ad hoc"
        ZAPI.getCycleFromCycleName(projectId, versionId, cycleName).then((result) => {
            expect(result[0].name).toEqual(cycleName)
            done();
        })
    });


    xit('should return an issue ID given an issue key', (done) => {
        issueKey = "APPLY-2302"
        ZAPI.getIssueIdFromIssueKey(issueKey).then((result) => {
            expect(result).toEqual(94460);
            done();
        })
    });

    it('should create a passed execution by issue id and project id', (done) => {

        ZAPI.createExecution("APPLY-2302", 15100, 1).then((result) => {
            console.log(result);
            done();
        })

    });

     it('should create a failed execution by issue id and project id', (done) => {

        ZAPI.createExecution("APPLY-2302", 15100, 2).then((result) => {
            console.log(result);
            done();
        })

    });





})