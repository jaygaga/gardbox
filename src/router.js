import Vue from 'vue';
import Router from 'vue-router';
import NotFound from './views/NotFound.vue';
import Home from './views/Home.vue';
import Agree from './views/Agree.vue';
import Passport from './views/Passport.vue';
import Create from './views/Create/index.vue';
import CreatePass from './views/Create/password.vue';
import CreateMnem from './views/Create/mnemonic.vue';
import CreateConfirm from './views/Create/confirm.vue';
import Login from './views/Login.vue';
import Recover from './views/Recover/index.vue';
import ImportKeyStore from './views/Recover/ImportKeyStore.vue';
import ImportPhrase from './views/Recover/ImportPhrase.vue';
import Main from './views/Main.vue';
import Send from './views/Send.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/agree',
      name: 'agree',
      component: Agree
    },
    {
      path: '/passport',
      name: 'passport',
      component: Passport
    },
    {
      path: '/create',
      name: 'create',
      component: Create,
      children: [
        {
          path: 'pass',
          component: CreatePass
        },
        {
          path: 'mnemonic',
          component: CreateMnem
        },
        {
          path: 'confirm',
          component: CreateConfirm
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/recover',
      name: 'recover',
      component: Recover
    },
    {
      path: '/recover/key',
      name: 'key',
      component: ImportKeyStore
    },
    {
      path: '/recover/phrase',
      name: 'phrase',
      component: ImportPhrase
    },
    {
      path: '/main',
      name: 'main',
      component: Main
    },
    {
      path: '/send',
      name: 'send',
      component: Send
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
});
