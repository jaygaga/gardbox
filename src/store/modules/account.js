import webc from '@/utils/webc';
import ajax from '@/utils/ajax.js';
import { get, set, isEmpty } from 'lodash';

import { Message } from 'element-ui';

const wallet_users = localStorage.getItem('gard_wallet_users') || '{}';
const wallet_username = localStorage.getItem('gard_wallet_username') || '';
const userMap = JSON.parse(wallet_users) || {};
const keyStore = userMap[wallet_username] || {};

export default {
  namespaced: true,

  state: {
    loading: false,
    userName: wallet_username,
    account: {},
    keyStore: keyStore,
    userMap: JSON.parse(wallet_users),
    balance: [],
    tokenMap: {}
  },

  getters: {},

  mutations: {
    setLoading: function(state, loading) {
      state.loading = loading;
    },
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
    resetUserMap: function(state, userMap) {
      state.userMap = userMap;
    },
    setBalance: function(state, balance) {
      state.balance = balance;
    },
    setTokenMap: function(state, data) {
      state.tokenMap = Object.assign({}, state.tokenMap, data);
    }
  },

  actions: {
    create: async function(context, { name, pass }) {
      // reject if name exist
      if (context.state.userMap[name]) {
        return Promise.resolve(false);
      }
      // create account
      const account = webc.account.create();
      context.commit('setUserName', name);
      context.commit('setAccount', account);
      // generate keyStore with password
      context.dispatch('generateKeyStore', pass);

      return Promise.resolve(true);
    },
    generateKeyStore: function(context, pass) {
      const keyStore = webc.account.toV3KeyStore(context.state.account.privateKey, pass);
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
        const account = webc.account.recover(phrase);
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
      const account = webc.account.fromV3KeyStore(key, pass);
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
    change: async function(context, name) {
      const { userMap } = context.state;
      context.commit('setUserName', name);
      context.commit('setKeyStore', userMap[name] || {});
      localStorage.setItem('gard_wallet_username', name);
      return Promise.resolve(name);
    },
    editName: async function(context, { user, name }) {
      const { userMap, userName } = context.state;
      const userMapNew = { ...userMap };
      userMapNew[name] = userMapNew[user];
      delete userMapNew[user];
      context.commit('resetUserMap', userMapNew);
      // save change to localStorage
      localStorage.setItem('gard_wallet_users', JSON.stringify(context.state.userMap));

      // change currentUser
      if (userName === user) {
        await context.dispatch('change', name);
      }
      return Promise.resolve(name);
    },
    backup: async function(context, { user, pass }) {
      const { userMap } = context.state;
      const keyStore = userMap[user];
      const account = webc.account.fromV3KeyStore(keyStore, pass);
      return Promise.resolve(JSON.stringify(keyStore));
    },
    delete: async function(context, { user, pass }) {
      const { userMap, userName } = context.state;
      const keyStore = userMap[user];
      const account = webc.account.fromV3KeyStore(keyStore, pass);
      const userMapNew = { ...userMap };
      delete userMapNew[user];
      context.commit('resetUserMap', userMapNew);
      // save change to localStorage
      localStorage.setItem('gard_wallet_users', JSON.stringify(context.state.userMap));

      // change currentUser if delete currentUser
      if (userName === user) {
        await context.dispatch('change', Object.keys(userMap)[0]);
      }
      return Promise.resolve(account);
    },
    fetchBalance: async function(context) {
      const { address } = context.state.keyStore;
      context.commit('setLoading', true);
      const { data } = await ajax.get(`bank/balances/${address}`);
      if (!isEmpty(data)) {
        data.sort(i => (i.denom === 'gard' ? -1 : 1));
        context.commit('setBalance', data);
        data.forEach(i => {
          if (i.denom.match(/^coin.{10}$/)) {
            context.dispatch('fetchTokenDetail', i.denom);
          }
        });
      } else {
        context.commit('setBalance', []);
      }
      context.commit('setLoading', false);
      return Promise.resolve(data);
    },
    fetchTokenDetail: async function(context, id) {
      // check if existed;
      if (!isEmpty(context.state.tokenMap[id])) {
        return Promise.resolve();
      }
      context.commit('setLoading', true);
      const { data } = await ajax.get(`/issue/query/${id}`);
      context.commit('setLoading', false);
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setTokenMap', { [id]: data.value });
      return Promise.resolve(data);
    }
  }
};
