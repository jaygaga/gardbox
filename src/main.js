import Vue from 'vue';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import VueClipboard from 'vue-clipboard2';
import '@/styles/element-variables.scss';
import App from './App.vue';
import router from './router';

import { en, zh } from '@/constants';
import * as filters from '@/utils/filters.js';
import rootStore from './store/index.js';

import Link from '@/components/Link';
import Card from '@/components/Card';

Vue.config.productionTip = false;

Vue.use(VueI18n);
const lang = localStorage.getItem('lang') || window.navigator.language || window.navigator.userLanguage;
const i18n = new VueI18n({
  locale: lang.match('zh') ? 'zh' : 'en',
  messages: { en, zh }
});

Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(VueClipboard);
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

const store = new Vuex.Store(rootStore);

// get blockchain basic info
store.dispatch('account/getNodeInfo');

// 注册全局组件
Vue.component('s-card', Card);
Vue.component('s-link', Link);

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
