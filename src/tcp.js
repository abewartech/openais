const net = require('net');

const client = new net.Socket();
client.connect(1478, '127.0.0.1', () => {
    console.log('Connected');
});

client.on('data', (data) => {
    console.log('Received: ' + data);
});

client.on('close', () => {
    console.log('Connection closed');
});