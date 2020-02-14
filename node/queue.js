const bullQueue = require('bull');
const cluster = require('cluster');
const fs = require('fs');
const redis = require('redis');
const numWorkers = 2;
const queue = new bullQueue('tasks', 'redis://127.0.0.1:6379');

let tasks = {};

const taskFiles = fs.readdirSync('./skills').filter(
    file => file.endsWith('.js')
);

for (const file of taskFiles) {
    const task = require(`./skills/${file}`);
    tasks[task.name] = task;
    console.log(`Loaded task ${task.name}`)
}

if (cluster.isMaster) {

    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
    });
} else {


    let pub = redis.createClient();

    queue.process(function (job, done) {
        let timeStarted = new Date() / 1000,
            task = `${job.data.user.currentTask.task}`;

        let timeFinished = new Date() / 1000,
            time = timeFinished - timeStarted;

        tasks[task].execute(job.data);

        done();
    });
    queue.on('completed', function (job) {
        console.log('stream', job.data);
        pub.publish('stream', JSON.stringify(job.data.result));
    });
}