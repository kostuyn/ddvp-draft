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

const HttpRequest = require('./http_request');

const PROTOCOL = 'http:';
const HOST = 'localhost';
const PORT = 8081;

const server = http.createServer(async (req, res) => {
	try {
		const proxy = new Proxy(PROTOCOL, HOST, PORT, log);
		const consoleOutput = new ConsoleOutput(log);
		const proxyComponent = new ProxyComponent(proxy, consoleOutput, log);

		const httpRequest = await HttpRequest.createAsync(req);
		await proxyComponent.execute(httpRequest, res);

	} catch (err) {
		log.error(err);
	}
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
	constructor(proxy, output, log) {
		this._proxy = proxy;
		this._output = output;

		this._log = log;
	}

	async execute(httpRequest, outputRes) {
		await this._output.sendRequest(httpRequest);
		const httpResponse = await this._proxy.transmit(httpRequest, outputRes);
		await this._output.sendResponse(httpResponse);
	}
}


class ConsoleOutput {
	constructor(log) {
		this._log = log;
	}

	async sendRequest(httpRequest) {
		this._log.info('httpRequest:', httpRequest.toJSON());
	}

	async sendResponse(httpResponse) {
		this._log.info('httpResponse:', httpResponse.toJSON());
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
