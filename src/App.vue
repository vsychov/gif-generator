<template>
    <div id="app" class="container justify-content-center">
        <div class="card-deck" v-if="!renderedGifContents" :hidden="inProgress">
            <div class="col-12 d-flex justify-content-center">
                <GifType
                        :text="text"
                        :frame-rate="renderFrameRate"
                        :background-image="require('./assets/type-bg.png')"
                        :generate-trigger="generateTrigger"
                        @renderedImage="handleRenderedImage"
                        @progress="handleRenderingProgress"
                />
            </div>

            <div class="col-12 d-flex justify-content-center pt-4">
                <form class="col-8" @submit.prevent="handleSumbit">
                    <div class="form-group">
                        <label for="textMessage">Message:</label>
                        <textarea v-model="text" id="textMessage" class="form-control col-12"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="renderFrameRate" class="align-self-start">Framerate:</label>
                        <input v-model="renderFrameRate" step="0.1" class="form-control" id="renderFrameRate"
                               type="number" min="0.1"
                               max="100"/>
                        <small id="emailHelp" class="form-text text-muted">how many chars render peer second</small>
                    </div>
                    <div class="form-group">
                        <button class="form-control btn btn-primary">Generate GIF</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="card-deck col-12 d-flex vh-100" v-if="inProgress && !renderedGifContents">
            <div class="col-12 align-self-center">
                <h1>
                    You gif is generating, please wait.
                </h1>
                <div class="progress col-12 pl-0 pr-0">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                         :style="'width:' + gifRenderProgress + '%;'">
                        {{ gifRenderProgress }}%
                    </div>
                </div>
            </div>
        </div>
        <div class="card-deck" v-if="renderedGifContents">
            <div class="col-12 d-flex justify-content-center">
                <img :src="renderedGifContents" class="mw-100">
            </div>
            <div class="col-12 d-flex justify-content-center pt-4">
                <div class="form-group pr-2">
                    <button @click="handleDownloadAction" class="form-control btn btn-primary">Download GIF</button>
                </div>
                <div class="form-group pl-2">
                    <button @click="handleNewGifRequest" class="form-control btn btn-secondary">Generate new GIF</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GifType from './components/GifType.vue'
    import download from 'ccapture.js/src/download'

    export default {
        name: 'app',
        components: {
            GifType
        },
        data() {
            return {
                // text: 'test',
                text: 'Привет, у меня нет наушников, так что я не смогу прослушать такое сообщение, лол :)))',
                renderFrameRate: 4,
                generateTrigger: null,
                renderedGifContents: null,
                renderedGifContentsBlob: null,
                inProgress: false,
                gifRenderProgress: 0,
            }
        },
        methods: {
            handleNewGifRequest() {
                this.renderedGifContents=null;
                this.inProgress=false;
            },
            handleRenderingProgress(progress) {
                this.gifRenderProgress = Math.round(progress);
            },
            handleSumbit() {
                this.generateTrigger = Math.random();
                this.inProgress = true;
            },
            handleRenderedImage(payload) {
                let state = this;
                let reader = new FileReader();
                this.renderedGifContentsBlob = payload;

                reader.readAsDataURL(payload);
                reader.onloadend = function () {
                    state.renderedGifContents = reader.result
                };
            },
            handleDownloadAction() {
                download( this.renderedGifContentsBlob, 'no-voice-message.gif', 'image/gif')
            }
        }
    }
</script>

<style>
    @import "~bootstrap/dist/css/bootstrap.css";
</style>

