const {ApplicationError} = require('../../common/app/errors');

class AppHttpProxyService {
    constructor(proxyServerFactory, httpServerStorage, log) {
        this._proxyServerFactory = proxyServerFactory;
        this._httpServerStorage = httpServerStorage;
        this._log = log;
    }

    async run({port, host}) {
        const server = this._proxyServerFactory.createHttp(port, host);
        await server.run();

        this._httpServerStorage.add(port, host, server);

        this._log.info('Proxy listening on', port, host);
    }

    async stop({port, host}) {
        const server = this._httpServerStorage.get(port, host);
        if (!server) {
            throw new ApplicationError('Not found proxy');
        }

        await server.stop();
        this._httpServerStorage.remove(port, host);

        this._log.info('Proxy is shutdown', port, host);
    }
}

module.exports = AppHttpProxyService;
