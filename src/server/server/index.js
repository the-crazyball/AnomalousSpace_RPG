const socketIo = require('socket.io');
const express = require('express');
const http = require('http');

module.exports = {
    init: function () {
        return new Promise(resolve => {
            const app = express();
            const server = http.createServer(app);
            const io = socketIo(server, { transports: ['websocket'] });

            io.on('connection', this.onConnection.bind(this));

            server.listen(4000, () => {
                console.log('Server ready.')
                resolve();
            })
        })
    },
    onConnection: function (socket) {
        socket.on('handshake', (socket) => {
            console.log('handshake');
        });
        socket.on('disconnect', (socket) => {
            console.log('disconnect');
        });
        socket.on('request', (socket) => {
            console.log('request');
        });

        socket.emit('handshake');
    }
}