class HttpStorage {
    constructor(log) {
        this._log = log;
    }

    // todo: use real BD
    async getHttpOptions() {
        return {
            protocol: 'http',
            host: 'localhost',
            port: 8081,
            mode: 'proxy',
            outputs: ['console']
        };
    }
}

module.exports = HttpStorage;
