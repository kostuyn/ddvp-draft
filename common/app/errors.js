class ExtendableError extends Error {
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ApplicationError extends ExtendableError {
}

module.exports = {
    ApplicationError
};
