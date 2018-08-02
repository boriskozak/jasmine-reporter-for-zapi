global.__ZAPIcreds = [process.env.ZAPI_ACCESS_KEY, process.env.ZAPI_SECRET_KEY, process.env.ASSIGNEE];
const ZAPI = require('./zapi-service');

const ZapiReporter = (onCompleteDefer, browser) => {

    this.globals = {
        executionId: '',
        cycleId: '',
        status: '1'
    };

    this.onCompleteDefer = onCompleteDefer;
    this.browser = browser;

    this.specPromises = [];
    this.specPromisesResolve = {};

    this.suiteStarted = require('./zapi-reporter-functions/suite-started').bind(this);
    this.specStarted = require('./zapi-reporter-functions/spec-done').bind(this);

    this.suiteDone = require('./zapi-reporter-functions/suite-done').bind(this);
    this.specDone = require('./zapi-reporter-functions/spec-done').bind(this);


    return this

}

module.exports = ZapiReporter;