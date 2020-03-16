const io = require('../socket');
const redis = require('redis');
const client = redis.createClient();
const cors = require('cors');
const fs = require('fs');
const User = require('../User');

let tasks = {};

const taskFiles = fs.readdirSync('./skills').filter(
    file => file.endsWith('.js')
);

for (const file of taskFiles) {
    const task = require(`../skills/${file}`);
    tasks[task.name] = task;
    console.log(`Loaded task ${task.name}`)
}

let users = [];

let usersOnline = [];

let sub = redis.createClient();

sub.subscribe('stream');

// We need to load in certain things such as items, resources and any other cache to push to the clients

io.on('connection', (socket) => {

    const id = socket.id;
    let user = null;

    socket.on('login', async (credentials) => {

        console.log('login', credentials);

        // @todo send disconnect to master to prevent duplicate timers and such
        process.send({
            cmd: 'disconnect user',
            data: {
                user: credentials.username
            }
        });

        let username = credentials.username;

        usersOnline.push(username);

        socket.join(`private user ${username}`);

        // Attach methods to our user
        user = new User(username, socket, client, tasks);
        await user.load();

        // Send the current task and login stuff
        socket.emit('login', {
            username: username,
            currentTask: user.data.activeAction
        });

        // Sync config with localstorage
        // This saves needing to get a file everytime
        // We can also push updates live
        // This also allows us to not send "hidden" items so they are hidden until the current user finds them, prevents leaking
        // This will be pulled from the database
        // @todo add time checking and database stuff
        socket.emit('config', {
            items: {},
            resources: {}
        });

        // Send the signal to end the loading screen and now we're ready to play
        socket.emit('ready to play');
    });

    socket.on('start task', (task) => {
        user.startTask(task);
    });

    socket.on('stop task', () => {
        user.stopTask();
    });

    socket.on('disconnect', () => {
        if(user instanceof User)
        {
            user.clearTimers();
            delete usersOnline[id];
            user = null;
        }
    });

});

sub.on('message', function (channel, message) {
    let m = JSON.parse(message);

    io.to(m.channel).emit(m.event, m.data)
});

process.on('message', (message) => {
    if(message.cmd === 'disconnect user') {
        if(users.includes(message.data.username)) {
            users[message.data.username].methods.clearTimers();
        }
    }
});

console.log(`worker started`);