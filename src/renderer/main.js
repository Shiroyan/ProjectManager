import Vue from 'vue';
import ElementUI from 'element-ui';

import App from './App';
import router from './router';
import store from './store';
import api from './api';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

Vue.use(ElementUI);
Vue.prototype.$api = api;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
