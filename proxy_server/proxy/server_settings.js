class ServerSettings {
    constructor(protocol, host, port) {
        this._protocol = protocol;
        this._host = host;
        this._port = port;

        this._snapshot = {protocol, host, port};
    }

    create() {
        return {
            protocol: `${this._protocol}:`,
            host: this._host,
            port: this._port
        };
    }

    toJSON() {
        return this._snapshot;
    }
}

module.exports = ServerSettings;
