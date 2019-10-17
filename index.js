const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
// const {request} = require('http');
const request = require('request');

const {PassThrough} = require('stream');

const qs = require('querystring');

const log = console;

const app = express();
const appDest = express();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

function parseRequest(req) {
    log.info('PROXY request:', req.method, req.url, req.query, req.headers);

    let body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', () => {
        log.info('PROXY response body:', body);
    });
}

function parseResponse(requestToServer) {
    requestToServer.on('response', (response) => {
        log.info('PROXY response headers:', response.headers, response.statusCode);
    });


    let body = '';
    requestToServer.on('data', (data) => {
        body += data;
    });

    requestToServer.on('end', () => {
        log.info('PROXY response body:', body);
    });
}


const proxy = http.createServer((req, res)=>{
    const requestToServer = request('http://localhost:8081' + req.url);
    req.pipe(requestToServer)
        .pipe(res);

    parseRequest(req);
    parseResponse(requestToServer);
});


// const proxy = http.createServer(app);

app.disable('x-powered-by');
app.disable('etag');

app.use((req, res, next) => {
    const requestToServer = request('http://localhost:8081' + req.url);
    req.pipe(requestToServer)
        .pipe(res);

    // const requestToServer = request({
    //     method: req.method,
    //     hostname: 'localhost',
    //     port: 8081,
    //     path: req.url,
    //     headers: req.headers
    // }, (serverResponse) => {
    //     serverResponse.pipe(res);
    // });

    // req.pipe(requestToServer);

    res.locals.requestToServer = requestToServer;
    next();
});

app.use(jsonParser);
app.use(urlencodedParser);

app.use((req, res, next) => {
    log.info('PROXY_READ_REQUEST');

    log.info('PROXY request:', req.method, req.url, req.body, req.query, req.headers);

    next();
});

app.use((req, res, next) => {
    log.info('PROXY_READ_RESPONSE');

    const {requestToServer} = res.locals;
    requestToServer.on('response', (response) => {
        log.info('PROXY response headers:', response.headers, response.statusCode);
    });


    let body = '';
    requestToServer.on('data', (data) => {
        body += data;
    });

    requestToServer.on('end', () => {
        log.info('PROXY response body:', body);
    });


    // next();
});

proxy.listen(8080);
proxy.on('connect', (req, clientSocket, head) => {
    log.info('######################################CONNECT:', head);
});

proxy.on('request', (req) => {

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
    constructor(proxy, output) {
        this._proxy = proxy;
        this._output = output;
    }

    async execute(request) {
        await this._output.sendRequest(request);
        const response = await this._proxy.transmit(request);
        await this._output.sendResponse(response);
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
