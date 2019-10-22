const express = require('express');
const bodyParser = require('body-parser');
const {ValidationError} = require('@hapi/joi/lib/errors');
const {ApplicationError} = require('./common/app/errors');

const {
    statusCodes,
    httpMessages
} = require('./common/controller/http_status');

const ADMIN_PORT = 7000;

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const log = console;
const app = express();

app.disable('x-powered-by');
app.disable('etag');

app.use(jsonParser);
app.use(urlencodedParser);

app.use((req, res, next) => {
    res.locals.log = log;
    log.info('INCOMING_REQUEST', req.method, req.path);

    next();
});

app.use('/admin', require('./admin/controller'));

app.use((req, res) => {
    res.status(statusCodes.HTTP_NOT_FOUND).send(httpMessages.NOT_FOUND);
});

app.use((err, req, res, next) => {
    res.locals.log.error(err);

    if (err instanceof ValidationError) {
        return res.status(statusCodes.HTTP_BAD_REQUEST).send(httpMessages.BAD_REQUEST);
    }

    if (err instanceof ApplicationError) {
        return res.status(statusCodes.HTTP_UNPROCESSABLE_ENTITY).send(err.message);
    }

    return res.status(statusCodes.HTTP_SERVER_ERROR).send(httpMessages.SERVER_ERROR);
});

app.listen(ADMIN_PORT);


// DESTINATION SERVER FOR TESTING
const appDest = express();

appDest.use(jsonParser);
appDest.use(urlencodedParser);

appDest.use((req, res, next) => {
    log.info('DESTINATION SERVER');
    log.info('SERVER request:', req.method, req.url, req.body, req.query, req.headers);

    res.setHeader('x-my-header', 'My Header');
    res.send({
        serverAnswer: 'Hello from destination server!',
        requestBody: req.body
    });
});


appDest.listen(8081);
