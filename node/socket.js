const io = require('socket.io')(3994);
const redisAdapter = require('socket.io-redis');

io.adapter(
    redisAdapter({
        host: 'localhost',
        port: 6379,
    }, {
        prefix: 'rpg.test'
    })
);

module.exports = io;