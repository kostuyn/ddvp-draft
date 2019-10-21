const OutputBase = require('./output_base');

const EMPTY_NAME = 'empty';

class EmptyOutput extends OutputBase {
    static get name() {
        return EMPTY_NAME;
    }

    async _sendRequest() {
        // nop
        this._log.info('EMPTY_OUTPUT_REQUEST');
    }

    async _sendResponse() {
        // nop
        this._log.info('EMPTY_OUTPUT_RESPONSE');
    }
}

module.exports = EmptyOutput;
