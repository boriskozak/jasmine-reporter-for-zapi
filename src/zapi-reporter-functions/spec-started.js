
module.exports = function(spec) {

    if (this.disabled) {
        return;
    }

    this.specPromises.push(new Promise((resolve) => {
        this.specPromisesResolve[spec.id] = resolve;
    }));


    this.specPromises.push(new Promise((resolve) => {
    	setTimeout(function() {
    		console.log("this is a spec promise that delays 5 seconds")
    		resolve();
    	},5000)
    }));


}

