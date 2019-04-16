import webc from '@/utils/webc';
import ajax from '@/utils/ajax.js';
import { get, set, isEmpty } from 'lodash';

export default {
  namespaced: true,

  state: {
    nodeInfo: {},
    txs: [],
    blocks: {},
    txInfo: {},
    form: {},
    result: {}
  },

  getters: {},

  mutations: {
    setNodeInfo: function(state, nodeInfo) {
      state.nodeInfo = nodeInfo;
    },
    setTxList: function(state, txs) {
      state.txs = txs;
    },
    setBlocks: function(state, data) {
      state.blocks = Object.assign({}, data, state.blocks);
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
      const { data } = await ajax.get('/api/node_info');
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setNodeInfo', data);
      return Promise.resolve();
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
    fetchTxs: async function(context, keyStore) {
      const limit = 10;
      const { address } = keyStore;
      const params = {
        limit,
        action: 'send',
        sender: address
      };

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
      return Promise.resolve(list);
    },
    fetchBlock: async function(context, height) {
      if (!isEmpty(context.state.blocks[height])) {
        return Promise.resolve(context.state.blocks[height]);
      }
      const { data } = await ajax.get(`/api/blocks/${height}`);
      if (!isEmpty(data)) {
        context.commit('setBlocks', { [height]: data });
      }
      return Promise.resolve(data);
    },
    fetchTxInfo: async function(context, txhash) {
      if (!isEmpty(context.state.txInfo[txhash])) {
        return Promise.resolve(context.state.txInfo[txhash]);
      }
      const { data } = await ajax.get(`/api/txs/${txhash}`);
      if (!isEmpty(data)) {
        context.commit('setTxInfo', { [txhash]: data });
        if (!context.state.blocks[data.height]) {
          context.dispatch('fetchBlock', data.height);
        }
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
    send: async function(context, { amount, address, memo, pass, keyStore }) {
      const isValidAddress = webc.account.isValidAddress(address);
      const from = keyStore.address;
      // 1. get account state (account_number & sequence)
      const { data } = await ajax.get(`api/auth/accounts/${from}`);
      // 2. get privateKey from keyStore
      const account = webc.account.fromV3KeyStore(keyStore, pass);
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
      // 5. get block info when tx success
      if (res.data) {
        const blockData = await context.dispatch('fetchBlock', res.data.height);
        res.data.block = blockData.block;
      }
      return Promise.resolve(res.data);
    }
  }
};