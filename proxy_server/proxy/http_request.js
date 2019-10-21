const http = require('http');
const {PassThrough} = require('stream');

const StreamReader = require('./stream_reader');
const HttpResponse = require('./http_response');

class HttpRequest {
	constructor(method, headers, path, body) {
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
			protocol,
			method: this._method,
			headers: this._headers,
			path: this._path
		};

		return new Promise((resolve, reject) => {
			const request = http.request(options, async (response) => {
				const responseForRead = response.pipe(new PassThrough());
				const responseStream = response.pipe(new PassThrough());

				const body = await StreamReader.read(responseForRead);
				const {
					statusCode,
					headers
				} = response;

				resolve(new HttpResponse(responseStream, statusCode, headers, body));
			});

			request.on('error', (err) => reject);

			request.write(this._body);
			request.end();
		});
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

		const body = await StreamReader.read(req);
		return new HttpRequest(method, headers, url, body);
	}
}

module.exports = HttpRequest;
