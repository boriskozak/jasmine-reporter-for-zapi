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



    xit('should return execution statuses', (done) => {
        ZAPI.getExecutionStatuses().then((result) => {
            done();
        })
    });


    xit('should return executions for an issue', (done) => {
        issueKey = "APPLY-2302"
        ZAPI.getExecutionsForIssue(issueKey).then((result) => {
            console.log(result.tests)
            expect(result.totalTests).toBeGreaterThan(0);
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


    it('should return an issue ID given an issue key', (done) => {
        issueKey = "APPLY-2302"
        ZAPI.getIssueIdFromIssueKey(issueKey).then((result) => {
            expect(result).toEqual(94460);
            done();
        })
    });

    xit('should create an execution by issue id and project id', (done) => {

        ZAPI.createExecution("APPLY-2302", 15100).then((result) => {
            console.log(result);
            done();
        })

    });


    xit('should create a new Ad Hoc execution given an issue key and project id', (done) => {

        ZAPI.createAdHocExecution("APPLY-2302", 15100).then((result) => {
            console.log(result);
            done();
        })

    });

    it('should create a new execution for a specific cycle if provided given an issue key and project id', (done) => {

        cycleName = "ENVIRONMENT-QA"
        ZAPI.createExecution("APPLY-2302", 15100,2).then((result) => {
            console.log(result);
            done();
        })

    });

    xit('should update an execution status given an ID', (done) => {

        ZAPI.updateExecutionStatus("0e036040-8d5a-4e29-949f-3416bca4319e", "APPLY-2302", 15100, 2).then((result) => {
            console.log(result);
            done();
        })

    });

    xit('should delete all executions for an ID', (done) => {

        ZAPI.deleteAllExecutionsForIssue("APPLY-2302").then((result) => {
            console.log(result);
            done();
        })

    });





})