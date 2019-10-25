const http = require('http');

class HttpServer {
    constructor(port, host, httpListener, log) {
        this._port = port;
        this._host = host;
        this._httpListener = httpListener;

        this._log = log;
    }

    async run() {
        return new Promise((resolve, reject) => {
            this._server = http.createServer((req, res) => this._httpListener.listen(req, res, this._port, this._host));

            this._server.listen(this._port, this._host);
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
                    this._log.error(err);
                    reject(new Error('Can not close http server'));
                }

                return resolve();
            });
        });
    }
}

module.exports = HttpServer;
