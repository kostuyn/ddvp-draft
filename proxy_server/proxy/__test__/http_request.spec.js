const sinon = require('sinon');
const {assert} = require('chai');

const {ServerResponse} = require('http');

const HttpRequest = require('../http_request');
const HttpClient = require('../http_client');
const RequestOptions = require('../request_options');
const ServerSettings = require('../server_settings');

const StreamReader = require('../stream_reader');

describe('HttpRequest tests', () => {
    it('send request', async () => {
        // Arrange
        const responseHeaders = {'response-header': 'my header'};
        const responseBody = {hello: 'world'};

        const options = {};
        const settings = {};

        const httpClient = sinon.createStubInstance(HttpClient);
        const serverResponse = sinon.createStubInstance(ServerResponse);
        const serverSettings = sinon.createStubInstance(ServerSettings);
        const requestOptions = sinon.createStubInstance(RequestOptions);

        const httpClientStub = sinon.stub(HttpClient, 'create');
        const streamReaderStub = sinon.stub(StreamReader, 'read');

        streamReaderStub.resolves(responseBody);
        httpClientStub.returns(httpClient);

        serverResponse.statusCode = 200;
        serverResponse.headers = responseHeaders;

        httpClient.sendRequest.resolves(serverResponse);
        requestOptions.create.returns(options);
        serverSettings.create.returns(settings);

        const httpRequest = HttpRequest.create(serverSettings, requestOptions);

        // Act
        const httpResponse = await httpRequest.sendAsync();

        // Assert
        assert.deepEqual(httpResponse.body, responseBody);
        assert.deepEqual(httpResponse.headers, responseHeaders);
        assert.equal(httpResponse.statusCode, 200);

        sinon.assert.calledWith(HttpClient.create, serverSettings, requestOptions);
        sinon.assert.calledWith(httpClient.sendRequest);
        sinon.assert.calledWith(StreamReader.read, serverResponse);

        streamReaderStub.restore();
        httpClientStub.restore();
    });
});
