const COMPONENT_NAME = 'mock';

class MockComponent {
    constructor(httpRequest, serverResponse, proxyComponent, storage, log) {
        this._httpRequest = httpRequest;
        this._serverResponse = serverResponse;
        this._proxyComponent = proxyComponent;
        this._storage = storage;

        this._log = log;
    }

    static get name() {
        return COMPONENT_NAME;
    }

    async execute() {
        const requestRule = await this._storage.getRequestRule();
        const mockId = requestRule.check(this._httpRequest);

        if (mockId) {
            const httpResponse = await this._storage.getMock(mockId);
            await httpResponse.sendAsync(this._serverResponse);

            return httpResponse;
        }

        return this._proxyComponent.execute();
    }
}

module.exports = MockComponent;
