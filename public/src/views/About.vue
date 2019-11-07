<template>
  <div class="about">
    <p>Ticks left {{ user.ticksLeft }}</p>

    <p>You are currently {{ user.currentTask }}</p>

    <button v-on:click="updateTask('mine')">Mine</button>
    <button v-on:click="updateTask('woodcutting')">Woodcutting</button>

    <p v-if="user.currentTask !== null"><button v-on:click="stopTask">Stop Task</button></p>

    <pre>
      {{ user }}
    </pre>
  </div>
</template>

<script>
  export default {
    name: 'About',
    data: function() {
      return {
        currentProgress: 0,
        user: {},
      }
    },
    mounted: function() {
      window.$socket.on('tick update', (tick) => {
        this.user.ticksLeft = tick;
        console.log('update tick', tick);
      });

      window.$socket.on('login', (u) => {
        this.$set(this, 'user', u)
        console.log('login', u)
      })

      window.$socket.on('update user', (u) => {
        this.$set(this, 'user', u);
        console.log('update user', u)
      })
    },
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
