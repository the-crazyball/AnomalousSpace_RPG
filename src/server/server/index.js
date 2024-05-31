const socketIo = require('socket.io');
const express = require('express');
const http = require('http');
const compression = require('compression');
const minify = require('express-minify');
const lessMiddleware = require('less-middleware');
const morgan = require('morgan');

const compileLessOnce = process.env.NODE_ENV === 'production';

module.exports = app => {

    return {
    init: function () {
        return new Promise(resolve => {
            const app = express();
            const server = http.createServer(app);
            const io = socketIo(server, { transports: ['websocket'] });

            app.use(compression());
            app.use(minify());

            app.use((req, res, next) => {
                if (
                    req.url.indexOf('/server') !== 0 &&
                    req.url.indexOf('/mods') !== 0
                )
                    req.url = '/client/' + req.url;

                next();
            });

            app.use(lessMiddleware('../', {
                once: compileLessOnce,
                force: !compileLessOnce
            }));

            app.get('/', this.requests.root.bind(this));
            app.get(/^(.*)$/, this.requests.default.bind(this));

            io.on('connection', this.onConnection.bind(this));

            server.listen(4000, '0.0.0.0', () => {
                console.log('Server ready.')
                resolve();
            })
        })
    },
    onConnection: function (socket) {

        socket.on('handshake', this.onHandshake.bind(this, socket));
        socket.on('disconnect', this.onDisconnect.bind(this, socket));
        socket.on('request', this.onRequest.bind(this, socket));

        socket.emit('handshake');
    },
    onHandshake: function (socket) {
        app.connections.onHandshake(socket);
        console.log('handshake');
    },
    onDisconnect: function (socket) {
        app.connections.onDisconnect(socket);
        console.log('disconnect');
    },
    onRequest: function (socket) {
        console.log('request');
    },

    requests: {
        root: function (req, res) {
            res.sendFile('index.html');
        },
        default: function (req, res) {
            let root = req.url.split('/')[1];
            let file = req.params[0];
            file = file.replace('/' + root + '/', '');

            const validRequest = (
                root !== 'server' ||
                (
                    root === 'server' &&
                    file.startsWith('clientComponents/')
                ) ||
                (
                    file.includes('mods/') &&
                    ['.png', '/ui/', '/clientComponents/', '/audio/'].some(v => file.includes(v))
                )
            );
            
            if (!validRequest)
                return null;
            
            res.sendFile(file, {
                root: '../' + root
            });
        }
    }
}
}