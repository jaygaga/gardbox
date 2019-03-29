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
    nodeInfo: {},
    userName: wallet_username,
    account: {},
    keyStore: keyStore,
    userMap: JSON.parse(wallet_users),
    balance: '0',
    txs: [],
    blocks: {}
  },

  getters: {},

  mutations: {
    setNodeInfo: function(state, nodeInfo) {
      state.nodeInfo = nodeInfo;
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
    setBalance: function(state, balance) {
      state.balance = balance;
    },
    setTxList: function(state, txs) {
      state.txs = txs;
    },
    setBlocks: function(state, data) {
      state.blocks = Object.assign({}, data, state.blocks);
    }
  },

  actions: {
    getNodeInfo: async function(context) {
      const { data } = await ajax.get('/api/node_info');
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setNodeInfo', data);
      return Promise.resolve();
    },
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
        const account = webc.account.fromV3KeyStore(key, pass);
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
    fetchBalance: async function(context) {
      const { address } = context.state.keyStore;
      const { data } = await ajax.get(`api/bank/balances/${address}`);
      if (!isEmpty(data)) {
        context.commit('setBalance', data[0].amount);
      }
      return Promise.resolve(data);
    },
    fetchTxsTotalCount: async function(context, params) {
      const { data } = await ajax.get('/api/txs', { params });
      if (isEmpty(data)) {
        return Promise.resolve();
      }
      return Promise.resolve(data);
    },
    fetchTxsLatest: async function(context, params) {
      // 1. query txs as sender
      // 1.1. first query to get total count
      const sendData1 = await context.dispatch('fetchTxsTotalCount', params);
      if (!isEmpty(sendData1)) {
        if (sendData1.totalCount > params.limit) {
          // 1.2 query last page
          const lastPage = Math.ceil(sendData1.totalCount / params.limit) || 1;
          const sendData = await context.dispatch('fetchTxsTotalCount', { ...params, page: lastPage });
          return Promise.resolve(sendData.txs);
        }
        // 1.2 else use data of first query
        return Promise.resolve(sendData1.txs);
      }
      return Promise.resolve([]);
    },
    fetchTxs: async function(context) {
      const limit = 10;
      const { address } = context.state.keyStore;
      const params = {
        limit,
        action: 'send',
        sender: address
      };

      // 1. query txs as sender
      const sendList = await context.dispatch('fetchTxsLatest', params);
      console.log(sendList);
      // 2. query txs as recipient
      params.recipient = params.sender;
      delete params.sender;
      const receiveList = await context.dispatch('fetchTxsLatest', params);
      console.log(receiveList);

      // show action as receive
      const receiveListMaped = receiveList.map(i => {
        set(i, 'tags.0.value', 'receive');
        return i;
      });
      const list = [...sendList, ...receiveListMaped];
      list.sort((a, b) => b.height - a.height);
      context.commit('setTxList', list);
      return Promise.resolve(list);
    },
    fetchBlock: async function(context, height) {
      if (!isEmpty(context.state.blocks[height])) {
        return Promise.resolve(context.state.blocks[height]);
      }
      const { data } = await ajax.get(`/api/blocks/${height}`);
      if (!isEmpty(data)) {
        context.commit('setBlocks', { [height]: data });
        return Promise.resolve(data);
      }
    },
    send: async function(context, { amount, address, memo }) {
      const isValidAddress = webc.account.isValidAddress(address);
      const from = context.state.keyStore.address;
      // 1. get account state (account_number & sequence)
      const { data } = await ajax.get(`api/auth/accounts/${from}`);
      // 2. get privateKey from keyStore
      const account = webc.account.fromV3KeyStore(context.state.keyStore, 'a111111');
      // 3. build tx and sign
      const para = {
        chain_id: context.state.nodeInfo.network,
        from,
        account_number: data.value.account_number,
        sequence: data.value.sequence,
        memo,
        fees: { denom: 'gard', amount: '0' },
        gas: 200000,
        type: 'transfer',
        msg: {
          to: address,
          coins: [
            {
              denom: 'gard',
              amount: amount
            }
          ]
        }
      };
      const req = webc.tx.buildAndSignTx(para, account.privateKey).GetData();
      // 4. post to lcd api
      const res = await ajax.post(`api/tx/broadcast`, req);
      console.log(res);
      return Promise.resolve(res);
    }
  }
};
