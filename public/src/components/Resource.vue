<template>
    <div class="resource" :id="'resource-' + resourceIdName" :key="resource">
        {{ resourceName }}

        <div class="image"></div>

        <progress-bar :id="'progress-' + resourceName" :resourceId="this.resource"></progress-bar>
        <button v-on:click="toggleResource()">{{ buttonText }}</button>
    </div>
</template>

<script>
    import ProgressBar from "./ProgressBar";

    export default {
        name: 'Resource',
        components: {ProgressBar},
        props: {
            resource: Number,
            skill: String
        },
        data: function () {
            return {
                started: false,
                item: {}
            }
        },
        beforeMount() {
            this.item = window.$config.woodcutting[this.resource]
        },
        computed: {
            resourceIdName() {
                return this.item.name.toLowerCase();
            },
            resourceName() {
                return this.item.name;
            },
            buttonText() {
                return this.started === true ? 'Stop' : 'Start';
            }
        },
        methods: {
            toggleResource: function () {
                if (this.started)
                    this.$socket.emit('stop task', [this.resource, this.skill])
                else
                    this.$socket.emit('start task', [this.resource, this.skill])
            }
        },
        sockets: {
            startProgressBar: function (data) {

                this.started = data.task === this.resource;
            },
            'stop task': function() {
                this.started = false;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .resource {
        display: block;
        width: 50%;

        .image {
            height: 90px;
        }
    }
</style>
