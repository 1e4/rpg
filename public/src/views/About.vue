<template>
  <div class="about">


    <button v-on:click="updateTask('mining')">Mine</button>
    <button v-on:click="updateTask('woodcutting')">Woodcutting</button>

    <p v-if="this.$parent.$data.user.currentTask !== null"><button v-on:click="stopTask">Stop Task</button></p>
  </div>
</template>
<style lang="scss">
  #tick-progress {
    width: 100%;
    background: black;
    height: 30px;

    .progress {
      background: red;
      height: 30px;
      transition: ease-out 50ms;

      &.animate {
        background: magenta;
        animation: 5s linear infinite progressBar;
      }
    }
  }


  @keyframes progressBar {
    from {
      width: 100%;
    }

    to {
      width: 0%;
    }
  }
</style>
<script>
  export default {
    name: 'Gathering',
    methods: {
      updateTask: function(task) {
        console.log('change task');
        window.$socket.emit('change task', task);
      },
      stopTask: function() {
        console.log('stop task');
        window.$socket.emit('stop task')
      }
    }
  }
</script>
