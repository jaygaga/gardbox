import {
  isEmpty,
  get
} from 'lodash';
import ajax from '@/utils/ajax.js';
import {
  sendTx
} from '@/utils/helpers';
import {
  getViewToken
} from "@/utils/helpers";
export default {
  namespaced: true,
  state: {
    lock: null,
    lockList: []
  },
  getters: {},
  mutations: {
    setLock: function (state, lock) {
      state.lock = lock
    },
    setLockList: function (state, data) {
      state.lockList = data
    }
  },
  actions: {
    setLockResult: async function (context, result) {
      context.commit('setLock', result);
      return Promise.resolve(result);
    },
    creatLock: async function (context, form) {
      const address = context.rootGetters['account/currentAddress'];
      const msg = {
        type: 'box/MsgLockBox',
        sender: address,
        params: {
          name: form.name,
          total_amount: {
            token: {
              denom: form.denom,
              amount: form.total_amount
            },
            decimals: form.decimals
          },
          description: '',
          lock: {
            end_time: form.end_time.toString().substring(0, 10)
          }
        }
      };
      const {
        data
      } = await sendTx(context, form.pass, 'hg-custom', msg);
      return Promise.resolve(data);
    },
    getLockList: async function (context) {
      const address = context.rootGetters['account/currentAddress'];
      const limit = 100
      const res = await ajax.get(`/lock/list?address=${address}&limit=${limit}`)
      context.commit('setLockList', res.data)
      return Promise.resolve(res.data);
    },
    getLockDetail: async function (context, id) {
      const res = await ajax.get(`/lock/query/${id}`)
      return Promise.resolve(res.data)
    }
  }
}