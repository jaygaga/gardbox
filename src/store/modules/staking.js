import webc from '@/utils/webc';
import { isEmpty, get } from 'lodash';
import ajax from '@/utils/ajax.js';

export default {
  namespaced: true,

  state: {
    delegations: [],
    validators: [],
    validatorMap: {},
    toValidator: {},
    fromValidator: {},
    form: {},
    unbindings: [],
    unbindingMap: {}
  },

  getters: {},

  mutations: {
    setDelegations: function(state, data) {
      state.delegations = data;
    },
    setValidators: function(state, data) {
      state.validators = data;
    },
    setValidatorMap: function(state, data) {
      state.validatorMap = data;
    },
    setToValidator: function(state, data) {
      state.toValidator = data;
    },
    setFromValidator: function(state, data) {
      state.fromValidator = data;
    },
    setForm: function(state, data) {
      state.form = data;
    },
    setUnbindings: function(state, data) {
      state.unbindings = data;
    },
    setValidatorMap: function(state, data) {
      state.validatorMap = Object.assign({}, state.validatorMap, data);
    },
    setUnbindingMap: function(state, data) {
      state.unbindingMap = Object.assign({}, state.unbindingMap, data);
    }
  },

  actions: {
    fetchDelegations: async function(context, address) {
      const { data } = await ajax.get(`/staking/delegators/${address}/delegations`);
      if (!isEmpty(data)) {
        context.commit('setDelegations', data);
      }
      return Promise.resolve(data);
    },
    fetchValidators: async function(context) {
      const { data } = await ajax.get('/staking/validators');
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setValidators', data.sort((a, b) => b.tokens - a.tokens));
      const validatorMap = {};
      data.forEach(v => {
        validatorMap[v.operator_address] = v;
      });
      context.commit('setValidatorMap', validatorMap);
      return Promise.resolve(data);
    },
    setToValidator: async function(context, validator) {
      context.commit('setToValidator', validator);
      return Promise.resolve();
    },
    setFromValidator: async function(context, validator) {
      context.commit('setFromValidator', validator);
      return Promise.resolve();
    },
    setForm: async function(context, form) {
      context.commit('setForm', form);
      return Promise.resolve();
    },
    delegate: async function(context, { pass }) {
      console.log(pass);
      const {
        account: { keyStore },
        transactions: { nodeInfo }
      } = context.rootState;
      const from = keyStore.address;
      // 1. get account state (account_number & sequence)
      let accState = {
        account_number: '0',
        sequence: '0'
      };
      try {
        const { data } = await ajax.get(`/auth/accounts/${from}`);
        accState = data.value;
      } catch (e) {
        console.log(e);
      }
      // 2. get privateKey from keyStore
      let account = {};
      try {
        account = webc.account.fromV3KeyStore(keyStore, pass);
      } catch (e) {
        return Promise.resolve('passError');
      }
      // 3. build tx and sign
      const denom = 'gard';
      const {
        form: { amount },
        toValidator: { operator_address }
      } = context.state;
      const para = {
        chain_id: nodeInfo.network,
        from,
        account_number: accState.account_number,
        sequence: accState.sequence,
        memo: '',
        fees: { denom, amount: '0' },
        gas: 200000,
        type: 'delegate',
        msg: {
          validator_addr: operator_address,
          delegation: {
            denom,
            amount
          }
        }
      };
      const req = webc.tx.buildAndSignTx(para, account.privateKey).GetData();
      // 4. post to lcd api
      const res = await ajax.post(`/txs`, req);
      // 5. get block info when tx success
      if (res.data) {
        const blockData = await context.dispatch('fetchBlock', res.data.height, { root: true });
        res.data.block = blockData.block;
      }
      return Promise.resolve(res.data);
    }
  }
};
