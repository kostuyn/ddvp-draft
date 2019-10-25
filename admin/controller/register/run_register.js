const Container = require('true-ioc');

const AppHttpProxyService = require('../../app/app_http_proxy_service');
const ProxyServerFactory = require('../../../proxy_server');
const ServerStorage = require('../../../proxy_server/storage/server_storage');
const OutputFactory = require('../../../proxy_server/output');
const ComponentFactory = require('../../../proxy_server/componet');
const HttpListener = require('../../../proxy_server/server/http_listener');
const ProxyStorage = require('../../infra/proxy_storage');

const container = new Container();

container.registerClass('appHttpProxyService', AppHttpProxyService);
container.registerClass('proxyServerFactory', ProxyServerFactory);
container.registerClass('serverStorage', ServerStorage);
container.registerClass('outputFactory', OutputFactory);
container.registerClass('componentFactory', ComponentFactory);
container.registerClass('httpListener', HttpListener);
container.registerClass('proxyStorage', ProxyStorage);

module.exports = container;
