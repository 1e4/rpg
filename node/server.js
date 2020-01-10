let app = require('express')(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    TickHandler = require('./tickHandler'),
    redis = require('redis');

let users = [];

let usersOnline = [];

let sub = redis.createClient();

sub.subscribe('stream');

console.log("Ready");

io.on('connection', (socket) => {

    const id = socket.id;
    let username = '';

    let tick = new TickHandler(socket);

    let user = {};

    socket.on('login', (credentials) => {
        username = credentials.username;

        if (!users.hasOwnProperty(username)) {
            users[username] = user = {
                username: credentials.username,
                currentTask: null,
                ticksLeft: 300,
                tick: tick
            };
        } else {
            user = users[username];
        }

        socket.join('private user ' + username);

        io.to('private user ' + username).emit('login', {
            username: user.username,
            ticksLeft: user.ticksLeft,
            currentTask: user.currentTask
        });

        usersOnline.push(username);

        user.tick.setUser({
            username: user.username,
            ticksLeft: user.ticksLeft,
            currentTask: user.currentTask
        });
    });

    socket.on('change task', (task) => {
        user.tick.changeTask(task);
    });

    socket.on('stop task', () => {
        user.tick.stop();
    });

    socket.on('disconnect', () => {
        delete usersOnline[id]
    });

});

sub.on('message', function(channel, message) {
    let m = JSON.parse(message);

    io.to(m.channel).emit(m.event, m.data)
})

http.listen(3005, function () {
    console.log('listening on *:3005');
});

setInterval(function () {
    console.log('Users online: ' + Object.keys(usersOnline).length);
}, 5000);