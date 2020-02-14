<template>
    <div id="play-screen">
        <div id="bg">
            <div class="blur"></div>
            <div class="image"></div>
        </div>
        <div id="game">
            <div class="col-sm-12 col-md-3">

                <router-link :to="'woodcutting'">Woodcutting</router-link>
            </div>
            <div class="col-sm-12 col-md-9">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    #bg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
        z-index: 0;

        .image {
            background: url('https://images.unsplash.com/photo-1499343162160-cd1441923dd3') no-repeat top center;
            background-size: cover;
            height: 100%;
            width: 100%;
        }

        .blur {
            background: rgba(0,0,0,0.8);
            height: 100%;
            width: 100%;
            position: absolute;
        }
    }

    #game {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 20;
    }
</style>
<script>
    // @ is an alias to /src

    export default {
        name: 'Play',
        components: {}
    }
</script>
