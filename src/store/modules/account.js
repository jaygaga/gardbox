import webc from '@/utils/webc';
import ajax from '@/utils/ajax.js';
import { isEmpty } from 'lodash';

import { Message } from 'element-ui';

const wallet_users = localStorage.getItem('gard_wallet_users') || {};
const wallet_username = localStorage.getItem('gard_wallet_username') || '';

export default {
  namespaced: true,

  state: {
    userName: wallet_username,
    account: {},
    keyStore: {},
    userMap: JSON.parse(wallet_users),
    balance: 0
  },

  getters: {},

  mutations: {
    setUserName: function(state, userName) {
      state.userName = userName;
    },
    setAccount: function(state, account) {
      state.account = account;
    },
    setKeyStore: function(state, keyStore) {
      state.keyStore = keyStore;
    },
    setUserMap: function(state, userMap) {
      state.userMap = Object.assign({}, state.userMap, userMap);
    },
    setBalance: function(state, balance) {
      state.balance = balance;
    }
  },

  actions: {
    create: async function(context, { name, pass }) {
      // reject if name exist
      if (context.state.userMap[name]) {
        return Promise.resolve(false);
      }
      // create account
      const account = webc.create();
      context.commit('setUserName', name);
      context.commit('setAccount', account);
      // generate keyStore with password
      context.dispatch('generateKeyStore', pass);

      return Promise.resolve(true);
    },
    generateKeyStore: function(context, pass) {
      const keyStore = webc.toV3KeyStore(context.state.account.privateKey, pass);
      context.commit('setKeyStore', keyStore);
      return Promise.resolve();
    },
    finishCreate: async function(context) {
      const name = context.state.userName;
      context.commit('setUserMap', { [name]: context.state.keyStore });
      // save keyStore to localStorage
      localStorage.setItem('gard_wallet_username', name);
      localStorage.setItem('gard_wallet_users', JSON.stringify(context.state.userMap));
      // clear account mnemonic
      context.commit('setAccount', {});
      return Promise.resolve(true);
    },
    importPhrase: async function(context, { name, pass, phrase }) {
      // reject if name exist
      if (context.state.userMap[name]) {
        Message({
          type: 'error',
          message: 'Account exists!',
          center: true
        });
        return Promise.resolve();
      }
      try {
        const account = webc.recover(phrase);
        context.commit('setUserName', name);
        context.commit('setAccount', account);

        context.dispatch('generateKeyStore', pass);
        await context.dispatch('finishCreate');
        return Promise.resolve(account);
      } catch (e) {
        console.log(e);
        Message({
          type: 'error',
          message: 'Wrong mnemonic!',
          center: true
        });
        return Promise.resolve();
      }
    },
    importKeyStore: async function(context, { name, pass, keyStore }) {
      const key = JSON.parse(keyStore);
      const account = await context.dispatch('login', { pass, keyStore: key });
      if (isEmpty(account)) {
        Message({
          type: 'error',
          message: 'keyStore or password is invalid!',
          center: true
        });
        return Promise.resolve();
      }
      context.commit('setUserName', name);
      context.commit('setKeyStore', key);

      await context.dispatch('finishCreate');
      return Promise.resolve(account);
    },
    login: async function(context, { name, pass, keyStore }) {
      const { userMap } = context.state;
      let key = keyStore || userMap[name];
      try {
        const account = webc.fromV3KeyStore(key, pass);
        context.commit('setUserName', name);
        context.commit('setKeyStore', key);
        localStorage.setItem('gard_wallet_username', name);
        return Promise.resolve(account);
      } catch (e) {
        console.log(e);
        return Promise.resolve();
      }
    },
    logout: function(context) {
      context.commit('setUserName', '');
      context.commit('setKeyStore', {});
      localStorage.setItem('gard_wallet_username', '');
      return Promise.resolve();
    },
    fetchBalance: async function(context, username) {
      const { address } = context.state.userMap[username];
      const { data } = await ajax.get(`api/bank/balances/${address}`);
      if (!isEmpty(data)) {
        context.commit('setBalance', data[0].amount);
      }
      return Promise.resolve(data);
    }
  }
};
