import BigNumber from 'bignumber.js';
import { isEmpty } from 'lodash';
import webc from '@/utils/webc';
import ajax from '@/utils/ajax.js';

import gardLogo from '@/assets/gard-logo.svg';

export const getViewToken = (coin, tokenMap) => {
  const token = { ...coin };
  if (token.denom.match(/^coin.{10}$/)) {
    const detail = tokenMap[token.denom];
    if (!isEmpty(detail)) {
      token.denom = detail.symbol;
      token.amount = BigNumber(token.amount).dividedBy(Math.pow(10, detail.decimals));
      if (detail.description) {
        try {
          const desc = JSON.parse(detail.description);
          token.img = desc.logo;
        } catch (e) {
          console.log(e);
        }
      }
    }
  } else {
    if (token.denom === 'gard') {
      token.img = gardLogo;
    }
    token.denom = token.denom.toUpperCase();
  }
  return token;
};

export const sendTx = async function(context, pass, type, msg, msgs) {
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
  const para = {
    chain_id: nodeInfo.network,
    from,
    account_number: accState.account_number,
    sequence: accState.sequence,
    memo: '',
    fees: { denom: 'gard', amount: '0' },
    gas: 200000,
    type,
    msg,
    msgs
  };
  const req = webc.tx.buildAndSignTx(para, account.privateKey).GetData();
  // 4. post to lcd api
  const res = await ajax.post(`/txs`, req);
  // 5. get block info when tx success
  if (res.data) {
    const blockData = await context.dispatch('transactions/fetchBlock', res.data.height, { root: true });
    res.data.block = blockData.block;
  }
  return Promise.resolve(res);
};
