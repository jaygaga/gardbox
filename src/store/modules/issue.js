import BigNumber from 'bignumber.js';
import { isEmpty, get } from 'lodash';
import Base64 from 'base64-node';
import ajax from '@/utils/ajax.js';
import { sendTx } from '@/utils/helpers';

export default {
  namespaced: true,

  state: {
    tokens: [],
    tokenMap: {},
    txs: []
  },

  getters: {},

  mutations: {
    setTokens: function(state, data) {
      state.tokens = data;
    },
    setTokenMap: function(state, data) {
      state.tokenMap = Object.assign({}, state.delegationMap, data);
    },
    setTxList: function(state, txs) {
      state.txs = txs;
    }
  },

  actions: {
    fetchTokens: async function(context) {
      const address = context.rootGetters['account/currentAddress'];
      const { data } = await ajax.get(`/issue/list?address=${address}`);
      if (!isEmpty(data)) {
        context.commit('setTokens', data);
        data.forEach(i => {
          context.commit('setTokenMap', { [i.validator_address]: i });
        });
      }
      return Promise.resolve(data);
    },
    fetchToken: async function(context, id) {
      const { data } = await ajax.get(`/issue/query/${id}`);
      if (!isEmpty(data)) {
        context.commit('setTokenMap', { [id]: data.value });
      }
      return Promise.resolve(data);
    },
    create: async function(context, { pass, form, describe }) {
      const address = context.rootGetters['account/currentAddress'];
      const description = {};
      Object.keys(describe).forEach(k => {
        if (describe[k]) description[k] = describe[k];
      });
      const msg = {
        type: 'issue/MsgIssue',
        CoinIssueInfo: {
          issue_id: '',
          issuer: address,
          owner: address,
          issue_time: '0',
          name: form.name,
          symbol: form.symbol,
          total_supply: BigNumber(form.amount)
            .times(BigNumber(10).pow(form.decimals))
            .toFixed(),
          decimals: form.decimals,
          description: isEmpty(description) ? '' : JSON.stringify(description),
          burn_owner_disabled: !form.burn,
          burn_holder_disabled: !form.burnHolder,
          burn_from_disabled: !form.burnAny,
          freeze_disabled: !form.freeze,
          minting_finished: !form.mint
        }
      };
      const { data } = await sendTx(context, pass, 'issue', msg);
      return Promise.resolve(data);
    },
    modify: async function(context, { pass, describe, id }) {
      const address = context.rootGetters['account/currentAddress'];
      const description = {};
      Object.keys(describe).forEach(k => {
        if (describe[k]) description[k] = describe[k];
      });
      const msg = {
        type: 'issue/MsgIssueDescription',
        issue_id: id,
        sender: address,
        description: isEmpty(description) ? '' : Base64.encode(JSON.stringify(description))
      };
      const { data } = await sendTx(context, pass, 'issue', msg);
      return Promise.resolve(data);
    },
    setting: async function(context, { pass, setting, id }) {
      const address = context.rootGetters['account/currentAddress'];
      const msg = {
        type: 'issue/MsgIssueDisableFeature',
        issue_id: id,
        sender: address,
        feature: setting
      };
      const { data } = await sendTx(context, pass, 'issue', msg);
      return Promise.resolve(data);
    },
    mint: async function(context, { pass, form, id, action }) {
      const address = context.rootGetters['account/currentAddress'];
      const { decimals } = context.state.tokenMap[id];
      const msg = {
        type: 'issue/MsgIssueMint',
        issue_id: id,
        sender: address,
        to: form.address,
        amount: BigNumber(form.amount)
          .times(BigNumber(10).pow(decimals))
          .toFixed(),
        decimals
      };
      if (action === 'burn') {
        delete msg.to;
        delete msg.decimals;
        if (form.address === address) {
          msg.type = 'issue/MsgIssueBurnOwner';
        } else {
          msg.type = 'issue/MsgIssueBurnFrom';
          msg.holder = form.address;
        }
      }
      const { data } = await sendTx(context, pass, 'issue', msg);
      return Promise.resolve(data);
    },
    fetchTxs: async function(context, { id, actions }) {
      const limit = 10;
      const address = context.rootGetters['account/currentAddress'];
      let list = [];
      const results = await Promise.all(
        actions.map(action => {
          const params = {
            limit,
            action,
            'issue-id': id,
            sender: address
          };
          return context.dispatch('transactions/fetchTxsLatest', params, { root: true });
        })
      );
      results.forEach(res => {
        list = list.concat(res);
      });
      list.sort((a, b) => b.height - a.height);
      context.commit('setTxList', list);
      return Promise.resolve(list);
    }
  }
};
