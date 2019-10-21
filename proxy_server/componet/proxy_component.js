const COMPONENT_NAME = 'proxy';

class ProxyComponent {
    constructor(proxy, output, log) {
        this._proxy = proxy;
        this._output = output;

        this._log = log;
    }

    static get name() {
        return COMPONENT_NAME;
    }

    async execute(httpRequest, outputRes) {
        await this._output.sendRequest(httpRequest);
        const httpResponse = await this._proxy.transmit(httpRequest, outputRes);
        await this._output.sendResponse(httpResponse);
    }
}

module.exports = ProxyComponent;
