class proxyStorage {
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

    // todo: use real DB
    async getSettings(port, host) {
        const key = this._getKey(port, host);
        const server = localStorage[key];

        if (!server) {
            throw new Error('Server not found');
        }

        return {
            outputs: ['console'],
            mode: 'proxy'
        };
    }

    _getKey(port, host) {
        return [host, port].join(':');
    }
}

module.exports = proxyStorage;

/**
 * Local singleton hash map storage
 * @type {{Object}}
 */
const localStorage = {};
