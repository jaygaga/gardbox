export default {
  namespaced: true,

  state: {
    form: {},
    result: {}
  },

  getters: {},

  mutations: {
    setForm: function(state, form) {
      state.form = form;
    },
    setResult: function(state, result) {
      state.result = result;
    }
  },

  actions: {
    input: async function(context, form) {
      context.commit('setForm', form);
      return Promise.resolve(form);
    },
    result: async function(context, result) {
      context.commit('setResult', result);
      return Promise.resolve(result);
    }
  }
};
