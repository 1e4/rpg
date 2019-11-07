<template>
  <div class="about">
    <p>Ticks left {{ user.ticksLeft }}</p>

    <p>You are currently {{ user.currentTask }}</p>

    <div id="tick-progress">
      <div class="progress" :style="{width: tickProgress + '%'}"></div>
    </div>

    <button v-on:click="updateTask('mine')">Mine</button>
    <button v-on:click="updateTask('woodcutting')">Woodcutting</button>

    <p v-if="user.currentTask !== null"><button v-on:click="stopTask">Stop Task</button></p>

    <pre>
      {{ user }}
    </pre>
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
    name: 'About',
    data: function() {
      return {
        currentProgress: 0,
        user: {},
        tickProgress: 100,
      }
    },
    mounted: function() {
      window.$socket.on('tick update', (tick) => {
        this.user.ticksLeft = tick;
        console.log('update tick', tick);
        this.tickProgress = 100;
      });

      window.$socket.on('login', (u) => {
        this.$set(this, 'user', u)
        console.log('login', u)
      })

      window.$socket.on('update user', (u) => {
        this.$set(this, 'user', u);
        console.log('update user', u)
      });

      window.$socket.on('sync tick animation', () => {
        this.tickProgress = 100;
      })

      let _self = this;

      setInterval(function() {
        _self.tickProgress--;
      }, 50);
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
