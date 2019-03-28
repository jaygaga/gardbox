/**
 * The mapping between the elements displayed in the transaction page and the tx data.
 * linkType has 5 options: '', 'tx', 'block', 'address', 'validator'. (default = '', for no link)
 */
const defaultFields = [
  {
    name: 'Action',
    field: 'tags.0.value',
    linkType: ''
  },
  {
    name: 'Txhash',
    field: 'txhash',
    linkType: 'tx'
  },
  {
    name: 'Block',
    field: 'height',
    linkType: 'block',
    hideInTable: true
  }
];

export const txFieldsMap = {
  send: [
    ...defaultFields,
    {
      name: 'From',
      field: 'tx.value.msg.0.value.from_address',
      linkType: 'address',
      hideInTable: true
    },
    {
      name: 'To',
      field: 'tx.value.msg.0.value.to_address',
      linkType: 'address',
      hideInTable: true
    },
    {
      name: 'Amount',
      field: ['tx.value.msg.0.value.amount.0.amount', 'tx.value.msg.0.value.amount.0.denom'],
      linkType: ''
    },
    {
      name: 'Gas Used',
      field: 'gas_used',
      linkType: '',
      hideInTable: true
    },
    {
      name: 'Memo',
      field: 'tx.value.memo',
      linkType: '',
      hideInTable: true
    }
  ],
  delegate: [
    ...defaultFields,
    {
      name: 'Validator',
      field: 'tx.value.msg.0.value.validator_addr',
      linkType: 'validator'
    },
    {
      name: 'Delegator',
      field: 'tx.value.msg.0.value.delegator_addr',
      linkType: 'address'
    },
    {
      name: 'Delegation',
      field: ['tx.value.msg.0.value.value.amount', 'tx.value.msg.0.value.value.denom'],
      linkType: ''
    },
    {
      name: 'Gas Used',
      field: 'gas_used',
      linkType: '',
      hideInTable: true
    }
  ],
  begin_redelegate: [
    ...defaultFields,
    {
      name: 'Validator From',
      field: 'tx.value.msg.0.value.validator_src_addr',
      linkType: 'validator'
    },
    {
      name: 'Validator To',
      field: 'tx.value.msg.0.value.validator_dst_addr',
      linkType: 'validator'
    },
    {
      name: 'Delegator',
      field: 'tx.value.msg.0.value.delegator_addr',
      linkType: 'address'
    },
    {
      name: 'Shares Amount',
      field: 'tx.value.msg.0.value.shares_amount',
      linkType: ''
    },
    {
      name: 'Gas Used',
      field: 'gas_used',
      linkType: '',
      hideInTable: true
    }
  ],
  begin_unbonding: [
    ...defaultFields,
    {
      name: 'Validator',
      field: 'tx.value.msg.0.value.validator_addr',
      linkType: 'validator'
    },
    {
      name: 'Delegator',
      field: 'tx.value.msg.0.value.delegator_addr',
      linkType: 'address'
    },
    {
      name: 'Shares Amount',
      field: 'tx.value.msg.0.value.shares_amount',
      linkType: ''
    },
    {
      name: 'Gas Used',
      field: 'gas_used',
      linkType: '',
      hideInTable: true
    }
  ],
  create_validator: [
    ...defaultFields,
    {
      name: 'Validator',
      field: 'tx.value.msg.0.value.validator_address',
      linkType: 'validator'
    },
    {
      name: 'Delegator',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: 'address'
    },
    {
      name: 'Delegation',
      field: ['tx.value.msg.0.value.value.amount', 'tx.value.msg.0.value.value.denom'],
      linkType: ''
    },
    {
      name: 'Gas Used',
      field: 'gas_used',
      linkType: '',
      hideInTable: true
    }
  ],
  unjail: [
    ...defaultFields,
    {
      name: 'Validator',
      field: 'tx.value.msg.0.value.address',
      linkType: 'validator'
    },
    {
      name: 'Gas Used',
      field: 'gas_used',
      linkType: ''
    }
  ],
  submit_proposal: [
    ...defaultFields,
    {
      name: 'Proposal Id',
      field: 'tags.2.value',
      linkType: ''
    },
    {
      name: 'Proposer',
      field: 'tx.value.msg.0.value.proposer',
      linkType: 'address'
    },
    {
      name: 'Proposal Type',
      field: 'tx.value.msg.0.value.proposal_type',
      linkType: ''
    },
    {
      name: 'Title',
      field: 'tx.value.msg.0.value.title',
      linkType: ''
    },
    {
      name: 'Description',
      field: 'tx.value.msg.0.value.description',
      linkType: '',
      hideInTable: true
    },
    {
      name: 'Initial Deposit',
      field: 'tx.value.msg.0.value.initial_deposit',
      linkType: '',
      hideInTable: true
    },
    {
      name: 'Memo',
      field: 'tx.value.memo',
      linkType: '',
      hideInTable: true
    },
    {
      name: 'Gas Used',
      field: 'gas_used',
      linkType: '',
      hideInTable: true
    }
  ],
  deposit: [
    ...defaultFields,
    {
      name: 'Proposal Id',
      field: 'tx.value.msg.0.value.proposal_id',
      linkType: ''
    },
    {
      name: 'Depositor',
      field: 'tx.value.msg.0.value.depositor',
      linkType: 'address'
    },
    {
      name: 'Amount',
      field: ['tx.value.msg.0.value.amount.0.amount', 'tx.value.msg.0.value.amount.0.denom'],
      linkType: ''
    },
    {
      name: 'Memo',
      field: 'tx.value.memo',
      linkType: '',
      hideInTable: true
    },
    {
      name: 'Gas Used',
      field: 'gas_used',
      linkType: '',
      hideInTable: true
    }
  ],
  vote: [
    ...defaultFields,
    {
      name: 'Proposal Id',
      field: 'tx.value.msg.0.value.proposal_id',
      linkType: ''
    },
    {
      name: 'Option',
      field: 'tx.value.msg.0.value.option',
      linkType: ''
    },
    {
      name: 'Voter',
      field: 'tx.value.msg.0.value.voter',
      linkType: 'address'
    },
    {
      name: 'Memo',
      field: 'tx.value.memo',
      linkType: '',
      hideInTable: true
    },
    {
      name: 'Gas Used',
      field: 'gas_used',
      linkType: '',
      hideInTable: true
    }
  ],
  all: [
    ...defaultFields,
    {
      name: 'Memo',
      field: 'tx.value.memo',
      linkType: ''
    },
    {
      name: 'Gas Used',
      field: 'gas_used',
      linkType: ''
    }
  ]
};
