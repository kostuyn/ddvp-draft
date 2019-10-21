class OutputBase {
    constructor(output, log) {
        this._output = output;
        this._log = log;
    }

    static get name() {
        throw new Error('Npt implement method');
    }

    async sendRequest(httpRequest) {
        await this._sendRequest(httpRequest);

        if (!this._output) {
            return;
        }

        await this._output.sendRequest(httpRequest);
    }

    async sendResponse(httpResponse) {
        await this._sendResponse(httpResponse);

        if (!this._output) {
            return;
        }

        await this._output.sendResponse(httpResponse);
    }

    async _sendRequest() {
        throw new Error('Npt implement method');
    }

    async _sendResponse() {
        throw new Error('Npt implement method');
    }
}

module.exports = OutputBase;
