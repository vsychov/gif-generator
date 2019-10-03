import Vue from 'vue'
import VueKonva from 'vue-konva'
import VueI18n from 'vue-i18n'

Vue.use(VueKonva);
Vue.use(VueI18n);

import App from './App.vue'
Vue.config.productionTip = false;

// Ready translated locale messages
const messages = {
  en: {
    message: {
      welcome_text: 'Hi, I don’t have any headphones, so I can’t listen that message, lol :)))',
      generate_new_gif: 'Generate new GIF',
      download_gif: 'Download GIF',
      gif_generate_inp: 'You gif is generating, please wait.',
      generate_gif: 'Generate GIF',
      frame_rate_help: 'how many chars render peer second',
      framerate: 'Framerate:',
      delay: 'Delay:',
      message: 'Message:'
    }
  },
  ru: {
    message: {
      welcome_text: 'Привет, у меня нет наушников, так что я не смогу прослушать такое сообщение, лол :)))',
      generate_new_gif: 'Создать новый GIF',
      download_gif: 'Скачать GIF',
      gif_generate_inp: 'GIF файл генерируется, пожалуйста подождите.',
      generate_gif: 'Создать GIF',
      frame_rate_help: 'сколько символов отрисовывать в секунду',
      framerate: 'Частота кадров:',
      delay: 'Задержка в конце:',
      message: 'Сообщение:',
    }
  }
};

const i18n = new VueI18n({
  locale: (navigator.language || navigator.userLanguage).substr(0, 2),
  fallbackLocale: 'en',
  messages,
});


new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app');
