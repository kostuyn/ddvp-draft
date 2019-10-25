const StreamReader = require('./stream_reader');

class RequestOptions {
    constructor(method, headers, path, body) {
        this._method = method;
        this._headers = headers;
        this._path = path;
        this._body = body;

        this._snapshot = {method, headers, path, body};
    }

    get body() {
        return this._body || '';
    }

    create() {
        return {
            method: this._method,
            headers: this._headers,
            path: this._path
        };
    }

    toJSON() {
        return this._snapshot;
    }

    static async createAsync(incomingMessage) {
        const {
            method,
            headers,
            url: path
        } = incomingMessage;

        const body = await StreamReader.read(incomingMessage);

        return new RequestOptions(method, headers, path, body);
    }
}

module.exports = RequestOptions;
