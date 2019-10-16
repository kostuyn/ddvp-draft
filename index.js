const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const {PassThrough} = require('stream');

const qs = require('querystring');

const log = console;

const app = express();
const appDest = express();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});


app.use((req, res, next) => {
    // todo: req.method.toLowerCase() - support all methods (HEAD, PATCH, etc.) ?
    const requestToServer = request[req.method.toLowerCase()]('http://localhost:8081' + req.url);
    const requestToPipe = new PassThrough();
    requestToServer.pipe(requestToPipe);

    const requestStream = req.pipe(requestToPipe);

    requestStream.pipe(res);

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
        log.info('response headers:', response.headers, response.statusCode);
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


app.use((req, res, next) => {
    log.info('READ_RESPONSE');

    let body = '';
    const {newRes} = res.locals;

    newRes.on('readable', function () {
        let data;

        while (data = this.read()) {
            console.log(data.toString());
        }
    });

    newRes.on('data', (data) => {
        body += data;
    });

    newRes.on('end', () => {
        log.info('PROXY response body:', body);
    });

    // next();
});

app.on('error', (err) => {
    log.error('Proxy Error:', err);
});
app.listen(8080);

// DESTINATION SERVER

appDest.use(jsonParser);
appDest.use(urlencodedParser);

appDest.use((req, res, next) => {
    log.info('DESTINATION SERVER');
    log.info(req.method, req.url, req.body, req.query, req.headers);

    res.setHeader('x-my-header', 'My Header');
    res.send({serverAnswer: 'Hello from destination server!'});
});


appDest.on('error', (err) => {
    log.error('Destination Error:', err);
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
