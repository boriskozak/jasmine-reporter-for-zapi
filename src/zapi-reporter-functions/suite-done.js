module.exports = function() {

    if (this.disabled) {
        return;
    }


    Promise.all(this.suitePromises).then(() => {
        this.zapiService.updateExecutionStatus(
            this.globals.executionId,
            this.globals.issueKey,
            this.globals.projectId,
            this.globals.status,
            () => {
                if (this.onCompleteDefer.resolve) {
                    this.onCompleteDefer.resolve();
                } else {
                    this.onCompleteDefer.fulfill();
                }
            },
            (error) => {
                console.error(error);
                if (this.onCompleteDefer.resolve) {

                    this.onCompleteDefer.resolve();
                } else {

                    this.onCompleteDefer.fulfill();
                }
            }
        );
    });

}