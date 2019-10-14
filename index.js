const http = require('http');
const express = require('express');
const bodyParser  = require('body-parser');

const qs = require('querystring');

const log = console;

const app = express();
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);

app.use((req, res, next) => {
	log.info(req.method, req.url, req.body, req.query);

	res.send('ok');
});

app.listen(8080);

// todo: use express for easy parsing ??
// const server = http.createServer((req, res) => {
// 	log.info(req.method, req.url, req.body);
//
// 	let body = '';
// 	req.on('data', (data) => {
// 		log.info(data.toString());
// 		body += data;
// 	});
//
// 	req.on('end', () => {
// 		log.info('body:', qs.parse(body));
// 	});
//
// 	res.setHeader('Content-Type', 'text/html');
// 	res.setHeader('X-Foo', 'bar');
// 	res.writeHead(200, {'Content-Type': 'text/plain'});
// 	res.end('ok');
// });
//
// server.on('clientError', (err, socket) => {
// 	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
// });
//
// server.listen(8080);


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
