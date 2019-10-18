const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
// const {request} = require('http');
const request = require('request');

const {PassThrough} = require('stream');

const qs = require('querystring');

const log = console;

const appDest = express();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});


const Proxy = require('./proxy');
const StreamReader = require('./stream_reader');

const SCHEMA = 'http';
const HOST = 'localhost';
const PORT = 8081;

const server = http.createServer(async (req, res) => {
    const proxy = new Proxy(SCHEMA, HOST, PORT, log);
    const consoleOutput = new ConsoleOutput(log);
    const httpParser = new HttpParser(log);
    const proxyComponent = new ProxyComponent(proxy, consoleOutput, httpParser, log);


    await proxyComponent.execute(req, res);
});

server.listen(8080);

server.on('error', (err) => {
    log.error(err);
});


// DESTINATION SERVER

appDest.use(jsonParser);
appDest.use(urlencodedParser);

appDest.use((req, res, next) => {
    log.info('DESTINATION SERVER');
    log.info('SERVER request:', req.method, req.url, req.body, req.query, req.headers);

    res.setHeader('x-my-header', 'My Header');
    res.send({
        serverAnswer: 'Hello from destination server!',
        requestBody: req.body
    });
});


appDest.listen(8081);


class ProxyComponent {
    constructor(proxy, output, httpParser, log) {
        this._proxy = proxy;
        this._output = output;
        this._httpParser = httpParser;

        this._log = log;
    }

    async execute(req, outputRes) {
        const requestToServer = IncomingRequest.create(req);
        const requestToParsing = IncomingRequest.create(req);

        // const httpRequest = await this._httpParser.parseRequest(requestToParsing);
        await this._output.sendRequest(requestToParsing);

        const response = await this._proxy.transmit(requestToServer, outputRes);
        // const httpResponse = await this._httpParser.parseResponse(response);

        await this._output.sendResponse(response);
    }
}

class IncomingRequest {
    constructor(req) {
        this._req = req;
    }

    get method() {
        return this._req.method;
    }

    get headers() {
        return this._req.headers;
    }

    get path() {
        return this._req.url;
    }

    get requestStream() {
        return this._req;
    }

    async getBody() {
        return StreamReader.read(this._req);
    }

    toJSON() {
        return {
            method: this.method,
            headers: this.headers,
            path: this.path
        };
    }

    static create(req) {
        const copyReq = req.pipe(new PassThrough());
        copyReq.headers = req.headers;
        copyReq.method = req.method;
        copyReq.url = req.url;

        return new IncomingRequest(copyReq);
    }
}

class ConsoleOutput {
    constructor(log) {
        this._log = log;
    }

    async sendRequest(incomingRequest) {
        const body = await incomingRequest.getBody();

        this._log.info('httpRequest:', {
            ...incomingRequest.toJSON(),
            body
        });
    }

    async sendResponse(response) {
        const body = await response.getBody();

        this._log.info('httpResponse:', {
            ...response.toJSON(),
            body
        });
    }
}

class HttpParser {
    constructor(log) {
        this._log = log;
    }

    async parseRequest(incomingReq) {
        const body = await this._readStream(incomingReq.requestStream);

        return {
            method: incomingReq.method,
            path: incomingReq.path,
            headers: incomingReq.headers,
            body
        };
    }

    async parseResponse(serverResponse) {
        const body = await this._readStream(serverResponse.responseStream);

        return {
            statusCode: serverResponse.statusCode,
            headers: serverResponse.headers,
            body
        };
    }

    async _readStream(stream) {
        return new Promise((resolve, reject) => {
            let body = '';
            stream.on('data', (data) => {
                body += data;
            });

            stream.on('end', () => {
                resolve(body);
            });

            stream.on('error', reject);
        });
    }
}

class CaptureComponent {
    constructor(storage, proxy) {
        this._storage = storage;
        this._proxy = proxy;
    }

    async execute(request) {
        const response = await this._proxy.transmit(request);
        await this._storage.saveRequest(request);
        await this._storage.saveResponse(response);
    }
}

class MockComponent {
    constructor(storage, proxy, transmitter) {
        this._storage = storage;
        this._proxy = proxy;
        this._transmitter = transmitter;
    }

    async execute(request) {
        const requestRule = this._storage.getRequestRule();
        const mockId = requestRule.check(request);

        if (mockId) {
            const response = await this._storage.getMock(mockId);
            return this._transmitter.send(response);
        }

        await this._proxy.transmit(request);
    }
}


class HttpServer {
    constructor(options) {

    }

    async run() {

    }

    stop() {

    }

    addListener(listener) {

    }
}

class HttpTransmitter {
    constructor(url, method, headers) {

    }

    send(data) {

    }
}

class HttpListener {

}
