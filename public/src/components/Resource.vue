<template>
    <div class="resource" :id="'resource-' + resourceName">
        {{ resourceName }}

        <div class="image"></div>

        <progress-bar :id="'progress-' + resourceName" :resourceId="this.resource"></progress-bar>
        <button v-on:click="toggleResource()">{{ buttonText }}</button>
    </div>
</template>

<script>
    import Items from '../assets/itemlist';
    import ProgressBar from "./ProgressBar";

    export default {
        name: 'Resource',
        components: {ProgressBar},
        props: {
            resource: Number
        },
        data: function () {
            return {
                started: false
            }
        },
        computed: {
            resourceName() {
                return Items[this.resource].name;
            },
            buttonText() {
                return this.started === true ? 'Stop' : 'Start';
            }
        },
        methods: {
            toggleResource: function () {
                if (this.started)
                    this.$socket.emit('stop task', this.resource)
                else
                    this.$socket.emit('start task', this.resource)
            }
        },
        sockets: {
            startProgressBar: function (data) {
                this.started = false;
                if (data.task === this.resource) {
                    this.started = true;
                }
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

        .image {
            height: 90px;
        }
    }
</style>
