module.exports = function(suite) {

    if (this.disabled) {
        return;
    }

    // This should be the JIRA issue key, which is added on to the end of the test suite description
    const issueKey = suite.description.split('@')[1];
    if (issueKey == undefined) {
        this.disabled = true;
        return;
    }
    this.globals.issueKey = issueKey


    this.suitePromises.push(new Promise((resolve) => {
        this.zapiService.createAdHocExecution(issueKey, this.globals.projectId).then((executionId) => {
            this.globals.executionId = executionId;

            if (this.onPrepareDefer.resolve) {
                resolve()
            } else {
                resolve()
            }
        }, (error) => {
            if (error.toString().indexOf("Cannot read property 'issueId' of undefined")) {
                console.log(`No test runs found for ${issueKey}.  Disabling Zephyr reporting`)
                if (this.onPrepareDefer.resolve) {
                    this.onPrepareDefer.resolve();
                } else {
                    this.onPrepareDefer.fulfill();
                }

                if (this.onCompleteDefer.resolve) {
                    this.onCompleteDefer.resolve();
                } else {

                    this.onCompleteDefer.fulfill();
                }
                this.disabled = true;
            }
        });

    }));









}