const Container = require('true-ioc');

const runContainer = require('./run_register');

exports.registerRunMw = (req, res, next) => {
    const perReqContainer = new Container(runContainer);

    perReqContainer.registerValue('log', res.locals.log);

    perReqContainer.checkDependencies();

    const appHttpProxyService = perReqContainer.getInstance('appHttpProxyService');
    res.locals = {
        ...res.locals,
        appHttpProxyService
    };

    next();
};
