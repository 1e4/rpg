<template>
    <div class="about">
        <h1>This is a woodcutting page</h1>
        <Resource :resource="'tree'"></Resource>
    </div>
</template>
<script>
    import Resource from "../components/Resource";
    export default {
        name: 'Woodcutting',
        components: {Resource},
        data: () => {
            return {}
        },
      computed: {
          currentSkill: () => {
            console.log(this.$root.$data);
            return this.$root.$data.user.currentTask;
          }
      }
    }
</script>