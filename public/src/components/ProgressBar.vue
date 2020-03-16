<template>
    <div>

        <div class="progress-container" :id="id">
            <div class="message" v-if="xp" :class="{'animate': animateMessage}">{{xp}}</div>
            <div class="progress-bar" :class="{'animate': animateBar, 'no-animation': !animateBar}">
                <div class="progress" :style="progressStyles"></div>
            </div>
        </div>
        {{ animateBar }}
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
        data: function() {
            return {
                animateBar: false,
                animateMessage: false,
                xp: this.message,
                width: 0,
                progressStyles: {
                    width: 0
                }
            }
        },
        mounted() {
        },
        sockets: {
            startProgressBar: function(data) {

                this.stopAnimation();
                this.progressStyles.width = 0;

                if(data.task === this.resourceId) {
                    this.startAnimation(data.timer);
                }
            },
            showXp: function(data) {
                if(data.task === this.resourceId)
                {
                    this.xp = `+${data.xp}xp`;
                    this.animateMessage = true;
                    setTimeout(() => {
                        this.animateMessage = false;
                        this.xp = '';
                    }, 1000);
                }
            },
            'stop task': function() {
                this.stopAnimation()
            }
        },
        methods: {
            startAnimation: function(timer) {
                // this.progressStyles.animation = 'fillProgress';
                this.progressStyles.animationDuration = timer / 1000 + 's';
                this.progressStyles.animationIterationCount = 'infinite';
                this.animateBar = true;
            },
            stopAnimation: function() {
                this.progressStyles.width = '0px';
                this.animateBar = false;
                this.animateMessage = false;
                console.log('stopping')
            },
            rand: function (max) {
              return Math.floor(Math.random() * Math.floor(max));
            },
            xpMessage: function () {
                // let _self = this;
                // this.xp = '+' + this.rand(10) + ' xp';
                // this.animateMessage = true;
                //
                // this.animateBar = true;
                //
                // setTimeout(function () {
                //     _self.animateBar = false;
                //     _self.animateMessage = false;
                // }, this.timer / 2);
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
                animation: fillProgress 5s infinite linear;
                //opacity: 0;
            }
        }

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
            animation: animateMessage infinite 1.5s;
            opacity: 0;
            color: white;
        }
    }

    .stop-animation {
        animation: none;
    }

    @keyframes fillProgress {
        0% {
            width: 0;
        }

        100% {
            width: 100%;
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
