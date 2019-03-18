import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Blocks from './views/Blocks.vue';
import BlockDetail from './views/BlockDetail.vue';
import Transactions from './views/Transactions.vue';
import TransactionDetail from './views/TransactionDetail.vue';
import AddressDetail from './views/AddressDetail.vue';
import Validators from './views/Validators.vue';
import ValidatorDetail from './views/ValidatorDetail.vue';
import NotFound from './views/NotFound.vue';
import View from '@/components/View';

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
      path: '/block',
      component: View,
      children: [
        {
          path: '',
          name: 'blocks',
          component: Blocks
        },
        {
          path: '/block/:id',
          name: 'blockDetail',
          component: BlockDetail
        }
      ]
    },
    {
      path: '/tx',
      component: View,
      children: [
        {
          path: '',
          name: 'transactions',
          component: Transactions
        },
        {
          path: ':hash',
          name: 'transactionDetail',
          component: TransactionDetail
        }
      ]
    },
    {
      path: '/address/:address',
      name: 'addressDetail',
      component: AddressDetail
    },
    {
      path: '/validator',
      component: View,
      children: [
        {
          path: '',
          name: 'validators',
          component: Validators
        },
        {
          path: ':address',
          name: 'validatorDetail',
          component: ValidatorDetail
        }
      ]
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
});
