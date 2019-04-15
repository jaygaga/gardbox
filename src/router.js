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
import Recover from './views/Recover.vue';
import RecoverKeyText from '@/components/Recover/KeyText/KeyInput.vue';
import RecoverKeyFile from '@/components/Recover/KeyFile/KeyUpload.vue';
import RecoverKeySubmit from '@/components/Recover/KeyText/KeySubmit.vue';
import RecoverPhraseText from '@/components/Recover/Phrase/PhraseInput.vue';
import RecoverPhraseSubmit from '@/components/Recover/Phrase/PhraseSubmit.vue';

import Main from './views/Main.vue';
import Send from './views/Send.vue';
import SendForm from '@/components/Send/SendForm.vue';
import SendConfirm from '@/components/Send/SendConfirm.vue';
import SendFinish from '@/components/Send/SendFinish.vue';
import Receive from './views/Receive.vue';

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
      component: Recover,
      children: [
        {
          path: 'key/text',
          component: RecoverKeyText
        },
        {
          path: 'key/submit',
          component: RecoverKeySubmit
        },
        {
          path: 'key/file',
          component: RecoverKeyFile
        },
        {
          path: 'phrase/text',
          component: RecoverPhraseText
        },
        {
          path: 'phrase/submit',
          component: RecoverPhraseSubmit
        }
      ]
    },
    {
      path: '/main',
      name: 'main',
      component: Main
    },
    {
      path: '/send',
      name: 'send',
      component: Send,
      children: [
        {
          path: 'form',
          component: SendForm
        },
        {
          path: 'confirm',
          component: SendConfirm
        },
        {
          path: 'finish',
          component: SendFinish
        }
      ]
    },
    {
      path: '/receive',
      name: 'receive',
      component: Receive
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
});
