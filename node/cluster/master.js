const cluster = require('cluster');
const cores = 4;

console.log("Master process running");

for (let i = 0; i < cores; i++) {
    cluster.fork();
}

cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
});