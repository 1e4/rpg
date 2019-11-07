let app = require('express')(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    TickHandler = require('./tickHandler');

let users = [];

let usersOnline = [];

console.log("Ready");

io.on('connection', (socket) => {

    const id = socket.id;
    let username = '';

    let events = require('events');

    let EventEmitter = new events();

    EventEmitter.on('update user', (u) => {
        io.to('private user ' + u.username).emit('update user', {
            username: u.username,
            ticksLeft: u.ticksLeft,
            currentTask: u.currentTask
        })
    });

    EventEmitter.on('update tick', (tick) => {
        io.to('private user ' + username).emit('update tick', tick);
    });

    EventEmitter.on('sync tick', () => {
        io.to('private user ' + username).emit('sync tick animation')
    })

    let tick = new TickHandler(socket, EventEmitter);

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

        user.tick.setUser(user);
    });

    socket.on('change task', (task) => {
        user.tick.changeTask(task);
    });

    socket.on('stop task', () => {
        user.tick.stop();
    });

    socket.on('disconnect', () => {
        delete usersOnline[id]
    })

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

setInterval(function () {
    console.log('Users online: ' + Object.keys(usersOnline).length);
}, 5000);

setInterval(function () {
    console.log('Total Players: ' + Object.keys(users).length, users);
}, 5000);