class StreamReader {
    static async read(stream) {
        return new Promise((resolve, reject) => {
            let body = '';
            stream.on('data', (data) => {
                body += data;
            });

            stream.on('end', () => {
                resolve(body);
            });

            stream.on('error', reject);
        });
    }
}

module.exports = StreamReader;
