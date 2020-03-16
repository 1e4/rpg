<template>
    <div class="about">
        <h1>This is a woodcutting page</h1>
        <div class="grid">
            <Resource :resource="301"></Resource>
            <Resource :resource="302"></Resource>
            <Resource :resource="303"></Resource>
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