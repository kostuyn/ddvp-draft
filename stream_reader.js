class StreamReader {
	static async read(stream) {
		return new Promise((resolve, reject) => {
			let buffer = Buffer.alloc(0);

			stream.on('data', (data) => {
				buffer = Buffer.concat([buffer, data], buffer.length + data.length);
			});

			stream.on('end', () => {
				resolve(buffer);
			});

			stream.on('error', reject);
		});
	}
}

module.exports = StreamReader;
