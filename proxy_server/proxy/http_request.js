const {PassThrough} = require('stream');

const HttpClient = require('./http_client');
const StreamReader = require('./stream_reader');
const HttpResponse = require('./http_response');

class HttpRequest {
    constructor(httpClient, method, headers, path, body) {
        this._httpClient = httpClient;
        this._method = method;
        this._headers = headers;
        this._path = path;
        this._body = body;

        this._snapshot = {method, headers, path, body};
    }

    get method() {
        return this._method;
    }

    get headers() {
        return this._headers;
    }

    get path() {
        return this._path;
    }

    get body() {
        return this._body;
    }

    async send(protocol, host, port) {
        const options = {
            host,
            port,
            protocol: `${protocol}:`,
            method: this._method,
            headers: this._headers,
            path: this._path
        };

        const response = await this._httpClient.sendRequest(options, this._body);

        const {
            statusCode,
            headers
        } = response;

        const responseBody = await StreamReader.read(response);

        return new HttpResponse(statusCode, headers, responseBody);
    }

    toJSON() {
        return this._snapshot;
    }

    static async createAsync(req) {
        const {
            method,
            headers,
            url
        } = req;

        const httpClient = new HttpClient();
        const body = await StreamReader.read(req);
        return new HttpRequest(httpClient, method, headers, url, body);
    }
}

module.exports = HttpRequest;
