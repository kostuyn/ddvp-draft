const HttpServer = require('./server/http_server');
const Storage = require('./storage');
const OutputFactory = require('./output');
const ComponentFactory = require('./componet');
const Listener = require('./server/http_listener');

class ProxyServerFactory {
    constructor(options, log) {
        this._options = options;
        this._log = log;
    }

    createHttp() {
        const storage = new Storage(this._log);
        const outputFactory = new OutputFactory(this._log);
        const componentFactory = new ComponentFactory(storage, this._log);

        const listener = new Listener(storage, outputFactory, componentFactory, this._log);

        return new HttpServer(this._options, listener, this._log);
    }
}

module.exports = ProxyServerFactory;
