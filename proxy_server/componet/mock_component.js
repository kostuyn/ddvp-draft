const COMPONENT_NAME = 'mock';

class MockComponent {
    constructor(proxy, output, storage) {
        this._proxy = proxy;
        this._output = output;
        this._storage = storage;
    }

    static get name() {
        return COMPONENT_NAME;
    }

    async execute(httpRequest, outputRes) {
        await this._output.sendRequest(httpRequest);

        const requestRule = await this._storage.getRequestRule();
        const mockId = requestRule.check(httpRequest);

        if (mockId) {
            const httpResponse = await this._storage.getMock(mockId);
            await this._proxy.sendResponse(httpResponse, outputRes);
            await this._output.sendResponse(httpResponse);

            return;
        }

        const httpResponse = await this._proxy.transmit(httpRequest, outputRes);
        await this._output.sendResponse(httpResponse);
    }
}

module.exports = MockComponent;
