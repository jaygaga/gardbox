import BigNumber from 'bignumber.js';
import { get, isEmpty } from 'lodash';
import Codec from '@/utils/webc/util/codec';
import webc from '@/utils/webc.js';
import ajax from '@/utils/ajax.js';

import gardLogo from '@/assets/gard-logo.svg';

export const getViewToken = (coin, tokenMap) => {
  const token = { ...coin }
  if (isEmpty(token)) {
    return {}
  }
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

export const getStringLength = val => {
  const str = new String(val);
  let bytesCount = 0;
  for (let i = 0, n = str.length; i < n; i++) {
    let c = str.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      bytesCount += 1;
    } else {
      bytesCount += 2;
    }
  }
  return bytesCount;
};

export const sendTx = async function(context, pass, type, msg, msgs) {
  const {
    account: { keyStore, mathAccount },
    transactions: { nodeInfo }
  } = context.rootState;
  const from = context.rootGetters['account/currentAddress'];
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
    return Promise.resolve({ data: 'netError' });
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
      const signature = {
        pub_key: Codec.Hex.hexToBytes(signatureHex.publicKey),
        signature: Codec.Hex.hexToBytes(signatureHex.signature)
      };
      stdTx.SetSignature(signature);
      req = stdTx.GetData();
    } catch (e) {
      console.log(e);
      if (e.code === 1000010 || e.code === 100003) {
        return Promise.resolve({ data: 'reject' });
      }
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
    stdTx.SetSignature(signature);
    req = stdTx.GetData();
  }
  // 3. post to lcd api
  const res = await ajax.post(`/txs`, req);
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
