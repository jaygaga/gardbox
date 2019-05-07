import BigNumber from 'bignumber.js';
import { isEmpty } from 'lodash';

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
