import { InterfaceAbi } from 'ethers-v6'

export const INTENTBOOK_ABI: InterfaceAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'solutionLib', type: 'address', internalType: 'address' },
      { name: 'manager', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'DEFAULT_MAX_LOCK_DURATION',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'DEFAULT_MINIMUM_FILL_PERCENTAGE',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addPublisher',
    inputs: [
      { name: 'newPublisher', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'authority',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'cancelIntent',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelIntentForAuthor',
    inputs: [
      { name: 'intentId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'author', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'checkIntentValidToSpend',
    inputs: [
      {
        name: 'signedIntent',
        type: 'tuple',
        internalType: 'struct SignedIntent',
        components: [
          {
            name: 'intent',
            type: 'tuple',
            internalType: 'struct Intent',
            components: [
              { name: 'author', type: 'address', internalType: 'address' },
              { name: 'ttl', type: 'uint256', internalType: 'uint256' },
              { name: 'nonce', type: 'uint256', internalType: 'uint256' },
              { name: 'srcMToken', type: 'address', internalType: 'address' },
              { name: 'srcAmount', type: 'uint256', internalType: 'uint256' },
              {
                name: 'outcome',
                type: 'tuple',
                internalType: 'struct Outcome',
                components: [
                  {
                    name: 'mTokens',
                    type: 'address[]',
                    internalType: 'address[]',
                  },
                  {
                    name: 'mAmounts',
                    type: 'uint256[]',
                    internalType: 'uint256[]',
                  },
                  {
                    name: 'outcomeAssetStructure',
                    type: 'uint8',
                    internalType: 'enum OutcomeAssetStructure',
                  },
                  {
                    name: 'fillStructure',
                    type: 'uint8',
                    internalType: 'enum FillStructure',
                  },
                ],
              },
            ],
          },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getIntent',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Intent',
        components: [
          { name: 'author', type: 'address', internalType: 'address' },
          { name: 'ttl', type: 'uint256', internalType: 'uint256' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'srcMToken', type: 'address', internalType: 'address' },
          { name: 'srcAmount', type: 'uint256', internalType: 'uint256' },
          {
            name: 'outcome',
            type: 'tuple',
            internalType: 'struct Outcome',
            components: [
              { name: 'mTokens', type: 'address[]', internalType: 'address[]' },
              {
                name: 'mAmounts',
                type: 'uint256[]',
                internalType: 'uint256[]',
              },
              {
                name: 'outcomeAssetStructure',
                type: 'uint8',
                internalType: 'enum OutcomeAssetStructure',
              },
              {
                name: 'fillStructure',
                type: 'uint8',
                internalType: 'enum FillStructure',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getIntentChainRoot',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getIntentId',
    inputs: [
      {
        name: 'intent',
        type: 'tuple',
        internalType: 'struct Intent',
        components: [
          { name: 'author', type: 'address', internalType: 'address' },
          { name: 'ttl', type: 'uint256', internalType: 'uint256' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'srcMToken', type: 'address', internalType: 'address' },
          { name: 'srcAmount', type: 'uint256', internalType: 'uint256' },
          {
            name: 'outcome',
            type: 'tuple',
            internalType: 'struct Outcome',
            components: [
              { name: 'mTokens', type: 'address[]', internalType: 'address[]' },
              {
                name: 'mAmounts',
                type: 'uint256[]',
                internalType: 'uint256[]',
              },
              {
                name: 'outcomeAssetStructure',
                type: 'uint8',
                internalType: 'enum OutcomeAssetStructure',
              },
              {
                name: 'fillStructure',
                type: 'uint8',
                internalType: 'enum FillStructure',
              },
            ],
          },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getIntentIdsByAuthor',
    inputs: [{ name: 'author', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bytes32[]', internalType: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getIntentState',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'uint8', internalType: 'enum IntentState' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNonce',
    inputs: [{ name: '_user', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getReceiptManager',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getSignedIntent',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct SignedIntent',
        components: [
          {
            name: 'intent',
            type: 'tuple',
            internalType: 'struct Intent',
            components: [
              { name: 'author', type: 'address', internalType: 'address' },
              { name: 'ttl', type: 'uint256', internalType: 'uint256' },
              { name: 'nonce', type: 'uint256', internalType: 'uint256' },
              { name: 'srcMToken', type: 'address', internalType: 'address' },
              { name: 'srcAmount', type: 'uint256', internalType: 'uint256' },
              {
                name: 'outcome',
                type: 'tuple',
                internalType: 'struct Outcome',
                components: [
                  {
                    name: 'mTokens',
                    type: 'address[]',
                    internalType: 'address[]',
                  },
                  {
                    name: 'mAmounts',
                    type: 'uint256[]',
                    internalType: 'uint256[]',
                  },
                  {
                    name: 'outcomeAssetStructure',
                    type: 'uint8',
                    internalType: 'enum OutcomeAssetStructure',
                  },
                  {
                    name: 'fillStructure',
                    type: 'uint8',
                    internalType: 'enum FillStructure',
                  },
                ],
              },
            ],
          },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTokenManager',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isConsumingScheduledOp',
    inputs: [],
    outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lockIntent',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'lockIntents',
    inputs: [
      { name: 'intentIds', type: 'bytes32[]', internalType: 'bytes32[]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'publishIntent',
    inputs: [
      {
        name: 'signedIntent',
        type: 'tuple',
        internalType: 'struct SignedIntent',
        components: [
          {
            name: 'intent',
            type: 'tuple',
            internalType: 'struct Intent',
            components: [
              { name: 'author', type: 'address', internalType: 'address' },
              { name: 'ttl', type: 'uint256', internalType: 'uint256' },
              { name: 'nonce', type: 'uint256', internalType: 'uint256' },
              { name: 'srcMToken', type: 'address', internalType: 'address' },
              { name: 'srcAmount', type: 'uint256', internalType: 'uint256' },
              {
                name: 'outcome',
                type: 'tuple',
                internalType: 'struct Outcome',
                components: [
                  {
                    name: 'mTokens',
                    type: 'address[]',
                    internalType: 'address[]',
                  },
                  {
                    name: 'mAmounts',
                    type: 'uint256[]',
                    internalType: 'uint256[]',
                  },
                  {
                    name: 'outcomeAssetStructure',
                    type: 'uint8',
                    internalType: 'enum OutcomeAssetStructure',
                  },
                  {
                    name: 'fillStructure',
                    type: 'uint8',
                    internalType: 'enum FillStructure',
                  },
                ],
              },
            ],
          },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removePublisher',
    inputs: [{ name: 'publisher', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 's_maxLockDuration',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 's_minimumFillPercentage',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setAuthority',
    inputs: [
      { name: 'newAuthority', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setMaxLockDuration',
    inputs: [
      { name: 'maxLockDuration', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setMinimumFillPercentage',
    inputs: [
      {
        name: 'minimumFillPercentage',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setReceiptManager',
    inputs: [
      { name: 'receiptManager', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setTokenManager',
    inputs: [
      { name: 'tokenManager', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'solve',
    inputs: [
      {
        name: '_solution',
        type: 'tuple',
        internalType: 'struct Solution',
        components: [
          { name: 'intentIds', type: 'bytes32[]', internalType: 'bytes32[]' },
          {
            name: 'intentOutputs',
            type: 'tuple[]',
            internalType: 'struct Intent[]',
            components: [
              { name: 'author', type: 'address', internalType: 'address' },
              { name: 'ttl', type: 'uint256', internalType: 'uint256' },
              { name: 'nonce', type: 'uint256', internalType: 'uint256' },
              { name: 'srcMToken', type: 'address', internalType: 'address' },
              { name: 'srcAmount', type: 'uint256', internalType: 'uint256' },
              {
                name: 'outcome',
                type: 'tuple',
                internalType: 'struct Outcome',
                components: [
                  {
                    name: 'mTokens',
                    type: 'address[]',
                    internalType: 'address[]',
                  },
                  {
                    name: 'mAmounts',
                    type: 'uint256[]',
                    internalType: 'uint256[]',
                  },
                  {
                    name: 'outcomeAssetStructure',
                    type: 'uint8',
                    internalType: 'enum OutcomeAssetStructure',
                  },
                  {
                    name: 'fillStructure',
                    type: 'uint8',
                    internalType: 'enum FillStructure',
                  },
                ],
              },
            ],
          },
          {
            name: 'receiptOutputs',
            type: 'tuple[]',
            internalType: 'struct Receipt[]',
            components: [
              { name: 'mToken', type: 'address', internalType: 'address' },
              {
                name: 'mTokenAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
              { name: 'owner', type: 'address', internalType: 'address' },
              { name: 'intentHash', type: 'bytes32', internalType: 'bytes32' },
            ],
          },
          {
            name: 'spendGraph',
            type: 'tuple[]',
            internalType: 'struct MoveRecord[]',
            components: [
              { name: 'srcIdx', type: 'uint64', internalType: 'uint64' },
              {
                name: 'outputIdx',
                type: 'tuple',
                internalType: 'struct OutputIdx',
                components: [
                  {
                    name: 'outType',
                    type: 'uint8',
                    internalType: 'enum OutType',
                  },
                  { name: 'outIdx', type: 'uint64', internalType: 'uint64' },
                ],
              },
              { name: 'qty', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'fillGraph',
            type: 'tuple[]',
            internalType: 'struct FillRecord[]',
            components: [
              { name: 'inIdx', type: 'uint64', internalType: 'uint64' },
              { name: 'outIdx', type: 'uint64', internalType: 'uint64' },
              { name: 'outType', type: 'uint8', internalType: 'enum OutType' },
            ],
          },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'validateSolutionInputs',
    inputs: [
      {
        name: 'solution',
        type: 'tuple',
        internalType: 'struct Solution',
        components: [
          { name: 'intentIds', type: 'bytes32[]', internalType: 'bytes32[]' },
          {
            name: 'intentOutputs',
            type: 'tuple[]',
            internalType: 'struct Intent[]',
            components: [
              { name: 'author', type: 'address', internalType: 'address' },
              { name: 'ttl', type: 'uint256', internalType: 'uint256' },
              { name: 'nonce', type: 'uint256', internalType: 'uint256' },
              { name: 'srcMToken', type: 'address', internalType: 'address' },
              { name: 'srcAmount', type: 'uint256', internalType: 'uint256' },
              {
                name: 'outcome',
                type: 'tuple',
                internalType: 'struct Outcome',
                components: [
                  {
                    name: 'mTokens',
                    type: 'address[]',
                    internalType: 'address[]',
                  },
                  {
                    name: 'mAmounts',
                    type: 'uint256[]',
                    internalType: 'uint256[]',
                  },
                  {
                    name: 'outcomeAssetStructure',
                    type: 'uint8',
                    internalType: 'enum OutcomeAssetStructure',
                  },
                  {
                    name: 'fillStructure',
                    type: 'uint8',
                    internalType: 'enum FillStructure',
                  },
                ],
              },
            ],
          },
          {
            name: 'receiptOutputs',
            type: 'tuple[]',
            internalType: 'struct Receipt[]',
            components: [
              { name: 'mToken', type: 'address', internalType: 'address' },
              {
                name: 'mTokenAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
              { name: 'owner', type: 'address', internalType: 'address' },
              { name: 'intentHash', type: 'bytes32', internalType: 'bytes32' },
            ],
          },
          {
            name: 'spendGraph',
            type: 'tuple[]',
            internalType: 'struct MoveRecord[]',
            components: [
              { name: 'srcIdx', type: 'uint64', internalType: 'uint64' },
              {
                name: 'outputIdx',
                type: 'tuple',
                internalType: 'struct OutputIdx',
                components: [
                  {
                    name: 'outType',
                    type: 'uint8',
                    internalType: 'enum OutType',
                  },
                  { name: 'outIdx', type: 'uint64', internalType: 'uint64' },
                ],
              },
              { name: 'qty', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'fillGraph',
            type: 'tuple[]',
            internalType: 'struct FillRecord[]',
            components: [
              { name: 'inIdx', type: 'uint64', internalType: 'uint64' },
              { name: 'outIdx', type: 'uint64', internalType: 'uint64' },
              { name: 'outType', type: 'uint8', internalType: 'enum OutType' },
            ],
          },
        ],
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct Intent[]',
        components: [
          { name: 'author', type: 'address', internalType: 'address' },
          { name: 'ttl', type: 'uint256', internalType: 'uint256' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'srcMToken', type: 'address', internalType: 'address' },
          { name: 'srcAmount', type: 'uint256', internalType: 'uint256' },
          {
            name: 'outcome',
            type: 'tuple',
            internalType: 'struct Outcome',
            components: [
              { name: 'mTokens', type: 'address[]', internalType: 'address[]' },
              {
                name: 'mAmounts',
                type: 'uint256[]',
                internalType: 'uint256[]',
              },
              {
                name: 'outcomeAssetStructure',
                type: 'uint8',
                internalType: 'enum OutcomeAssetStructure',
              },
              {
                name: 'fillStructure',
                type: 'uint8',
                internalType: 'enum FillStructure',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'AuthorityUpdated',
    inputs: [
      {
        name: 'authority',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IntentCancelled',
    inputs: [
      {
        name: 'intentId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IntentCreated',
    inputs: [
      {
        name: 'intentId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'author',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'srcMToken',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'srcAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'mTokens',
        type: 'address[]',
        indexed: false,
        internalType: 'address[]',
      },
      {
        name: 'mAmounts',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
      },
      {
        name: 'outcomeAssetStructure',
        type: 'uint8',
        indexed: false,
        internalType: 'enum OutcomeAssetStructure',
      },
      {
        name: 'fillStructure',
        type: 'uint8',
        indexed: false,
        internalType: 'enum FillStructure',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IntentLocked',
    inputs: [
      {
        name: 'intentId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IntentPublisherAdded',
    inputs: [
      {
        name: 'publisher',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IntentPublisherRevoked',
    inputs: [
      {
        name: 'publisher',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IntentSolved',
    inputs: [
      {
        name: 'intentId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AccessManagedInvalidAuthority',
    inputs: [{ name: 'authority', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AccessManagedRequiredDelay',
    inputs: [
      { name: 'caller', type: 'address', internalType: 'address' },
      { name: 'delay', type: 'uint32', internalType: 'uint32' },
    ],
  },
  {
    type: 'error',
    name: 'AccessManagedUnauthorized',
    inputs: [{ name: 'caller', type: 'address', internalType: 'address' }],
  },
  { type: 'error', name: 'IntentBook__CannotCancelNonOpenIntent', inputs: [] },
  {
    type: 'error',
    name: 'IntentBook__CannotLockIntentThatIsNotOpen',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
  },
  {
    type: 'error',
    name: 'IntentBook__CannotSpendIntentThatIsNotOpen',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
  },
  { type: 'error', name: 'IntentBook__FillGraphCannotBeEmpty', inputs: [] },
  {
    type: 'error',
    name: 'IntentBook__IntentAlreadyExists',
    inputs: [{ name: '_intentId', type: 'bytes32', internalType: 'bytes32' }],
  },
  { type: 'error', name: 'IntentBook__IntentExpired', inputs: [] },
  { type: 'error', name: 'IntentBook__IntentIdAuthorMismatch', inputs: [] },
  {
    type: 'error',
    name: 'IntentBook__IntentNotFound',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
  },
  {
    type: 'error',
    name: 'IntentBook__IntentNotSpendable',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
  },
  {
    type: 'error',
    name: 'IntentBook__IntentPredecessorRootDoesNotMatch',
    inputs: [],
  },
  {
    type: 'error',
    name: 'IntentBook__IntentVersionsCannotChangeTtlWhenSpent',
    inputs: [],
  },
  { type: 'error', name: 'IntentBook__InvalidIntentAuthor', inputs: [] },
  { type: 'error', name: 'IntentBook__InvalidIntentNonce', inputs: [] },
  { type: 'error', name: 'IntentBook__InvalidSignature', inputs: [] },
  {
    type: 'error',
    name: 'IntentBook__SpendingPartiallyFillableIntentMustMakeProgress',
    inputs: [],
  },
  {
    type: 'error',
    name: 'IntentBook__UnauthorizedCancellationAttempt',
    inputs: [],
  },
  {
    type: 'error',
    name: 'IntentBook__UnauthorizedIntentPublisher',
    inputs: [],
  },
]
