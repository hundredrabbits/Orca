const dgram = require('dgram');
const UDP_INPUT_PORT = 49160

const message = Buffer.from(process.argv.slice(2)[0]);

const client = dgram.createSocket('udp4');

client.connect(UDP_INPUT_PORT, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});