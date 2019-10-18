const request = require('request');
const {PassThrough} = require('stream');

const StreamReader = require('./stream_reader');

class Proxy {
    constructor(schema, host, port, log) {
        this._schema = schema;
        this._host = host;
        this._port = port;

        this._log = log;
    }

    async transmit(incomingReq, outRes) {
        const url = `${this._schema}://${this._host}:${this._port}${incomingReq.path}`;
        this._log.info('PROXY_REQUEST', url);

        const requestToServer = request(url);
        incomingReq.requestStream
            .pipe(requestToServer)
            .pipe(outRes);

        return new Promise((resolve, reject) => {
            requestToServer.on('response', (response) => {
                const newResponse = Response.create(response);
                resolve(newResponse);
            });

            requestToServer.on('error', reject);
        });
    }
}

module.exports = Proxy;

class Response {
    constructor(serverResponse) {
        this._serverResponse = serverResponse;
    }

    get statusCode() {
        return this._serverResponse.statusCode;
    }

    get headers() {
        return this._serverResponse.headers;
    }

    async getBody() {
        return StreamReader.read(this._serverResponse);
    }

    toJSON() {
        return {
            method: this.statusCode,
            headers: this.headers
        };
    }

    static create(serverResponse) {
        const copyRes = serverResponse.pipe(new PassThrough());
        copyRes.statusCode = serverResponse.statusCode;
        copyRes.headers = serverResponse.headers;

        return new Response(copyRes);
    }
}
