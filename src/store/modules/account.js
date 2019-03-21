import Irisnet from '@/utils/crypto';
const crypto = Irisnet.getCrypto('cosmos');

let userMap = {};
const wallet_users = localStorage.getItem('gard_wallet_users');
if (wallet_users) {
  userMap = JSON.parse(wallet_users);
}

export default {
  namespaced: true,

  state: {
    currentUser: ''
  },

  getters: {},

  mutations: {
    setCurrentUser: function(state, currentUser) {
      state.currentUser = currentUser;
    },
    setUserMap: function(state, userMap) {
      state.userMap = Object.assign({}, userMap, state.userMap);
    }
  },

  actions: {
    getUsers: function(context, name) {
      context.commit('setInfo', {});
      return Promise.resolve();
    },
    create: function(context, { name, pass }) {
      // create account
      const account = crypto.create();
      context.commit('setCurrentUser', name);

      // generate keyStore with password
      console.log(pass);
      const keyStore = crypto.toV3KeyStore(account.privateKey, pass);
      console.log(keyStore);

      // save keyStore to localStorage
      console.log(userMap);
      userMap = Object.assign({}, userMap, { [name]: keyStore });
      localStorage.setItem('gard_wallet_users', JSON.stringify(userMap));

      // const res = crypto.fromV3KeyStore(keyStore, pass);
      // console.log(res);

      return Promise.resolve();
    },
    recover: function(context, address) {
      context.commit('setInfo', {});
      return Promise.resolve();
    },
    login: function(context, address) {
      context.commit('setInfo', {});
      return Promise.resolve();
    }
  }
};
