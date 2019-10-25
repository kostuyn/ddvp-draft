const HttpClient = require('./http_client');
const StreamReader = require('./stream_reader');
const HttpResponse = require('./http_response');

class HttpRequest {
    constructor(serverSettings, requestOptions) {
        this._serverSettings = serverSettings;
        this._requestOptions = requestOptions;

        this._snapshot = {serverSettings, requestOptions};
    }

    async sendAsync() {
        const httpClient = HttpClient.create(this._serverSettings, this._requestOptions);
        const serverResponse = await httpClient.sendRequest();

        const {
            statusCode,
            headers
        } = serverResponse;

        const responseBody = await StreamReader.read(serverResponse);

        return new HttpResponse(statusCode, headers, responseBody);
    }

    toJSON() {
        return this._snapshot;
    }

    static create(serverSettings, requestOptions) {
        return new HttpRequest(serverSettings, requestOptions);
    }
}

module.exports = HttpRequest;
