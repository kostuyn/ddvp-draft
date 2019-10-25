const ServerSettings = require('../proxy/server_settings');

class ServerStorage {
    constructor(log) {
        this._log = log;
    }

    // todo: use real BD
    async getSettings(proxyPort, proxyHost) {
        return new ServerSettings('http', 'localhost', 8081);
    }
}

module.exports = ServerStorage;
