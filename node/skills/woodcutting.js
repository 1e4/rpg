const io = require('../socket');

module.exports =  {
    name: 'woodcutting',
    execute: function(task, socket, data) {

        console.log('running woodcutting task', task);
        socket.emit('showXp', {
            activeAction: data.activeAction,
            xp: task.xp
        });
        this.process();
    },
    process: function() {
        // console.log('processing chop')
    }
}