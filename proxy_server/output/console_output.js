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
        this._log.info('httpRequest:', httpRequest.toJSON());
    }

    async _sendResponse(httpResponse) {
        this._log.info('httpResponse:', httpResponse.toJSON());
    }
}

module.exports = ConsoleOutput;
