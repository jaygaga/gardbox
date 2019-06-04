const zh = {
  global: {
    app: 'GardBox',
    next: '下一步',
    back: '返 回',
    search: '搜 索',
    confirm: '确 认',
    finish: '完 成',
    ok: '确 认',
    cancel: '取 消',
    error: '错误',
    required: '请输入{name}',
    success: '{name}成功!'
  },
  home: {
    title: '欢迎使用 GARDBOX',
    banner: 'GARDBOX 是新一代数字金融公有链 Hashgard 的网页钱包',
    itemTitle1: '随时 随地',
    itemText1: 'GARDBOX钱包是移动端友好的，因此您可以随处访问您的钱包。网页版适用于桌面和移动浏览器。',
    itemTitle2: '安全 高效',
    itemText2: '所有的数据(包括导入生成助记词)都存储在本地，采用行业最高级24助记词进行账户加密。',
    itemTitle3: '可靠 权威',
    itemText3: '由Hashgard官方团队打造，为您提供专业的可靠的资产管理工具。',
    account: '钱包账户',
    staking: '委托抵押',
    issue: 'Token发行'
  },
  agree: {
    title: '服务条款',
    term1: '我知道我的钱包信息存放在我的个人电脑上，不会发送至 Hashgard 服务器，所有的加密都在浏览器本地完成。',
    term2: '我知道 Hashgard 无法访问我的私人信息，也无法参与解决任何的资金损失问题。',
    term3: '我已经阅读并同意 ',
    use: '使用条款',
    and: '和',
    privacy: '隐私条款',
    confirm: '同意并继续',
    termUrl: 'http://hashgard-io.oss-cn-hongkong.aliyuncs.com/terms/HashgardTermsofService_CN.pdf',
    privacyUrl: 'http://hashgard-io.oss-cn-hongkong.aliyuncs.com/terms/GardBoxPrivacyPolicy_CN.pdf'
  },
  passport: {
    title: '创建一个新钱包或导入钱包',
    banner: 'gard钱包是一个免费的、开源的网页钱包，用户可以使用gard钱包创建或导入钱包，使用gard代币完成例如转账等一系列操作.',
    create: '创建新钱包',
    createBreif: '在本地创建一个新的 GARD 钱包。',
    login: '钱包切换',
    loginBreif: '直接输入密码使用本地已经存在的 GARD 钱包。',
    logout: '注 销',
    backup: '导出 KeyStore',
    backupCopy: '复制 KeyStore 到剪贴板',
    backupFile: '下载 KeyStore 文件',
    edit: '编辑名称',
    delete: '删除钱包',
    deleteWarn: '钱包的所有信息都会被删除，只能用该钱包的助记词或 KeyStore 恢复钱包，请确保您已做好备份。',
    recover: '导入钱包',
    recoverBreif: '使用私钥或助记词恢复来恢复 GARD 钱包。',
    math: '麦子钱包',
    useMath: '使用麦子钱包'
  },
  create: {
    warn1: '请认真保存当前账户密码，该密码用于操作您钱包的资产，如转账等。',
    warn2: 'GARDBOX 钱包不存储密码，也无法帮您找回，请务必牢记!!',
    name: '钱包名称',
    pass: '密码',
    passCheck: '确认密码',
    passWarn: '密码至少8位，且包含数字和字母!',
    passCheckWarn: '密码不一致!',
    exist: '钱包名称已存在!',
    mnemonic: '您的助记词',
    mnemonicWarn: '助记词错误',
    safety: '请妥善保管',
    mnemonicBreif: '钱包不会存储您的助记词，请立即备份！如果丢失助记词，将无法找回钱包内的资产',
    reset: '重 置',
    confirm: '确认您的助记词',
    backup: '您的钱包已经成功创建！您可以在设置菜单中随时【备份 KeyStore】.',
    success: '钱包创建成功!'
  },
  recover: {
    key: 'KeyStore 文本',
    keyFile: 'KeyStore 文件',
    drag: '将文件拖到此处，或',
    click: '点击上传',
    phrase: '助记词',
    keyError: 'KeyStore 格式错误!'
  },
  main: {
    receive: '收 款',
    qrcode: '二维码',
    send: '转 账',
    manage: '管 理',
    copy: '已复制到剪切板',
    assets: '我的资产',
    txs: '交易记录',
    txInfo: '交易详情',
    allTxs: '查看全部',
    empty: '暂无交易记录',
    keyWarn: 'KeyStore 是用你的私钥和密码加密后的 JSON 文件, 您可以用密码从 KeyStore 中取回私钥，请妥善保管。'
  },
  send: {
    form: '转 账',
    confirm: '确认交易信息',
    passError: '密码错误',
    reject: '交易签名被拒绝',
    netError: '网络错误',
    finish: '转账结果',
    denom: '转账币种',
    amount: '数量',
    amountWarn: '数量不足',
    amountWarnPositive: '数量必须大于零',
    amountWarnInvalid: '小数位数不支持',
    address: '收款地址',
    addressWarn: '地址格式有误',
    sender: '转出地址',
    txHash: 'TxHash',
    all: '全部转出',
    fee: '手续费',
    error: '交易发送失败',
    again: '继续转账',
    back: '回到钱包',
    block: '区块高度',
    time: '交易时间'
  },
  staking: {
    delegationTotal: '所有委托',
    reward: '委托收益',
    withdraw: '取回收益',
    delegate: '委托 GARD',
    delegations: '我的委托',
    validators: '全部验证人节点',
    tokensMax: '抵押数量优先',
    commissionMin: '佣金最低',
    fromValidator: '转出验证人节点',
    toValidator: '转入验证人节点',
    validator: '验证人节点',
    name: '节点名称',
    status: '状态',
    active: '活跃',
    candidate: '候选',
    jailed: '异常',
    minSelf: '最小自委托',
    address: '地址',
    detail: '委托详情',
    tokens: '抵押总量',
    commission: '佣金',
    max: '最高佣金',
    commissionChange: '修改佣金最大幅度',
    website: '网站',
    description: '描述',
    all: '委托全部',
    unbind: '赎回委托',
    unbindAll: '赎回全部',
    redelegate: '转移委托',
    redelegateAll: '转移全部',
    unbinding: '解锁中',
    delegated: '已委托'
  },
  issue: {
    tokens: '我发行的Token',
    create: '发行新Token',
    symbol: 'Token符号',
    name: '名称',
    id: 'ID',
    time: '发行时间',
    supply: '发行总量',
    basic: '基础信息',
    basicBrif: '必填项，Token创建后不可修改',
    decimals: '小数位数',
    nameEg: '如：Hashgard',
    symbolEg: '如：GARD',
    supplyEg: '如：21000000',
    describ: '描述信息',
    describBrif: '非必填，可以后期修改',
    organization: '组织机构名称',
    website: '网站地址',
    logo: 'Token 图标',
    description: 'Token 描述',
    organizationEg: 'E.g. Hashgard 基金会',
    websiteEg: 'E.g. www.hashgard.io',
    logoEg: '可公开访问的图片链接地址',
    setting: 'Token 功能设置',
    settingBrif: '以下功能默认开启, 一旦关闭将不可再次打开。',
    mint: '管理员可增发',
    freeze: '管理员可冻结',
    burn: '管理员可销毁',
    burnHolder: '普通用户可销毁',
    burnAny: '管理员可强制销毁其他用户Token'
  },
  footer: {
    copyright: '© 2019 Hashgard Foundation Ltd. All Rights Reserved.'
  }
};
export default zh;
