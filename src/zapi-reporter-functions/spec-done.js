
module.exports = function(spec) {

    if (this.disabled) {
        return;
    }

    if (spec.status === 'disabled') {
        this.specPromisesResolve[spec.id]();
        return;
    }

    const specId = spec.description.split('@')[1];

    const specDonePromises = [];

    let specStatus = '1';
    if (spec.status !== 'passed') {
        specStatus = '2';
        this.globals.status = '2';
    }

}

