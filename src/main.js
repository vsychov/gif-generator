import Vue from 'vue'
import VueKonva from 'vue-konva'
Vue.use(VueKonva);

import App from './App.vue'
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
