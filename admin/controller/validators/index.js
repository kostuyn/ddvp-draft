const {
    postRunSchema,
    delRunSchema
} = require('./schemas');

exports.postRunMw = async (req, res, next) => {
    res.locals.params = await postRunSchema.validateAsync(req.params);
    next();
};

exports.delRunMw = async (req, res, next) => {
    res.locals.params = await delRunSchema.validateAsync(req.params);
    next();
};
