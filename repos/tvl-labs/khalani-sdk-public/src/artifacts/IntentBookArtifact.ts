import { InterfaceAbi } from 'ethers-v6'

export const INTENTBOOK_ABI: InterfaceAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'solutionLib',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'IntentBook__CannotCancelNonOpenIntent',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'IntentBook__CannotLockIntentThatIsNotOpen',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'IntentBook__CannotSpendIntentThatIsNotOpen',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_intentId',
        type: 'bytes32',
      },
    ],
    name: 'IntentBook__IntentAlreadyExists',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IntentBook__IntentExpired',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'IntentBook__IntentNotFound',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'IntentBook__IntentNotSpendable',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IntentBook__IntentVersionsCannotChangeTtlWhenSpent',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IntentBook__InvalidIntentAuthor',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IntentBook__InvalidIntentNonce',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IntentBook__InvalidSignature',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IntentBook__SpendingPartiallyFillableIntentMustMakeProgress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IntentBook__UnauthorizedCancellationAttempt',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IntentBook__UnauthorizedIntentPublisher',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'IntentCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'author',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'srcMToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'srcAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'mTokens',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'mAmounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'enum OutcomeAssetStructure',
        name: 'outcomeAssetStructure',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'enum FillStructure',
        name: 'fillStructure',
        type: 'uint8',
      },
    ],
    name: 'IntentCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'IntentLocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'publisher',
        type: 'address',
      },
    ],
    name: 'IntentPublisherAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'publisher',
        type: 'address',
      },
    ],
    name: 'IntentPublisherRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'IntentSolved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newPublisher',
        type: 'address',
      },
    ],
    name: 'addPublisher',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newSolver',
        type: 'address',
      },
    ],
    name: 'addSolver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'cancelIntent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'author',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'ttl',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'srcMToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'srcAmount',
                type: 'uint256',
              },
              {
                components: [
                  {
                    internalType: 'address[]',
                    name: 'mTokens',
                    type: 'address[]',
                  },
                  {
                    internalType: 'uint256[]',
                    name: 'mAmounts',
                    type: 'uint256[]',
                  },
                  {
                    internalType: 'enum OutcomeAssetStructure',
                    name: 'outcomeAssetStructure',
                    type: 'uint8',
                  },
                  {
                    internalType: 'enum FillStructure',
                    name: 'fillStructure',
                    type: 'uint8',
                  },
                ],
                internalType: 'struct Outcome',
                name: 'outcome',
                type: 'tuple',
              },
            ],
            internalType: 'struct Intent',
            name: 'intent',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct SignedIntent',
        name: 'signedIntent',
        type: 'tuple',
      },
    ],
    name: 'checkIntentValidToSpend',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'getIntent',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'author',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'ttl',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'srcMToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'srcAmount',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address[]',
                name: 'mTokens',
                type: 'address[]',
              },
              {
                internalType: 'uint256[]',
                name: 'mAmounts',
                type: 'uint256[]',
              },
              {
                internalType: 'enum OutcomeAssetStructure',
                name: 'outcomeAssetStructure',
                type: 'uint8',
              },
              {
                internalType: 'enum FillStructure',
                name: 'fillStructure',
                type: 'uint8',
              },
            ],
            internalType: 'struct Outcome',
            name: 'outcome',
            type: 'tuple',
          },
        ],
        internalType: 'struct Intent',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'getIntentChainRoot',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'author',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'ttl',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'srcMToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'srcAmount',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address[]',
                name: 'mTokens',
                type: 'address[]',
              },
              {
                internalType: 'uint256[]',
                name: 'mAmounts',
                type: 'uint256[]',
              },
              {
                internalType: 'enum OutcomeAssetStructure',
                name: 'outcomeAssetStructure',
                type: 'uint8',
              },
              {
                internalType: 'enum FillStructure',
                name: 'fillStructure',
                type: 'uint8',
              },
            ],
            internalType: 'struct Outcome',
            name: 'outcome',
            type: 'tuple',
          },
        ],
        internalType: 'struct Intent',
        name: 'intent',
        type: 'tuple',
      },
    ],
    name: 'getIntentId',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'author',
        type: 'address',
      },
    ],
    name: 'getIntentIdsByAuthor',
    outputs: [
      {
        internalType: 'bytes32[]',
        name: '',
        type: 'bytes32[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'getIntentState',
    outputs: [
      {
        internalType: 'enum IntentState',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getReceiptManager',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'getSignedIntent',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'author',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'ttl',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'srcMToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'srcAmount',
                type: 'uint256',
              },
              {
                components: [
                  {
                    internalType: 'address[]',
                    name: 'mTokens',
                    type: 'address[]',
                  },
                  {
                    internalType: 'uint256[]',
                    name: 'mAmounts',
                    type: 'uint256[]',
                  },
                  {
                    internalType: 'enum OutcomeAssetStructure',
                    name: 'outcomeAssetStructure',
                    type: 'uint8',
                  },
                  {
                    internalType: 'enum FillStructure',
                    name: 'fillStructure',
                    type: 'uint8',
                  },
                ],
                internalType: 'struct Outcome',
                name: 'outcome',
                type: 'tuple',
              },
            ],
            internalType: 'struct Intent',
            name: 'intent',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct SignedIntent',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTokenManager',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'solver',
        type: 'address',
      },
    ],
    name: 'isSolver',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'intentId',
        type: 'bytes32',
      },
    ],
    name: 'lockIntent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: 'intentIds',
        type: 'bytes32[]',
      },
    ],
    name: 'lockIntents',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'author',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'ttl',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'srcMToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'srcAmount',
                type: 'uint256',
              },
              {
                components: [
                  {
                    internalType: 'address[]',
                    name: 'mTokens',
                    type: 'address[]',
                  },
                  {
                    internalType: 'uint256[]',
                    name: 'mAmounts',
                    type: 'uint256[]',
                  },
                  {
                    internalType: 'enum OutcomeAssetStructure',
                    name: 'outcomeAssetStructure',
                    type: 'uint8',
                  },
                  {
                    internalType: 'enum FillStructure',
                    name: 'fillStructure',
                    type: 'uint8',
                  },
                ],
                internalType: 'struct Outcome',
                name: 'outcome',
                type: 'tuple',
              },
            ],
            internalType: 'struct Intent',
            name: 'intent',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct SignedIntent',
        name: 'signedIntent',
        type: 'tuple',
      },
    ],
    name: 'publishIntent',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'publisher',
        type: 'address',
      },
    ],
    name: 'removePublisher',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newSolver',
        type: 'address',
      },
    ],
    name: 'removeSolver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiptManager',
        type: 'address',
      },
    ],
    name: 'setReceiptManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenManager',
        type: 'address',
      },
    ],
    name: 'setTokenManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32[]',
            name: 'intentIds',
            type: 'bytes32[]',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'author',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'ttl',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'srcMToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'srcAmount',
                type: 'uint256',
              },
              {
                components: [
                  {
                    internalType: 'address[]',
                    name: 'mTokens',
                    type: 'address[]',
                  },
                  {
                    internalType: 'uint256[]',
                    name: 'mAmounts',
                    type: 'uint256[]',
                  },
                  {
                    internalType: 'enum OutcomeAssetStructure',
                    name: 'outcomeAssetStructure',
                    type: 'uint8',
                  },
                  {
                    internalType: 'enum FillStructure',
                    name: 'fillStructure',
                    type: 'uint8',
                  },
                ],
                internalType: 'struct Outcome',
                name: 'outcome',
                type: 'tuple',
              },
            ],
            internalType: 'struct Intent[]',
            name: 'intentOutputs',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'mToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'mTokenAmount',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
              {
                internalType: 'bytes32',
                name: 'intentHash',
                type: 'bytes32',
              },
            ],
            internalType: 'struct Receipt[]',
            name: 'receiptOutputs',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'uint64',
                name: 'srcIdx',
                type: 'uint64',
              },
              {
                components: [
                  {
                    internalType: 'enum OutType',
                    name: 'outType',
                    type: 'uint8',
                  },
                  {
                    internalType: 'uint64',
                    name: 'outIdx',
                    type: 'uint64',
                  },
                ],
                internalType: 'struct OutputIdx',
                name: 'outputIdx',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'qty',
                type: 'uint256',
              },
            ],
            internalType: 'struct MoveRecord[]',
            name: 'spendGraph',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'uint64',
                name: 'inIdx',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'outIdx',
                type: 'uint64',
              },
              {
                internalType: 'enum OutType',
                name: 'outType',
                type: 'uint8',
              },
            ],
            internalType: 'struct FillRecord[]',
            name: 'fillGraph',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct Solution',
        name: '_solution',
        type: 'tuple',
      },
    ],
    name: 'solve',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32[]',
            name: 'intentIds',
            type: 'bytes32[]',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'author',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'ttl',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'srcMToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'srcAmount',
                type: 'uint256',
              },
              {
                components: [
                  {
                    internalType: 'address[]',
                    name: 'mTokens',
                    type: 'address[]',
                  },
                  {
                    internalType: 'uint256[]',
                    name: 'mAmounts',
                    type: 'uint256[]',
                  },
                  {
                    internalType: 'enum OutcomeAssetStructure',
                    name: 'outcomeAssetStructure',
                    type: 'uint8',
                  },
                  {
                    internalType: 'enum FillStructure',
                    name: 'fillStructure',
                    type: 'uint8',
                  },
                ],
                internalType: 'struct Outcome',
                name: 'outcome',
                type: 'tuple',
              },
            ],
            internalType: 'struct Intent[]',
            name: 'intentOutputs',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'mToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'mTokenAmount',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
              {
                internalType: 'bytes32',
                name: 'intentHash',
                type: 'bytes32',
              },
            ],
            internalType: 'struct Receipt[]',
            name: 'receiptOutputs',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'uint64',
                name: 'srcIdx',
                type: 'uint64',
              },
              {
                components: [
                  {
                    internalType: 'enum OutType',
                    name: 'outType',
                    type: 'uint8',
                  },
                  {
                    internalType: 'uint64',
                    name: 'outIdx',
                    type: 'uint64',
                  },
                ],
                internalType: 'struct OutputIdx',
                name: 'outputIdx',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'qty',
                type: 'uint256',
              },
            ],
            internalType: 'struct MoveRecord[]',
            name: 'spendGraph',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'uint64',
                name: 'inIdx',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'outIdx',
                type: 'uint64',
              },
              {
                internalType: 'enum OutType',
                name: 'outType',
                type: 'uint8',
              },
            ],
            internalType: 'struct FillRecord[]',
            name: 'fillGraph',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct Solution',
        name: 'solution',
        type: 'tuple',
      },
    ],
    name: 'validateSolutionInputs',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'author',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'ttl',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'srcMToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'srcAmount',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address[]',
                name: 'mTokens',
                type: 'address[]',
              },
              {
                internalType: 'uint256[]',
                name: 'mAmounts',
                type: 'uint256[]',
              },
              {
                internalType: 'enum OutcomeAssetStructure',
                name: 'outcomeAssetStructure',
                type: 'uint8',
              },
              {
                internalType: 'enum FillStructure',
                name: 'fillStructure',
                type: 'uint8',
              },
            ],
            internalType: 'struct Outcome',
            name: 'outcome',
            type: 'tuple',
          },
        ],
        internalType: 'struct Intent[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
