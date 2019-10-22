const Container = require('true-ioc');

const AppHttpProxyService = require('../../app/app_http_proxy_service');
const ProxyServerFactory = require('../../../proxy_server');
const HttpStorage = require('../../../proxy_server/storage/http_storage');
const OutputFactory = require('../../../proxy_server/output');
const ComponentFactory = require('../../../proxy_server/componet');
const HttpListener = require('../../../proxy_server/server/http_listener');
const HttpServerStorage = require('../../infra/http_server_storage');

const container = new Container();

container.registerClass('appHttpProxyService', AppHttpProxyService);
container.registerClass('proxyServerFactory', ProxyServerFactory);
container.registerClass('httpStorage', HttpStorage);
container.registerClass('outputFactory', OutputFactory);
container.registerClass('componentFactory', ComponentFactory);
container.registerClass('httpListener', HttpListener);
container.registerClass('httpServerStorage', HttpServerStorage);

module.exports = container;
