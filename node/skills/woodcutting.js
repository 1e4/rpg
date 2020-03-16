const io = require('../socket');

module.exports =  {
    name: 'woodcutting',
    execute: function(task, socket, data) {

        socket.emit('showXp', {
            task: task.id,
            xp: task.experience
        });
        this.process();
    },
    process: function() {
        // console.log('processing chop')
    }
}