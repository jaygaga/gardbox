import webc from '@/utils/webc';
import ajax from '@/utils/ajax.js';
import { get, set, isEmpty } from 'lodash';
import { getCurrentAddress, sendTx } from '@/utils/helpers';

export default {
  namespaced: true,

  state: {
    loading: false,
    nodeInfo: {},
    txs: [],
    txInfo: {},
    form: {
      denom: 'agard',
      fee: 0
    },
    result: {}
  },

  getters: {},

  mutations: {
    setLoading: function(state, loading) {
      state.loading = loading;
    },
    setNodeInfo: function(state, nodeInfo) {
      state.nodeInfo = nodeInfo;
    },
    setTxList: function(state, txs) {
      state.txs = txs;
    },
    setTxInfo: function(state, txInfo) {
      state.txInfo = Object.assign({}, txInfo, state.txInfo);
    },
    setForm: function(state, form) {
      state.form = form;
    },
    setResult: function(state, result) {
      state.result = result;
    }
  },

  actions: {
    getNodeInfo: async function(context) {
      const { data } = await ajax.get('/node_info');
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setNodeInfo', data);
      return Promise.resolve();
    },
    fetchTxsTotalCount: async function(context, params) {
      const { data } = await ajax.get('/txs', { params });
      if (isEmpty(data)) {
        return Promise.resolve();
      }
      return Promise.resolve(data);
    },
    fetchTxsLatest: async function(context, params) {
      let txs = [];
      // 1. first query to get total count
      const sendData1 = await context.dispatch('fetchTxsTotalCount', params);
      if (!isEmpty(sendData1)) {
        if (sendData1.totalCount > params.limit) {
          // 2. query last page
          const lastPage = Math.ceil(sendData1.totalCount / params.limit) || 1;
          const sendData = await context.dispatch('fetchTxsTotalCount', { ...params, page: lastPage });
          txs = sendData.txs;
        } else {
          // 3. else use data of first query
          txs = sendData1.txs;
        }
      }
      return Promise.resolve(txs);
    },
    fetchTxs: async function(context, keyStore) {
      const limit = 10;
      const address = getCurrentAddress(context.rootState.account);
      const params = {
        limit,
        action: 'send',
        sender: address
      };
      context.commit('setLoading', true);

      // 1. query txs as sender
      const sendList = await context.dispatch('fetchTxsLatest', params);

      // 2. query txs as recipient
      params.recipient = params.sender;
      delete params.sender;
      const receiveList = await context.dispatch('fetchTxsLatest', params);

      // show action as receive
      const receiveListMaped = receiveList.map(i => {
        set(i, 'tags.0.value', 'receive');
        return i;
      });
      const list = [...sendList, ...receiveListMaped];
      list.sort((a, b) => b.height - a.height);
      context.commit('setTxList', list);
      context.commit('setLoading', false);
      return Promise.resolve(list);
    },
    fetchTxInfo: async function(context, txhash) {
      if (!isEmpty(context.state.txInfo[txhash])) {
        return Promise.resolve(context.state.txInfo[txhash]);
      }
      const { data } = await ajax.get(`/txs/${txhash}`);
      if (!isEmpty(data)) {
        context.commit('setTxInfo', { [txhash]: data });
      }
      return Promise.resolve(data);
    },
    input: async function(context, form) {
      context.commit('setForm', form);
      return Promise.resolve(form);
    },
    result: async function(context, result) {
      context.commit('setResult', result);
      return Promise.resolve(result);
    },
    send: async function(context, { pass, amount }) {
      const {
        form: { denom, address }
      } = context.state;
      const msg = {
        to: address,
        coins: [{ denom, amount }]
      };

      const { data } = await sendTx(context, pass, 'transfer', msg);
      return Promise.resolve(data);
    }
  }
};
