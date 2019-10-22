const HttpServer = require('./server/http_server');

class ProxyServerFactory {
    constructor(httpListener, log) {
        this._httpListener = httpListener;
        this._log = log;
    }

    createHttp(port, host) {
        return new HttpServer(port, host, this._httpListener, this._log);
    }
}

module.exports = ProxyServerFactory;
