module.exports = function(suite) {

    if (this.disabled) {
        return;
    }

    // This should be the JIRA issue key, which is added on to the end of the test suite description
    const issueKey = suite.description.split('@')[1];
    this.globals.issueKey = issueKey

    try { 
    this.suitePromises.push(new Promise((resolve) => {
        console.log('resolving in suite start promise')
        this.zapiService.createAdHocExecution(issueKey, this.globals.projectId).then((executionId) => {
            this.globals.executionId = executionId;


            console.log('got execution id' + executionId)
            if (this.onPrepareDefer.resolve) {
                console.log('resolving ')
                resolve()
      //          this.onPrepareDefer.resolve();
            } else {
                console.log('fulfilling')
                resolve()
        //        this.onPrepareDefer.fulfill();
            }
        }, (error) => {
            console.error(error);
            console.log("got an error")
            if (this.onPrepareDefer.resolve) {
                this.onPrepareDefer.resolve();
            } else {
                this.onPrepareDefer.fulfill();
            }

            if (this.onCompleteDefer.resolve) {
                console.log("resolving complete from suite started")
                this.onCompleteDefer.resolve();
            } else {
                console.log("fulfilling complete from suite started")

                this.onCompleteDefer.fulfill();
            }
            this.disabled = true;
        });

    }));

}
catch(err) {
    console.log(err)
}





}