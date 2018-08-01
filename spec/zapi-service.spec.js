global.__ZAPIcreds = [process.env.ZAPI_ACCESS_KEY, process.env.ZAPI_SECRET_KEY, process.env.ASSIGNEE];

const ZAPI = require('../src/zapi-service');

describe('ZapiService', () => {

	it('should identify itself'), (done) => {
		expect(ZAPI.moduleName().toEqual('zapiService'))
		done();
	}

    it(`should return the server info`, (done) => {

        ZAPI.getServerInfo().then((result) => {
           expect(result.addonServerInfo['name']).toEqual('zephyr-connect')
           done();
        })

    });


})