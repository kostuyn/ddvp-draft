const ProxyComponent = require('../componet/proxy_component');
const MockComponent = require('../componet/mock_component');

class ComponentFactory {
    constructor(serverStorage, log) {
        this._serverStorage = serverStorage;
        this._log = log;
    }

    create(mode, httpRequest, serverResponse) {
        const proxyComponent = new ProxyComponent(httpRequest, serverResponse, this._log);
        if (mode === ProxyComponent.name) {
            return proxyComponent;
        }

        if (mode === MockComponent.name) {
            return new MockComponent(httpRequest, serverResponse, proxyComponent, this._serverStorage, this._log);
        }

        throw new Error(`Not implement component for ${mode}`);
    }
}

module.exports = ComponentFactory;
