<template>
  <div class="about">


    <button v-on:click="updateTask('mining', 'copper')">Mine</button>
    <button v-on:click="updateTask('woodcutting', 'tree')">Woodcutting</button>

    <p v-if="this.$parent.$data.user.currentTask !== null"><button v-on:click="stopTask">Stop Task</button></p>
  </div>
</template>
<script>
  export default {
    name: 'Gathering',
    methods: {
      updateTask: function(task, detail) {
        console.log('change task');
        window.$socket.emit('change task', {task, detail});
      },
      stopTask: function() {
        console.log('stop task');
        window.$socket.emit('stop task')
      }
    }
  }
</script>
