const items = require('./config/itemlist');

module.exports = class User {

    constructor(username, socket, redis, tasks) {

        this.timers = {};

        this.loaded = false;

        this.tasks = tasks;

        this.data = {
            username: username,
            password: '',
            email: null,
            activeAction: 0,
            created_at: new Date(),
            inventory: {},
            levels: {
                woodcuttingExperience: 0,
            },
        };

        this.socket = socket;

        this.redis = redis;

    }

    init() {

    }

    // Change the active task that the user is doing
    startTask(task) {
        this.stopTask();
        this.data.activeAction = task;
        this.save();
        this.socket.emit('start task', task);
        this.executeTask();
    }

    executeTask() {
        let task = this.data.activeAction;

        if (!items[task] || !items[task].skill)
            return;

        let skill = items[task].skill;

        // Check if task exists
        if (this.tasks.hasOwnProperty(skill)) {
            this.clearTimer('resource');

            let timer = this.getTaskTimer();

            this.socket.emit('startProgressBar', {task, timer});

            this.timers['resource'] = setInterval(() => {
                this.socket.emit('startProgressBar', {task, timer});
                this.tasks[skill].execute(
                    items[task],
                    this.socket,
                    this.data
                );
            }, timer)
        }

    }

    stopTask() {
        this.data.activeAction = null;
        this.clearTimer('resource');
        this.save();
        this.socket.emit('stop task');
    }

    clearTimer(timer) {
        for (const i in this.timers) {
            if (i === timer)
                clearInterval(this.timers[i])
        }
    }

    clearTimers() {
        for (const i in this.timers) {
            clearInterval(this.timers[i])
        }
    }

    getTaskTimer() {
        return items[this.data.activeAction].time || 10;
    }

    async load() {
        await this.redis.get("user " + this.data.username, (err, item) => {
            let user = JSON.parse(item);

            if (!user) {
                this.save();
                user = this.data;
            }

            this.data = user;
            this.loaded = true;
            this.executeTask();
        });
    }

    save() {
        let user = "user " + this.data.username;
        this.redis.set(user, JSON.stringify(this.data));
    }
}