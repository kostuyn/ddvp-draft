const Proxy = require('../proxy/proxy');
const HttpRequest = require('../proxy/http_request');

class HttpListener {
    constructor(storage, outputFactory, componentFactory, log) {
        this._storage = storage;
        this._outputFactory = outputFactory;
        this._componentFactory = componentFactory;

        this._log = log;
    }

    async listen(req, res) {
        const options = await this._storage.getHttpOptions();

        const {
            protocol,
            host,
            port,
            mode,
            outputs
        } = options;

        const proxy = new Proxy(protocol, host, port, this._log);
        const output = this._outputFactory.create(outputs);
        const component = this._componentFactory.create(mode, proxy, output);

        try {
            const httpRequest = await HttpRequest.createAsync(req);
            await component.execute(httpRequest, res);

        } catch (err) {
            this._log.error(err);
        }
    }
}

module.exports = HttpListener;