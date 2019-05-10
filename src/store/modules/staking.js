import webc from '@/utils/webc';
import { isEmpty, get } from 'lodash';
import ajax from '@/utils/ajax.js';
import { sendTx } from '@/utils/helpers';

export default {
  namespaced: true,

  state: {
    delegations: [],
    delegationMap: {},
    rewards: [],
    rewardMap: {},
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
    setDelegationMap: function(state, data) {
      state.delegationMap = Object.assign({}, state.delegationMap, data);
    },
    setRewards: function(state, data) {
      state.rewards = data;
    },
    setRewardMap: function(state, data) {
      state.RewardMap = Object.assign({}, state.RewardMap, data);
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
    fetchDelegations: async function(context) {
      const { address } = context.rootState.account.keyStore;
      const { data } = await ajax.get(`/staking/delegators/${address}/delegations`);
      if (!isEmpty(data)) {
        context.commit('setDelegations', data);
      }
      return Promise.resolve(data);
    },
    fetchDelegation: async function(context, validator_addr) {
      const { address } = context.rootState.account.keyStore;
      const { data } = await ajax.get(`/staking/delegators/${address}/delegations/${validator_addr}`);
      if (!isEmpty(data)) {
        context.commit('setDelegationMap', { [validator_addr]: data });
      }
      return Promise.resolve(data);
    },
    fetchRewards: async function(context) {
      const { address } = context.rootState.account.keyStore;
      const { data } = await ajax.get(`/distribution/delegators/${address}/rewards`);
      if (!isEmpty(data)) {
        context.commit('setRewards', data);
      }
      return Promise.resolve(data);
    },
    fetchReward: async function(context, validator_addr) {
      const { address } = context.rootState.account.keyStore;
      const { data } = await ajax.get(`/distribution/delegators/${address}/rewards/${validator_addr}`);
      if (!isEmpty(data)) {
        context.commit('setRewardMap', { [validator_addr]: data });
      }
      return Promise.resolve(data);
    },
    fetchUnbindings: async function(context) {
      const { address } = context.rootState.account.keyStore;
      const { data } = await ajax.get(`/staking/delegators/${address}/unbonding_delegations`);
      if (!isEmpty(data)) {
        context.commit('setUnbindings', data);
      }
      return Promise.resolve(data);
    },
    fetchUnbinding: async function(context, validator_addr) {
      const { address } = context.rootState.account.keyStore;
      const { data } = await ajax.get(`/staking/delegators/${address}/unbonding_delegations/${validator_addr}`);
      if (!isEmpty(data)) {
        context.commit('setUnbindingMap', { [validator_addr]: data });
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
      const {
        form: { amount },
        toValidator: { operator_address }
      } = context.state;
      const msg = {
        validator_addr: operator_address,
        delegation: {
          denom: 'gard',
          amount
        }
      };
      const { data } = await sendTx(context, pass, 'delegate', msg);
      return Promise.resolve(data);
    },
    withdrawAll: async function(context, { pass }) {
      const msgs = context.state.delegations.map(i => {
        return { validator_addr: i.validator_address };
      });
      const { data } = await sendTx(context, pass, 'withdraw_delegation_rewards_all', {}, msgs);
      return Promise.resolve(data);
    }
  }
};
