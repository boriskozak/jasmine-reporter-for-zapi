Protractor reporter for Zephyr's Cloud API (ZAPI) on JIRA cloud.   

This is a reporter that can be hooked into your Jasmine tests, to auto update Zephyr test cases in Jira. 

Step 1: Add to your protractor.conf.js file.
Example
```
const ZapiReporter = require('protractor-zephyr-cloud-reporter-for-jira-cloud');

// Jasmine does not support promises for reporters, but protractor does for
// onPrepare and onComplete. We can use that to make the reporter async as
// well. Generate two promises on onPrepare and add them as arguments to the
// reporter.
let onPrepareDefer;
let onCompleteDefer;

exports.config = {
    'specs': [
        './test/example.spec.js'
    ],
    'framework': 'jasmine2',
    'directConnect': true,
    'capabilities': {
        'name': 'Google Chrome',
        'browserName': 'chrome'
    },
    'onPrepare': function() {

        // first promise is to make sure the cycle is created before the tests start.
        onPrepareDefer = protractor.promise.defer();
        // second promise is to make sure everything is done before protractor
        // quits
        onCompleteDefer = protractor.promise.defer();

        // add the reporter
        try {
        jasmine.getEnv().addReporter(ZapiReporter(onPrepareDefer, onCompleteDefer, browser));
    }
    catch(err) {
        console.log(err)
    }

        // return the promises for onPrepare..
        return onPrepareDefer.promise;
    },
    'onComplete': function() {
        // ..and onComplete
        return onCompleteDefer.promise;
    }
}; 
```

Step 2:  Supply a ZAPI_ACCESS_KEY, ZAPI_SECRET_KEY, and ASSIGNEE via environment variables, and run your tests
```
ZAPI_ACCESS_KEY=XXXXX ZAPI_SECRET_KEY=YYYYYYY ASSIGNEE=bk protractor protractor.conf.js
```

Step 3:  Annotate your specs with the JIRA key corresponding to the Zephyr test in JIRA 
```
// If the following passes, a test execution for APPLY-2302 will be marked PASS.  Otherwise FAIL.  
describe('Suite: Search companies @APPLY-2302', function() {

    it("should return something @STEP-1", async() => {
        var foo = "bar"
        expect(foo).toEqual("bar")
    });

});

## Debugging 
pass DEBUG=true to enable verbose API calls to help with debugging 

```
