class Storage {
    constructor(log) {
        this._log = log;
    }

    async getHttpOptions() {
        return {
            protocol: 'http:',
            host: 'localhost',
            port: 8081,
            mode: 'proxy',
            outputs: ['console']
        };
    }
}

module.exports = Storage;
