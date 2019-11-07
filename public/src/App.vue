<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>

    <div id="tick-progress">
      <div class="progress" :style="{width: tickProgress + '%'}"></div>
    </div>

    <p>Ticks left {{ user.ticksLeft }}</p>

    <p>You are currently {{ user.currentTask }}</p>
    
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
  export default {
    data: function () {
      return {
        currentProgress: 0,
        user: {},
        tickProgress: 100,
      }
    },
    mounted: function () {
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

      setInterval(function () {
        _self.tickProgress--;
      }, 50);
    }
  }
</script>