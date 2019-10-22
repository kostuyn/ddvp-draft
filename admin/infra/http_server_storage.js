class HttpServerStorage {
    constructor(log) {
        this._log = log;
    }

    add(port, host, server) {
        const key = this._getKey(port, host);
        localStorage[key] = server;
    }

    get(port, host) {
        const key = this._getKey(port, host);
        return localStorage[key];
    }

    remove(port, host) {
        const key = this._getKey(port, host);
        delete localStorage[key];
    }

    _getKey(port, host) {
        return [host, port].join(':');
    }
}

module.exports = HttpServerStorage;

/**
 * Local singleton hash map storage
 * @type {{Object}}
 */
const localStorage = {};
