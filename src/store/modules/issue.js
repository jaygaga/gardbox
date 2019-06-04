import BigNumber from 'bignumber.js';
import { isEmpty, get } from 'lodash';
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
      // const address = getCurrentAddress(context.rootState.account);
      const address = 'gard1766cdjeumc0nzqnk6tt9l80n2fslm05pz40jld';
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
      const { data } = await ajax.get(`/issue/${id}`);
      if (!isEmpty(data)) {
        context.commit('setTokenMap', { [id]: data });
      }
      return Promise.resolve(data);
    },
    setForm: async function(context, form) {
      context.commit('setForm', form);
      return Promise.resolve();
    },
    create: async function(context, { pass, form }) {
      const address = getCurrentAddress(context.rootState.account);
      const describ = {
        organization: form.organization,
        website: form.website,
        logo: form.logo,
        description: form.description
      };
      const msg = {
        CoinIssueInfo: {
          issuer: address,
          owner: address,
          name: form.name,
          symbol: form.symbol,
          total_supply: BigNumber(form.amount)
            .times(BigNumber(10).pow(form.decimals))
            .toFixed(),
          decimals: form.decimals,
          description: JSON.stringify(describ),
          burn_owner_disabled: !form.burn,
          burn_holder_disabled: !form.burnHolder,
          burn_from_disabled: !form.burnAny,
          freeze_disabled: !form.freeze,
          minting_finished: !form.mint
        }
      };

      const { data } = await sendTx(context, pass, 'issue', msg);
      return Promise.resolve(data);
    }
  }
};
