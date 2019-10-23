const sinon = require('sinon');
const {assert} = require('chai');

const {ServerResponse} = require('http');

const HttpRequest = require('../http_request');
const HttpClient = require('../http_client');
const StreamReader = require('../stream_reader');

describe('HttpRequest tests', () => {
    it('send request', async () => {
        const testPath = '/testPath';
        const responseHeaders = {
            'response-header': 'my header'
        };
        const responseBody = JSON.stringify({hello: 'world'});

        const requestHeaders = {
            'request-header': 'my header'
        };

        const httpClient = sinon.createStubInstance(HttpClient);
        const serverResponse = sinon.createStubInstance(ServerResponse);
        const streamReaderStub = sinon.stub(StreamReader, 'read');
        streamReaderStub.resolves(responseBody);

        httpClient.sendRequest.resolves(serverResponse);

        serverResponse.statusCode = 200;
        serverResponse.headers = responseHeaders;

        const httpRequest = new HttpRequest(httpClient, 'POST', requestHeaders, testPath);

        const httpResponse = await httpRequest.send('http', 'www.testurl.com', 8080);

        assert.deepEqual(httpResponse.body, responseBody);
        assert.deepEqual(httpResponse.headers, responseHeaders);
        assert.equal(httpResponse.statusCode, 200);

        sinon.assert.calledWith(httpClient.sendRequest, {
            headers: requestHeaders,
            protocol: 'http:',
            path: testPath,
            port: 8080,
            host: 'www.testurl.com',
            method: 'POST'
        });

        streamReaderStub.restore();
    });
});
