const http = require('http');

class HttpClient {
    constructor(serverSettings, requestOptions) {
        this._serverSettings = serverSettings;
        this._requestOptions = requestOptions;
    }

    async sendRequest() {
        const options = {
            ...this._serverSettings.create(),
            ...this._requestOptions.create()
        };

        return new Promise((resolve, reject) => {
            const request = http.request(options, async (response) => {
                resolve(response);
            });

            request.on('error', reject);
            request.write(this._requestOptions.body);

            request.end();
        });
    }

    static create(serverSettings, requestOptions) {
        return new HttpClient(serverSettings, requestOptions);
    }
}

module.exports = HttpClient;
