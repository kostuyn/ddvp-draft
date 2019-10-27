const sinon = require('sinon');
const {assert} = require('chai');

const {IncomingMessage} = require('http');

const RequestOptions = require('../request_options');

const StreamReader = require('../stream_reader');

describe('RequestOptions test', () => {
    const method = 'POST';
    const headers = {};
    const path = '/my_path';

    it('create RequestOptions', async () => {
        const requestBody ='request body';

        const incomingMessage = sinon.createStubInstance(IncomingMessage);
        const streamReaderStub = sinon.stub(StreamReader, 'read');
        streamReaderStub.resolves(requestBody);

        // Act
        const requestOptions = await RequestOptions.createAsync(incomingMessage);

        // Assert
        assert.equal(requestOptions.body, requestBody);

        streamReaderStub.restore();
    });

    it('create options', async () => {
        const body = 'request body';

        const requestOptions = new RequestOptions(method, headers, path, body);

        // Act
        const options = requestOptions.create();

        // Assert
        assert.equal(options.method, method);
        assert.equal(options.headers, headers);
        assert.equal(options.path, path);
    });

    it('empty body', async () => {
        const requestOptions = new RequestOptions(method, headers, path, null);

        // Assert
        assert.isEmpty(requestOptions.body);
    });
});
