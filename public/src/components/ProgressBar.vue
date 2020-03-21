<template>
    <div :id="'progressbar-resource-'+resourceId">
        {{ styles.transitionDuration }}
        <div class="progress-container" :id="id">
            <div class="message animate" v-for="(xp, index) in messages" :key="index">{{xp}}</div>
            <div class="progress-bar">
                <div class="progress" :style="{
                    width: getWidth(),
                    transitionDuration: getDuration()
                }"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ProgressBar',
        props: {
            message: String,
            timer: String,
            id: String,
            resourceId: Number
        },
        data: function () {
            return {
                animateBar: false,
                animateMessage: false,
                xp: this.message,
                styles: {
                    width: null,
                    transitionDuration: null,
                },
                messages: [],
                progressBarTimer: null
            }
        },
        mounted() {
        },
        sockets: {
            startProgressBar: function (data) {
                this.styles.width = 0;
                clearInterval(this.progressBarTimer);
                if (data.activeAction === this.resourceId) {
                    this.progressBarTimer = setInterval(() => {
                        this.styles.width++;
                    }, data.timer / 100)
                }
            },
            showXp: function (data) {
                console.log('show xp', data);
                if (data.activeAction === this.resourceId) {
                    this.messages.push(`+${data.xp}xp`);
                    setTimeout(() => {
                        this.messages.shift()
                    }, 900);
                }
            },
            'stop task': function () {
                clearInterval(this.progressBarTimer);
                this.styles.width = 0;
            }
        },
        methods: {
            getDuration: function() {
                return this.styles.transitionDuration + 's';
            },

            getWidth: function() {
                return this.styles.width + '%'
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .progress-bar {
        width: 100%;
        padding: 5px;
        background-color: black;
        max-width: 200px;

        .progress {
            height: 20px;
            background-color: red;
            width: 0;
        }
    }

    .progress-container {
        position: relative;
        display: flex;
        justify-content: center;
    }

    .message {
        display: block;
        position: absolute;
        bottom: 35px;
        color: white;

        &.animate {
            display: block;
            animation: animateMessage 1s;
            animation-iteration-count: infinite;
            opacity: 0;
            color: white;
        }
    }

    @keyframes animateMessage {
        0% {
            opacity: 0;
            transform: translateY(0);
        }

        80% {
            opacity: 100%;
        }

        100% {
            opacity: 0;
            transform: translateY(-40px);
        }
    }
</style>
