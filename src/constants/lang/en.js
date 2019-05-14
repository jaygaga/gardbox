const en = {
  global: {
    app: 'GardBox',
    next: 'Next',
    back: 'Back',
    confirm: 'Confirm',
    finish: 'Finish',
    ok: 'Ok',
    cancel: 'Cancel',
    error: 'Error',
    required: '{name} is required',
    success: '{name} Success!'
  },
  home: {
    title: 'Welcome to GARDBOX',
    banner: 'GARDBOX is a web wallet for Hashgard Blockchain.',
    itemTitle1: 'Anywhere, anytime',
    itemText1: 'GARDBOX is mobile friendly, so you can access it everywhere you go. The web-version works on desktop and mobile browsers.',
    itemTitle2: 'The power of privacy',
    itemText2: 'All user data, including imported or generated private keys are stored locally and private.',
    itemTitle3: 'Easy to use, Reliable',
    itemText3: 'Made by Hashgard official team. We’ve done the complicated stuff so you won’t have to.',
    account: 'Account'
  },
  agree: {
    title: 'Terms & Conditions',
    term1:
      'I understand that my funds are stored securely on my personal computer. No private data is sent to Hashgard servers. All encryption is done locally in browser.',
    term2:
      'I consent that Hashgard does not have access to my private information and could not participate in resolution of issues concerning money loss of any kind.',
    term3: 'I have read and accepted the ',
    use: 'Terms of Use',
    and: 'and',
    privacy: 'Privacy Policy',
    termUrl: 'http://hashgard-io.oss-cn-hongkong.aliyuncs.com/terms/HashgardTermsofService.pdf',
    privacyUrl: 'http://hashgard-io.oss-cn-hongkong.aliyuncs.com/terms/GardBoxPrivacyPolicy.pdf',
    confirm: 'Confirm and Continue'
  },
  passport: {
    title: 'Create a new key pair or import an existing wallet to get started',
    banner:
      'GARDBOX is a free, open source web wallet. Users can use gard wallet to create or import wallet, and use gard token to complete a series of operations on Hashgard Blockchain.',
    create: 'Create New Wallet',
    createBreif: "Create a new wallet in this browser if you don't have one.",
    login: 'Wallet Switch',
    loginBreif: 'Use wallet with your password if you already have one in this browser.',
    logout: 'Log Out',
    backup: 'Export KeyStore',
    backupCopy: 'Copy KeyStore to clipboard',
    backupFile: 'download KeyStore file',
    edit: 'Edit Name',
    delete: 'Delete Wallet',
    deleteWarn:
      'All user data, including imported or generated private keys, will be deleted. The only way to restore a deleted wallet is to use your backup phrase.',
    recover: 'Import Wallet',
    recoverBreif: 'Recover your wallet in this browser if you already have one from other place.'
  },
  create: {
    warn1: 'Your password allows you to access and transfer your funds. Keep it safe!!!',
    warn2: 'GARDBOX does not store your password and cannot retrieve it for you!',
    name: 'Wallet Name',
    pass: 'Password',
    passCheck: 'Confirm Password',
    passWarn: 'Password must contain numbers and letters and at least 8 characters!',
    passCheckWarn: 'Inconsistent password!',
    exist: 'Account Name Exist!',
    mnemonic: 'Your Mnemonic',
    mnemonicWarn: 'Wrong Mnemonic!',
    safety: 'Backup Your Mnemonic',
    mnemonicBreif:
      'This is your secret recovery text. It is the only way to restore access to your funds. Keep it safe and never share it with anyone you don’t trust!',
    reset: 'Reset',
    confirm: 'Confirm your Mnemonic',
    backup: 'Create wallet success! you can backup your keyStore anytime in the settings menu.',
    success: 'Wallet Created Successfully!'
  },
  recover: {
    key: 'KeyStore Text',
    keyFile: 'KeyStore File',
    drag: 'Drag KeyStore file here, or ',
    click: 'click to upload',
    phrase: 'Mnemonic',
    keyError: 'Wrong KeyStore!'
  },
  main: {
    receive: 'Receive',
    qrcode: 'QRCode',
    send: 'Transfer',
    manage: 'Manage',
    copy: 'Copied to ClipBoard',
    assets: 'My Assets',
    txs: 'Transactions',
    txInfo: 'Transaction Detail',
    allTxs: 'Expolor All Txs',
    empty: 'No Data',
    keyWarn: 'KeyStore is an encrypted JSON file with your privateKey and password, you can get your privateKey with your password from it.'
  },
  send: {
    form: 'Transfer',
    confirm: 'Confirm Transaction',
    passError: 'Wrong Password!',
    finish: 'Transaction Result',
    denom: 'Currency',
    amount: 'Amount',
    amountWarn: 'Insufficient Quantity',
    amountWarnPositive: 'A Positive Number is required',
    amountWarnInvalid: 'Invalid Amount',
    address: 'Address',
    addressWarn: 'Wrong Address Format!',
    sender: 'Sender',
    txHash: 'TxHash',
    all: 'Send All',
    fee: 'Fee',
    error: 'Transaction Error!',
    again: 'Continue Transfer',
    back: 'Back to Wallet',
    block: 'Block',
    time: 'Time'
  },
  staking: {
    title: 'My Delegations',
    reward: 'Delegation Rewards',
    withdraw: 'Withdraw Rewards',
    delegate: 'Delegate GARD',
    fromValidator: 'From Validator Node',
    toValidator: 'To Validator Node',
    validators: 'Validator Candidates',
    validator: 'Validator Node',
    detail: 'Delegation Detail',
    tokens: 'Tokens',
    commission: 'Commission',
    max: 'Max',
    all: 'Delegate All',
    unbind: 'Unbind',
    unbindAll: 'Unbind All',
    redelegate: 'Redelegate',
    redelegateAll: 'Redelegate All',
    unbinding: 'Unbinding'
  },
  footer: {
    copyright: '© 2019 Hashgard Foundation Ltd. All Rights Reserved.'
  }
};
export default en;
