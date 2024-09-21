const mqtt = require('mqtt');
const net = require('net');


const mqttHost = 'mqtt://82.197.69.32:1883';
const tcpHost = '0.0.0.0';
const tcpPort = 1478;

const mqttClient = mqtt.connect(mqttHost);


mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    
    const tcpServer = net.createServer((socket) => {
        console.log('TCP client connected');
        

        mqttClient.on('message', (topic, message) => {

            console.log(`Received message on topic ${topic}: ${message.toString()}`);
            socket.write(message);
        });

    });

    tcpServer.listen(tcpPort, tcpHost, () => {
        console.log(`TCP server listening on ${tcpHost}:${tcpPort}`);
    });


    mqttClient.subscribe('dataaisbjm');

    // Move the mqttClient.on('message') handler inside the 'connect' event
    mqttClient.on('message', (topic, message) => {
        console.log(`MQTT message received on topic ${topic}: ${message.toString()}`);
        // Send message to TCP client
        tcpServer.getConnections((err, count) => {
            if (count > 0) {
                tcpServer.emit('message', topic, message);
            }
        });
    });
});
