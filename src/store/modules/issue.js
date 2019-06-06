import BigNumber from 'bignumber.js';
import { isEmpty, get } from 'lodash';
import Base64 from 'base64-node';
import ajax from '@/utils/ajax.js';
import { getCurrentAddress, sendTx } from '@/utils/helpers';

export default {
  namespaced: true,

  state: {
    tokens: [],
    tokenMap: {},
    form: {}
  },

  getters: {},

  mutations: {
    setTokens: function(state, data) {
      state.tokens = data;
    },
    setTokenMap: function(state, data) {
      state.tokenMap = Object.assign({}, state.delegationMap, data);
    },
    setForm: function(state, data) {
      state.form = data;
    }
  },

  actions: {
    fetchTokens: async function(context) {
      const address = getCurrentAddress(context.rootState.account);
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
    setForm: async function(context, form) {
      context.commit('setForm', form);
      return Promise.resolve();
    },
    create: async function(context, { pass, form, describe }) {
      const address = getCurrentAddress(context.rootState.account);
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
      const address = getCurrentAddress(context.rootState.account);
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
    }
  }
};
