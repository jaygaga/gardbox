import BigNumber from 'bignumber.js';
import { get, isEmpty } from 'lodash';
import Codec from '@/utils/webc/util/codec';
import webc from '@/utils/webc';
import ajax from '@/utils/ajax.js';

import gardLogo from '@/assets/gard-logo.svg';

export const getViewToken = (coin, tokenMap) => {
  const token = { ...coin };
  if (token.denom.match(/^coin.{10}$/)) {
    const detail = tokenMap[token.denom];
    if (!isEmpty(detail)) {
      token.denom = detail.symbol;
      token.amount = BigNumber(token.amount)
        .dividedBy(Math.pow(10, detail.decimals))
        .toFixed();
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
    if (token.denom === 'agard') {
      token.amount = BigNumber(token.amount)
        .dividedBy(BigNumber(10).pow(18))
        .toFixed();
      token.img = gardLogo;
      token.denom = 'GARD';
    } else {
      token.denom = token.denom.toUpperCase();
    }
  }
  return token;
};

export const getCurrentAddress = ({ mathAccount, keyStore }) => {
  if (!isEmpty(mathAccount)) {
    return get(mathAccount, 'account');
  } else {
    return get(keyStore, 'address');
  }
};

export const sendTx = async function(context, pass, type, msg, msgs) {
  const {
    account: { keyStore, mathAccount },
    transactions: { nodeInfo }
  } = context.rootState;
  let from = '';
  if (!isEmpty(mathAccount)) {
    from = mathAccount.account;
  } else {
    from = keyStore.address;
  }
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
  // 2. build cosmos stdTx
  const para = getTxPara(from, type, accState, nodeInfo, msg, msgs);
  const stdTx = webc.tx.buildTx(para);
  // 3. sign tx
  let req = {};
  if (!isEmpty(mathAccount)) {
    // 3.1. sign with math wallet
    await context.dispatch('account/getMathIdentity', null, { root: true });
    try {
      const signatureHex = await window.mathExtension.getArbitrarySignature(from, stdTx.GetSignBytes(), type);
      console.log(signatureHex);
      const signature = {
        pub_key: Codec.Hex.hexToBytes('publicKey'),
        signature: Codec.Hex.hexToBytes(signatureHex)
      };
      console.log(signature);
      stdTx.SetSignature(signature);
      req = stdTx.GetData();
      console.log(req);
    } catch (e) {
      console.log(e);
      return Promise.resolve('passError');
    }
  } else {
    // 3.1. get privateKey from keyStore
    let account = {};
    try {
      account = webc.account.fromV3KeyStore(keyStore, pass);
    } catch (e) {
      return Promise.resolve({ data: 'passError' });
    }
    // 3.2. sign with local wallet
    const signature = webc.tx.sign(stdTx.GetSignBytes(), account.privateKey);
    console.log(signature);
    stdTx.SetSignature(signature);
    req = stdTx.GetData();
    console.log(req);
  }
  // 3. post to lcd api
  const res = await ajax.post(`/txs`, req);
  // 4. get block info when tx success
  if (res.data) {
    const blockData = await context.dispatch('transactions/fetchBlock', res.data.height, { root: true });
    res.data.block = blockData.block;
  }
  return Promise.resolve(res);
};
const getTxPara = (from, type, accState, nodeInfo, msg, msgs) => {
  return {
    chain_id: nodeInfo.network,
    from,
    account_number: accState.account_number,
    sequence: accState.sequence,
    memo: '',
    fees: { denom: 'agard', amount: '0' },
    gas: 200000,
    type,
    msg,
    msgs
  };
};
