const express = require('express');
const wrap = require('express-async-wrap');

const {statusCodes} = require('../../common/controller/http_status');

const {
    postRunMw,
    delRunMw
} = require('./validators');

const {
    registerRunMw
} = require('./register');

const router = express.Router();


router.post('/settings', wrap(async (req, res, next) => {

}));

router.put('/settings', wrap(async (req, res, next) => {

}));

router.delete('/settings', wrap(async (req, res, next) => {

}));

router.post(['/run/:port', '/run/:port/:host'],
    wrap(postRunMw),
    registerRunMw,
    wrap(async (req, res) => {
        await res.locals.appHttpProxyService.run(res.locals.params);

        res.status(statusCodes.HTTP_CREATED)
            .json(res.locals.params);
    }));

router.delete(['/run/:port', '/run/:port/:host'],
    wrap(delRunMw),
    registerRunMw,
    wrap(async (req, res) => {
        await res.locals.appHttpProxyService.stop(res.locals.params);

        res.status(statusCodes.HTTP_OK)
            .send(res.locals.params);
    }));

module.exports = router;
