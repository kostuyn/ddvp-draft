const Proxy = require('../proxy/proxy');
const HttpRequest = require('../proxy/http_request');
const RequsetOptions = require('../proxy/request_options');

class HttpListener {
    constructor(proxyStorage, serverStorage, outputFactory, componentFactory, log) {
        this._proxyStorage = proxyStorage;
        this._serverStorage = serverStorage;
        this._outputFactory = outputFactory;
        this._componentFactory = componentFactory;

        this._log = log;
    }

    async listen(req, res, proxyPort, proxyHost) {
        try {
            // const proxySettings = await this._proxyStorage.getSettings(proxyPort, proxyHost);
            //
            // const output = this._outputFactory.create(proxySettings.outputs);
            // const component = this._componentFactory.create(proxySettings.mode, output);
            //
            // const serverSettings = await this._serverStorage.getSettings(proxyPort, proxyHost);
            // const requestOptions = await RequsetOptions.createAsync(req);
            //
            // const httpRequest = HttpRequest.create(serverSettings, requestOptions);
            // await component.execute(httpRequest, res);

            const proxySettings = await this._proxyStorage.getSettings(proxyPort, proxyHost);



            const serverSettings = await this._serverStorage.getSettings(proxyPort, proxyHost);
            const requestOptions = await RequsetOptions.createAsync(req);

            const httpRequest = HttpRequest.create(serverSettings, requestOptions);
            const component = this._componentFactory.create(proxySettings.mode, httpRequest, res);
            const output = this._outputFactory.create(proxySettings.outputs);

            await output.sendRequest(httpRequest);
            const httpResponse = await component.execute();
            await output.sendResponse(httpResponse)

        } catch (err) {
            this._log.error(err);
        }




        // const requestOptions = await this._serverStorage.getRequestOptions();

        // const {
        //     protocol,
        //     host,
        //     port,
        //     mode,
        //     outputs
        // } = requestOptions;

        // const proxy = new Proxy(protocol, host, port, this._log);
        // const output = this._outputFactory.create(outputs);
        // const component = this._componentFactory.create(mode, proxy, output);
        //
        // try {
        //     // todo: pass - protocol, host, port
        //     const httpRequest = await HttpRequest.createAsync(req, requestOptions);
        //     await component.execute(httpRequest, res);
        //
        // } catch (err) {
        //     this._log.error(err);
        // }


    }
}

module.exports = HttpListener;
