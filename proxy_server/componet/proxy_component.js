const COMPONENT_NAME = 'proxy';

class ProxyComponent {
    constructor(httpRequest, serverResponse, log) {
        this._httpRequest = httpRequest;
        this._serverResponse = serverResponse;

        this._log = log;
    }

    static get name() {
        return COMPONENT_NAME;
    }

    async execute() {
        const httpResponse = await this._httpRequest.sendAsync();
        await httpResponse.sendAsync(this._serverResponse);

        return httpResponse;
    }
}

module.exports = ProxyComponent;
