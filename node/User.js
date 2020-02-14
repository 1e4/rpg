module.exports = (id, socket, redis, bull) =>  {

    let user = {};

    user.username = id;
    user.currentTask = null;



    return {
        user,
        init: () => {

        },

        changeTask: (task) => {
            this.currentTask = task;
            socket.emit('change task', task);
        },

        stopTask: () => {
            this.currentTask = null;
            socket.emit('change task', null);
        }
    }


};