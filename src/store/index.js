import account from './modules/account.js';
import recover from './modules/recover.js';
import transactions from './modules/transactions.js';
import staking from './modules/staking.js';
import issue from './modules/issue.js';

import basic from './modules/basic.js';
import lock from './modules/lock.js'

export default {
  modules: {
    account,
    recover,
    transactions,
    staking,
    issue,
    basic,
    lock
  }
};