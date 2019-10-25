const OutputBase = require('./output_base');

const CONSOLE_NAME = 'console';

class ConsoleOutput extends OutputBase {
    constructor(output, log) {
        super(output, log);
    }

    static get name() {
        return CONSOLE_NAME;
    }

    async _sendRequest(httpRequest) {
        this._log.info('httpRequest:', JSON.stringify(httpRequest));
    }

    async _sendResponse(httpResponse) {
        this._log.info('httpResponse:', JSON.stringify(httpResponse));
    }
}

module.exports = ConsoleOutput;
