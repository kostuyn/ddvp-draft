const {assert} = require('chai');

const ServerSettings = require('../server_settings');

describe('ServerSettings test', () => {
    it('create settings', async () => {
        const protocol = 'http';
        const host = 'www.server.com';
        const port = 8080;

        const serverSettings = new ServerSettings(protocol, host, port);

        // Act
        const settings = serverSettings.create();

        // Assert
        assert.equal(settings.protocol, 'http:');
        assert.equal(settings.host, host);
        assert.equal(settings.port, port);
    });
});
