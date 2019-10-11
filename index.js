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

class CaptureComponent {
	constructor(httpServer) {

	}

	async execute() {
		const listener = new HttpListener();
		this._httpServer.addListener(listener);

		listener.on('data', async (data) => {
			await this._repository.store(data);
		});

		await this._httpServer.run();

	}
}
