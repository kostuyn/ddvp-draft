class Proxy {
    constructor(protocol, host, port, log) {
        this._protocol = protocol;
        this._host = host;
        this._port = port;

        this._log = log;
    }

    async transmit(httpRequest, outRes) {
        const httpResponse = await httpRequest.send(this._protocol, this._host, this._port);
        httpResponse.stream.pipe(outRes);

        return httpResponse
    }

    async sendResponse(httpResponse, outRes) {
        throw new Error('Not implement');
    }
}

module.exports = Proxy;
