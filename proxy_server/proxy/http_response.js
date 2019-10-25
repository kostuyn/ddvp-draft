class HttpResponse {
    constructor(statusCode, headers, body) {
        this._statusCode = statusCode;
        this._headers = headers;
        this._body = body;

        this._snapshot = {statusCode, headers, body};
    }

    get statusCode() {
        return this._statusCode;
    }

    get headers() {
        return this._headers;
    }

    get body() {
        return this._body;
    }

    toJSON() {
        return this._snapshot;
    }

    sendAsync(serverResponse) {
        serverResponse.writeHead(this._statusCode, this._headers);
        serverResponse.end(this._body);
    }
}

module.exports = HttpResponse;
