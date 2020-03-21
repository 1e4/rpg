<template>
    <div class="about">
        <h1>This is a woodcutting page</h1>
        <div class="grid">
            <Resource :resource="1" :skill="'woodcutting'"></Resource>
            <Resource :resource="2" :skill="'woodcutting'"></Resource>
            <Resource :resource="3" :skill="'woodcutting'"></Resource>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .grid {
        display: flex;
        justify-content: space-between;
    }
</style>
<script>
    import Resource from "../components/Resource";

    export default {
        name: 'Woodcutting',
        components: {Resource}
    }
</script>