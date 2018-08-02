
module.exports = function(suite) {

    if (this.disabled) {
        return;
    }

    // This should be the JIRA issue key, which is added on to the end of the test suite description
    const issueKey = suite.description.split('@')[1];
    this.globals.issueKey = issueKey

    this.zapiService.createAdHocExecution(issueKey, this.globals.projectId, (executionId) => {
        this.globals.executionId = executionId;
        console.log("Got execution id " + executionId)
    }, (error) => {
        console.error(error);
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
    });


}

