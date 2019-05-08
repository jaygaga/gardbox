import { isEmpty, get } from 'lodash';
import ajax from '@/utils/ajax.js';

export default {
  namespaced: true,

  state: {
    delegations: [],
    validators: [],
    toValidator: {},
    fromValidator: {},
    form: {},
    validatorMap: {},
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
        // context.commit('setDelegations', data);
      }
      console.log(data);
      return Promise.resolve(data);
    },
    fetchValidators: async function(context) {
      const { data } = await ajax.get('/staking/validators');
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setValidators', data.sort((a, b) => b.tokens - a.tokens));
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
    }
  }
};
