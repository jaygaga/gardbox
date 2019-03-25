import { Message } from 'element-ui';

import webc from '@/utils/webc';

const wallet_users = localStorage.getItem('gard_wallet_users') || {};

export default {
  namespaced: true,

  state: {
    userName: '',
    account: {},
    keyStore: {},
    userMap: JSON.parse(wallet_users)
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
      console.log(pass);
      const keyStore = webc.toV3KeyStore(account.privateKey, pass);
      context.commit('setKeyStore', keyStore);
      console.log(keyStore);

      return Promise.resolve(true);
    },
    finishCreate: async function(context) {
      context.commit('setUserMap', { [context.state.userName]: context.state.keyStore });
      // save keyStore to localStorage
      localStorage.setItem('gard_wallet_users', JSON.stringify(context.state.userMap));
      // clear account mnemonic
      context.commit('setAccount', {});
      return Promise.resolve(true);
    },
    recover: function(context, address) {
      context.commit('setInfo', {});
      return Promise.resolve();
    },
    login: async function(context, { name, pass }) {
      const { userMap } = context.state;
      try {
        const account = webc.fromV3KeyStore(userMap[name], pass);
        context.commit('setUserName', name);
        context.commit('setKeyStore', userMap[name]);
        // context.commit('setKeyStore', keyStore);
        return Promise.resolve(account);
      } catch (e) {
        return Promise.resolve();
      }
    },
    logout: function(context) {
      context.commit('setUserName', '');
      context.commit('setKeyStore', {});
      return Promise.resolve();
    }
  }
};
