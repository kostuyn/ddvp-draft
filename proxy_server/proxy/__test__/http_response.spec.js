const sinon = require('sinon');
const {assert} = require('chai');

const {ServerResponse} = require('http');
const HttpResponse = require('../http_response');

describe('HttpResponse test', () => {
    const statusCode = 200;
    const headers = {};
    const body = 'response body';

    it('create httpResponse', async () => {
        const httpResponse = new HttpResponse(statusCode, headers, body);

        assert.equal(httpResponse.statusCode, statusCode);
        assert.equal(httpResponse.headers, headers);
        assert.equal(httpResponse.body, body);
    });

    it('send serverResponse', async () => {
        const serverResponse = sinon.createStubInstance(ServerResponse);
        const httpResponse = new HttpResponse(statusCode, headers, body);

        await httpResponse.sendAsync(serverResponse);

        sinon.assert.calledWith(serverResponse.writeHead, statusCode, headers);
        sinon.assert.calledWith(serverResponse.end, body);
    });
});
