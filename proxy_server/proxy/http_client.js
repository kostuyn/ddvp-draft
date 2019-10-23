const http = require('http');

class HttpClient {
    async sendRequest(options, body) {
        return new Promise((resolve, reject) => {
            const request = http.request(options, async (response) => {
                resolve(response);
            });

            request.on('error', reject);
            request.write(body || '');

            request.end();
        });
    }
}

module.exports = HttpClient;
