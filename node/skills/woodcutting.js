const io = require('../socket');

module.exports =  {
    name: 'woodcutting',
    trees: {
        tree: {
            time: 2000,
            xp: 5
        }
    },
    execute: function(job) {

        console.log('Executing woodcutting');
        console.log(job);

        this.task = job.user.currentTask.task;
        this.detail = job.user.currentTask.detail;
        // this.tickHandler = job.tickHandler;
        this.user = job.user;

        this.job = job;

        this.process();
    },
    process: function() {
        console.log('Processing: ', 'cutting: ' + this.detail);

        this.user.ticksLeft--;

        this.job.result = {
            channel: `private user ${this.user.username}`,
            event: 'tick update',
            data: this.user.ticksLeft,
            nextTick: 10,
            user: this.user
        }
    }
}