const ProxyComponent = require('../componet/proxy_component');
const MockComponent = require('../componet/mock_component');

class ComponentFactory {
    constructor(httpStorage, log) {
        this._httpStorage = httpStorage;
        this._log = log;
    }

    create(mode, proxy, output) {
        if (mode === ProxyComponent.name) {
            return new ProxyComponent(proxy, output, this._log);
        }

        if (mode === MockComponent.name) {
            return new MockComponent(proxy, output, this._httpStorage, this._log);
        }

        throw new Error(`Not implement component for ${mode}`);
    }
}

module.exports = ComponentFactory;
