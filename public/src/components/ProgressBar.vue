<template>
    <div class="progress-container" :id="id">
        <div class="message" v-if="xp" :class="{'animate': animateMessage}">{{xp}}</div>
        <div class="progress-bar" :class="{'animate': animateBar}">
            <div class="progress"></div>
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
        },
        data: function() {
            return {
                animateBar: false,
                animateMessage: false,
                xp: this.message
            }
        },
        mounted() {
            window.$socket.on(`${this.id}`, function() {
                console.log('event detected')
            })
        },
        methods: {
            rand: function (max) {
              return Math.floor(Math.random() * Math.floor(max));
            },
            xpMessage: function () {
                let _self = this;
                this.xp = '+' + this.rand(10) + ' xp';
                this.animateMessage = true;

                this.animateBar = true;

                setTimeout(function () {
                    _self.animateBar = false;
                    _self.animateMessage = false;
                }, this.timer / 2);
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


        &.animate {
            .progress {
                display: block;
                animation: fillProgress 1s;
                //opacity: 0;
            }
        }

        .progress {
            height: 20px;
            background-color: red;
        }
    }

    .progress-container {
        position: relative;
        display: flex;
        justify-content: center;
    }

    .message {
        display: none;
        position: absolute;
        bottom: 35px;

        &.animate {
            display: block;
            animation: animateMessage 1.5s;
            opacity: 0;
        }
    }

    @keyframes fillProgress {
        0% {
            width: 0%;
        }

        80% {
            opacity: 100%;
        }

        100% {
            width: 100%;
            opacity: 0%;
        }
    }

    @keyframes animateMessage {
        0% {
            width: 0;
            opacity: 0;
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
