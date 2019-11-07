let Queue = require('bull'),
    queue = new Queue('tasks', 'redis://127.0.0.1:6379')
    fs = require('fs');

class TickHandler {

    constructor(socket, EventEmitter) {

        this.socket = socket;
        this.ticker = null;
        this.user = null;
        this.EventEmitter = EventEmitter;
        this.task = null;

    }

    setUser(user) {
        this.user = user;
    }

    changeTask(task) {
        this.stop();
        this.user.currentTask = task;
        this.user.ticksLeft = 300;
        this.EventEmitter.emit('update user', this.user);
        this.EventEmitter.emit('sync tick');

        let taskFilePath = './taskHandlers/' + task + '.js';

        if(fs.existsSync(taskFilePath))
        {
            let taskFile = require(taskFilePath);
            this.task = new taskFile();
            this.startTick();
        }
    }

    startTick() {
        if(this.user.ticksLeft <= 0)
            this.stop();

        this.ticker = setInterval(this.handleTick, 5000, this);
    }

    stop() {
        clearInterval(this.ticker);
        this.user.currentTask = null;
        this.EventEmitter.emit('update user', this.user)
    }

    handleTick(_self) {
        // console.log('Running tick for users', users);

        if (!_self.user || _self.user.currentTask === null || _self.task === null || _self.user.ticksLeft <= 0) return;

        _self.user.ticksLeft--;

        console.log('Running tick for ', _self.user.username);

        _self.task.handle();

        _self.EventEmitter.emit('update user', _self.user);
        _self.EventEmitter.emit('sync tick')
    }
}

exports = module.exports = TickHandler;