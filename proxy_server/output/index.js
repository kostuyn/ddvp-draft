const EmptyOutput = require('./empty_output');
const ConsoleOutput = require('./console_output');

const TypeList = {
    [ConsoleOutput.name.toString()]: ConsoleOutput
};

class OutputFactory {
    constructor(log) {
        this._log = log;
    }

    // todo: check outputNameList
    create(outputNameList) {
        const emptyOutput = new EmptyOutput(null, this._log);

        return outputNameList.reduce((output, outputName) => {
            return new TypeList[outputName](output, this._log);
        }, emptyOutput);
    }
}

module.exports = OutputFactory;
