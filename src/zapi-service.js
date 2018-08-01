const jwt = require('json-web-token');
const request = require('request');
const crypto = require('crypto');

function callZapiCloud(METHOD, API_URL, CONTENT_TYPE, ACCESS_KEY, SECRET_KEY, USER, BODY) {
    const hash = crypto.createHash('sha256');
    const iat = new Date().getTime();
    const exp = iat + 3600;
    const BASE_URL = 'https://prod-api.zephyr4jiracloud.com/connect';
    let RELATIVE_PATH = API_URL.split(BASE_URL)[1].split('?')[0];
    let QUERY_STRING = API_URL.split(BASE_URL)[1].split('?')[1];
    let CANONICAL_PATH;
    if (QUERY_STRING) {
        CANONICAL_PATH = `${METHOD}&${RELATIVE_PATH}&${QUERY_STRING}`;
    } else {
        CANONICAL_PATH = `${METHOD}&${RELATIVE_PATH}&`;
    }

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

    let result = createPromiseCall(false, options);
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
            resolve(JSON.parse(body));
        });
    }).catch(function(e) { console.log(`An error had occured with the api call: "${e}"`); });
}


module.exports = {
moduleName: function() {
    return "zapiService";
},
getServerInfo: function() {
    console.log('foo')
    return callZapiCloud('GET', `https://prod-api.zephyr4jiracloud.com/connect/public/rest/api/1.0/serverinfo`, 'application/json', ...__ZAPIcreds);
}
};
