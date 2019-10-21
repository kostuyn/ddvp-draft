const http = require('http');

const DEFAULT_HOST = 'localhost';

class HttpServer {
    constructor(options, listener, log) {
        this._options = options;
        this._listener = listener;

        this._log = log;
    }

    async run() {
        return new Promise((resolve, reject) => {
            const host = this._options.host || DEFAULT_HOST;

            this._server = http.createServer(this._listener.listen.bind(this._listener));

            this._server.listen(this._options.port, host);
            this._server.on('listening', resolve);

            this._server.on('error', (err) => {
                this._log.error(err);
                reject(new Error('Http server error'));
            });
        });
    }

    async stop() {
        return new Promise((resolve, reject) => {
            this._server.close((err) => {
                if (err) {
                    return resolve();
                }

                this._log.error(err);
                reject(err);
            });
        });
    }
}

module.exports = HttpServer;
