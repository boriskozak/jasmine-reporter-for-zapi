module.exports = function() {

    this.browser.getProcessedConfig()
        .then((config) => {
            console.log('got config')
            if (this.onPrepareDefer.resolve) {
                this.onPrepareDefer.resolve();
            } else {
                this.onPrepareDefer.fulfill();
            }


        })
        .catch((error) => {
            console.error(error);
            console.log("got an error")
            if (this.onPrepareDefer.resolve) {
                this.onPrepareDefer.resolve();
            } else {
                this.onPrepareDefer.fulfill();
            }

            if (this.onCompleteDefer.resolve) {
              console.log("resolving complete from init ")

                this.onCompleteDefer.resolve();
            } else {
                console.log("fulfilling complete from init ")

                this.onCompleteDefer.fulfill();
            }
            this.disabled = true;
        });

}