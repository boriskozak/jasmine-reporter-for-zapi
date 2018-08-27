const jwt = require('json-web-token');
const request = require('request');
const crypto = require('crypto');

const debug = process.env.DEBUG || false

function callZapiCloud(METHOD, URI, CONTENT_TYPE, ACCESS_KEY, SECRET_KEY, USER, BODY) {
    const hash = crypto.createHash('sha256');
    const iat = new Date().getTime();
    const exp = iat + 3600;
    const BASE_URL = 'https://prod-api.zephyr4jiracloud.com/connect';
    let API_URL = 'https://prod-api.zephyr4jiracloud.com/connect/public/rest/api/1.0' + URI;
    let RELATIVE_PATH = API_URL.split(BASE_URL)[1].split('?')[0];
    let QUERY_STRING = API_URL.split(BASE_URL)[1].split('?')[1];
    let CANONICAL_PATH;
    if (QUERY_STRING) {
        CANONICAL_PATH = `${METHOD}&${RELATIVE_PATH}&${QUERY_STRING}`;
    } else {
        CANONICAL_PATH = `${METHOD}&${RELATIVE_PATH}&`;
    }

    console.log(CANONICAL_PATH)

    hash.update(CANONICAL_PATH);
    let encodedQsh = hash.digest('hex');

    let payload = {
        'sub': USER,
        'qsh': encodedQsh,
        'iss': ACCESS_KEY,
        'iat': iat,
        'exp': exp
    };

    let token = jwt.encode(SECRET_KEY, payload, 'HS256', function(err, token) {
        if (err) { console.error(err.name, err.message); } else { return token; }
    });

    let options = {
        'method': METHOD,
        'url': API_URL,
        'headers': {
            'zapiAccessKey': ACCESS_KEY,
            'Authorization': 'JWT ' + token,
            'Content-Type': CONTENT_TYPE
        },
        'json': BODY
    };

    let result = createPromiseCall(debug, options);
    return result;
}

function createPromiseCall(debug, params) {
    return new Promise(function(resolve, reject) {
        request(params, function(error, response, body) {
            if (error) return reject(error);
            if (debug) {
                console.log(params);
                console.log(body);
            }
            try {
                resp = JSON.parse(body)
            } catch (err) {
                resp = body
            }
            resolve(resp);
        });
    }).catch(function(e) { console.log(`An error had occured with the api call: "${e}"`); });
}

var zqlSearch = function(query) {
    return callZapiCloud('POST', '/zql/search?', 'application/json', ...__ZAPIcreds, { 'zqlQuery': `${query}` }).then(searchResults => {

        let result = {
            totalTests: searchResults.totalCount,
            tests: []
        };
        searchResults.searchObjectList.forEach(a => {
            result.tests.push({
                key: a.issueKey,
                summary: a.issueSummary,
                status: a.execution.status.name,
                desc: a.issueDescription,
                executionId: a.execution.id,
                issueId: a.execution.issueId
            });
        });
        return result;
    });
}

var getExecutionStatuses = function() {
    return callZapiCloud('GET', '/execution/statuses', 'application/json', ...__ZAPIcreds)
        .then(getStatuses => {
            return getStatuses;
        });
}

var getServerInfo = function() {
    return callZapiCloud('GET', '/serverinfo?versionId=1', 'application/json', ...__ZAPIcreds);
}

var getExecutionsForIssue = function(issueKey) {
    return zqlSearch("ISSUE = " + issueKey).then((result) => {
        return result;
    });
}

var deleteAllExecutionsForIssue = function(issueKey) {
    getExecutionsForIssue(issueKey).then((result) => {
        executionIds = result.tests.map(function(execution) {
            return execution.executionId;
        })
        body = {
            "executions": executionIds
        }
        return callZapiCloud('POST', '/executions/delete', 'application/json', ...__ZAPIcreds, body);


    });


}

var getIssueIdFromIssueKey = function(issueKey) {
    return zqlSearch("ISSUE = " + issueKey).then((result) => {
        return result.tests[0].issueId;
    });
}

var getCycleFromCycleName = function(jiraProjectId, jiraProjectVersion, cycleName) {
    return callZapiCloud('GET', `/cycles/search?projectId=${jiraProjectId}&versionId=${jiraProjectVersion}`, 'text/plain', ...__ZAPIcreds)
        .then(allCycles => {
            return allCycles.filter(function(cycle) { return cycle.name == cycleName })
        });
}

var createExecution = function(issueKey, projectId, cycleName) {
    //find the issue key
    return getIssueIdFromIssueKey(issueKey).then((issueId) => {
        // get the cycle id
        return getCycleFromCycleName(projectId, -1, cycleName).then((result) => {
            cycleId = result[0].id
            body = {
                "projectId": projectId,
                "issueId": issueId,
                "cycleId": cycleId,
                "versionId": -1
            }
            return callZapiCloud('POST', '/execution', 'application/json', ...__ZAPIcreds, body).then((execution) => {
                return execution.execution.id
            });

        })
    })
}

var createAdHocExecution = function(issueKey, projectId) {
    //find the issue key
    return getIssueIdFromIssueKey(issueKey).then((issueId) => {
        body = {
            "projectId": projectId,
            "issueId": issueId,
            // -1 is passed to create an AdHoc execution.   
            "versionId": -1
        }
        return callZapiCloud('POST', '/execution', 'application/json', ...__ZAPIcreds, body).then((execution) => {
            return execution.execution.id
        });
    })
}



var updateExecutionStatus = function(executionId, issueKey, projectId, executionStatus) {
    return getIssueIdFromIssueKey(issueKey).then((issueId) => {
        body = {
            "projectId": projectId,
            "issueId": issueId,
            "versionId": -1,
            "status": { "id": executionStatus }
        }
        return callZapiCloud('PUT', '/execution/' + executionId, 'application/json', ...__ZAPIcreds, body).then((result) => {
            return result
        });
    })

}

module.exports = {
    deleteAllExecutionsForIssue,
    getServerInfo,
    getExecutionStatuses,
    zqlSearch,
    getExecutionsForIssue,
    getCycleFromCycleName,
    getIssueIdFromIssueKey,
    createExecution,
    createAdHocExecution,
    updateExecutionStatus
};