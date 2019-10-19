class HttpResponse {
	constructor(responseStream, statusCode, headers, body) {
		this._responseStream = responseStream;
		this._statusCode = statusCode;
		this._headers = headers;
		this._body = body;

		this._snapshot = {statusCode, headers, body};
	}

	get stream(){
		return this._responseStream;
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
}

module.exports = HttpResponse;
