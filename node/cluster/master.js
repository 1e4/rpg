const cluster = require('cluster');
const cores = 1;

console.log("Master process running");

for (let i = 0; i < cores; i++) {
    cluster.fork();
}

function messageHandler(message) {
    switch(message.cmd) {
        case 'disconnect user':
            return eachWorker((worker) => {
                worker.send(message);
            });
    }
}
function eachWorker(callback) {
    for (const id in cluster.workers) {
        callback(cluster.workers[id]);
    }
}

for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
}

cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
});