const socketIo = require('socket.io');
const express = require('express');
const http = require('http');
const compression = require('compression');
const minify = require('express-minify');
const lessMiddleware = require('less-middleware');
const morgan = require('morgan');

const {
	port = 4000,
	nodeEnv
} = require('../config/serverConfig');

const compileLessOnce = nodeEnv === 'production';

const onConnection = require('./onConnection');
const { appRoot, appFile } = require('./requestHandlers');

module.exports =  {
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

            app.get('/', appRoot);
            app.get(/^(.*)$/, appFile);

            io.on('connection', onConnection);

            server.listen(port, '0.0.0.0', () => {
                console.log('Server ready.')
                resolve();
            })
        })
    }
}