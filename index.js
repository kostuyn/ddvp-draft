const http = require('http');
const log = console;

const Proxy = require('./proxy_server/proxy/proxy');
const HttpRequest = require('./proxy_server/proxy/http_request');
const ProxyComponent = require('./proxy_server/componet/proxy_component');
const ConsoleOutput = require('./proxy_server/output/console_output');

const ProxyServerFactory = require('./proxy_server');

const HOST = 'localhost';
const PORT = 8080;

// todo: inside admin API

const httpServerFactory = new ProxyServerFactory({
    host: HOST,
    port: PORT
}, log);

const server = httpServerFactory.createHttp();

(async () => await server.run())();

// DESTINATION SERVER

const express = require('express');
const bodyParser = require('body-parser');

const appDest = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

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
