const io = require('../socket');
const redis = require('redis');
const client = redis.createClient();
const cors = require('cors');

let users = [];

let usersOnline = [];

let sub = redis.createClient();

sub.subscribe('stream');

io.on('connection', (socket) => {

    const id = socket.id;
    let username = null;

    let user = {
        username: null,
        currentTask: null
    };

    socket.on('login', (credentials) => {

        username = credentials.username;

        if (!users.hasOwnProperty(username)) {
            user.username = username;
            users[username] = user;
        } else {
            user = users[username];
        }

        usersOnline.push(username);

        socket.join(`private user ${username}`);

        socket.emit('login', {
            username: user.username,
            currentTask: user.currentTask
        });

        user.methods = require("../User")(username, socket, client, null);


    });

    socket.on('change task', (task) => {
        user.methods.changeTask(task);
    });

    socket.on('stop task', () => {
        user.methods.stopTask();
    });

    socket.on('disconnect', () => {
        delete usersOnline[id]
    });

});

function save(username, data) {
    client.set("user " + username, JSON.stringify())
}

sub.on('message', function (channel, message) {
    let m = JSON.parse(message);

    io.to(m.channel).emit(m.event, m.data)
});

console.log(`worker started`);