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

    send(outRes) {
        outRes.writeHead(this._statusCode, this._headers);
        outRes.end(this._body);
    }
}

module.exports = HttpResponse;
