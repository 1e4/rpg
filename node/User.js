
module.exports = class User {

    constructor(username, socket, redis, tasks) {

        this.config = require('./config');

        this.timers = {};

        this.loaded = false;

        this.tasks = tasks;

        this.data = {
            username: username,
            password: '',
            email: null,
            activeAction: 0,
            activeSkill: null,
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
        this.data.activeAction = task[0];
        this.data.activeSkill = task[1];
        this.currentAction = this.config[task[1]][task[0]];
        this.save();
        this.executeTask();
    }

    executeTask() {
        let activeAction = this.data.activeAction;
        let activeSkill = this.data.activeSkill;

        if(!this.config[activeSkill][activeAction])
            return;

        let currentAction = this.config[activeSkill][activeAction];

        // Check if task exists
        if (this.tasks.hasOwnProperty(activeSkill)) {
            this.clearTimer('resource');

            let timer = this.getTaskTimer();

            this.socket.emit('startProgressBar', {activeAction, timer});

            this.timers['resource'] = setTimeout(() => {
                this.tasks[activeSkill].execute(
                    currentAction,
                    this.socket,
                    this.data
                );
                this.executeTask()
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
                clearTimeout(this.timers[i])
        }
    }

    clearTimers() {
        for (const i in this.timers) {
            clearTimeout(this.timers[i])
        }
    }

    getTaskTimer() {
        console.log(this.config[this.data.activeSkill][this.data.activeAction]);
        if(Math.random() >= 0.3)
            return this.currentAction.time / 2 || 5;

        return this.currentAction.time || 10;
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
            this.startTask([user.activeAction, user.activeSkill]);
        });
    }

    save() {
        let user = "user " + this.data.username;
        this.redis.set(user, JSON.stringify(this.data));
    }
}