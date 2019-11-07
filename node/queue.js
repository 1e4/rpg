let Queue = require('bull'),
    cluster = require('cluster');

let numWorkers = 8,
    queue = new Queue('tasks', 'redis://127.0.0.1:6379');

let woodcutting = require('./taskHandlers/woodcutting.js'),
    WoodCutting = new woodcutting();

if (cluster.isMaster) {
    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
    });

    queue.add({
        task: 'woodcutting'
    })
} else {
    queue.process(function (job, done) {
        let timeStarted = new Date() / 1000;

        switch (job.data.task) {
            case 'woodcutting':
                WoodCutting.handle();
                break;
            default:
                console.error("No task defined")
        }


        let timeFinished = new Date() / 1000,
            time = timeFinished - timeStarted;

        console.log(job.id, job.data, 'Job done in ' + time + ' milliseconds');
        done();
    });
}