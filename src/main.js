import Vue from 'vue';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import '@/styles/element-variables.scss';
import App from './App.vue';
import router from './router';
import * as filters from '@/utils/filters.js';
import rootStore from './store/index.js';

import Card from '@/components/Card';

import Link from '@/components/Link';
import DataItem from '@/components/DataArea/item.vue';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Vuex);
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

const store = new Vuex.Store(rootStore);

// get blockchain basic info
store.dispatch('basic/fetch');

// 注册全局组件
Vue.component('s-card', Card);

Vue.component('hg-link', Link);
Vue.component('data-item', DataItem);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
