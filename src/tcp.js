const net = require('net');

const client = new net.Socket();
client.connect(1478, '0.0.0.0', () => {
    console.log('Connected');
});


client.on('data', (data) => {
    console.log('Received: ' + data);
});

client.on('close', () => {
    console.log('Connection closed');
});