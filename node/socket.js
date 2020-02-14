const io = require('socket.io')(8085);
const redisAdapter = require('socket.io-redis');

io.adapter(
    redisAdapter({
        host: 'localhost',
        port: 6379
    })
);

module.exports = io;