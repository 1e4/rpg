let Queue = require('bull'),
    queue = new Queue('tasks', 'redis://127.0.0.1:6379'),
    fs = require('fs');

class TickHandler {

    constructor(socket) {
        this.socket = socket;
        this.ticker = null;
        this.user = null;
        this.task = null;
    }

    setUser(user) {
        this.user = user;
    }

    changeTask(task) {
        this.stop();
        this.user.currentTask = task;
        this.user.ticksLeft = 300;
        this.startTick();
    }

    startTick() {
        if(this.user.ticksLeft <= 0)
            this.stop();

        this.ticker = setInterval(this.handleTick, 1000, this);
    }

    updateTick(timeout) {
        clearInterval(this.ticker);

        this.ticker = setInterval(this.handleTick, timeout, this);
    }

    stop() {
        clearInterval(this.ticker);
        this.user.currentTask = null;
        queue.add({
            user: this.user
        })
    }

    handleTick(_self) {
        if (!_self.user || _self.user.currentTask === null || _self.user.ticksLeft <= 0) return;

        console.log('Processing tick');

        queue.add({
            user: _self.user
        });
    }
}

exports = module.exports = TickHandler;