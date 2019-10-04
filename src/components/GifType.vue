<template>
    <div ref="stageParent">
        <v-stage ref="stage" :config="stageSize">
            <v-layer ref="image-layer">
                <v-image :config="imageConfig"/>
                <v-text :config="textConfig"/>
            </v-layer>
        </v-stage>
    </div>
</template>

<script>
    const maxTextLength = 359;
    let canvasWidth = 654;
    let canvasHeight = 451;
    let fontSize = 30;

    import CCapture from 'ccapture.js';

    export default {
        name: 'GifType',
        props: [
            "text",
            "frameRate",
            "delay",
            "backgroundImage",
            "generateTrigger",
        ],
        data() {
            return {
                stageSize: {
                    width: canvasWidth,
                    height: canvasHeight,
                },
                textConfig: {
                    text: '',
                    x: 18,
                    y: 105,
                    wrap: 'word', //or char or none, it's for break lines
                    width: canvasWidth - 45,
                    fontSize: fontSize
                },
                imageConfig: {
                    image: null,
                    scaleX: null,
                    scaleY: null,
                },
                renderInterval: null,
                renderIntervalTime: 1000 / this.frameRate,
                captureStarted: false,
                gifRenderProgress: 0,
                capturer: this.getCCapture(),
            };
        },
        created() {
            const image = new window.Image();
            image.src = this.backgroundImage;
            image.onload = () => {
                let scale = canvasWidth / image.width;

                this.imageConfig.image = image;
                this.imageConfig.scaleX = scale;
                this.imageConfig.scaleY = scale;
            };
        },
        mounted() {
            this.startRenderInterval();
        },
        methods: {
            getCCapture() {
                let state = this;

                return new CCapture({
                    framerate: this.frameRate,
                    quality: 100,
                    workers: 12,
                    verbose: false,
                    format: 'gif',
                    workersPath: 'js/',
                    display: false,
                    onProgress: function (progress) {
                        state.$emit('progress', progress * 100);
                    }
                });
            },
            startRenderInterval() {
                let state = this;
                state.renderInterval = setInterval(() => {
                    if (this.captureStarted) {
                        let canvas = this.$refs.stage.getStage().toCanvas();
                        this.capturer.capture(canvas);
                    }

                    if (!state.text[state.textConfig.text.length]) {
                        clearInterval(state.renderInterval);
                        if (state.captureStarted) {
                            state.captureStopAndDownload();
                        }
                        return;
                    }

                    let rawText = state.text;

                    this.gifRenderProgress = Math.round((state.textConfig.text.length / rawText.length) * 100);
                    state.textConfig.text = state.textConfig.text + rawText[state.textConfig.text.length];

                    if (state.textConfig.text.length > maxTextLength) {
                        clearInterval(state.renderInterval);
                        if (state.captureStarted) {
                            state.captureStopAndDownload();
                        }
                    }
                }, this.renderIntervalTime);
            },
            redraw() {
                this.textConfig.text = '';
                clearInterval(this.renderInterval);
                this.startRenderInterval();
            },
            generateResult() {
                this.renderIntervalTime = 1;
                this.redraw();
                this.captureStart();
            },
            captureStart() {
                this.captureStarted = true;
                this.capturer.start();
            },
            captureStopAndDownload() {
                let state = this;
                let canvas = this.$refs.stage.getStage().toCanvas();
                for (let i = 0; i < this.delay * this.frameRate; i++) {
                    this.capturer.capture(canvas);
                }
                this.capturer.stop();
                this.capturer.save(function (payload) {
                    state.$emit('renderedImage', payload);
                });
                this.renderIntervalTime = 1000 / this.frameRate;
                this.captureStarted = false;
                this.capturer = this.getCCapture();
            }
        },
        watch: {
            frameRate: function (newValue) {
                this.renderIntervalTime = 1000 / newValue;
                this.capturer = this.getCCapture();
                this.redraw();
            },
            text: function () {
                this.redraw();
            },
            generateTrigger: function () {
                this.generateResult();
            }
        }
    }
</script>