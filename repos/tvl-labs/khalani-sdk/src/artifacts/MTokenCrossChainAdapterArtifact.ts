import { ContractInterface } from 'ethers'

export const MTOKEN_CROSSCHAIN_ADAPTER_ABI: ContractInterface = [
  {
    type: 'constructor',
    inputs: [
      { name: '_IMTokenManager', type: 'address', internalType: 'address' },
      { name: '_eventPublisher', type: 'address', internalType: 'address' },
      { name: '_mTokenRegistry', type: 'address', internalType: 'address' },
      { name: '_eventHandler', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'didProduceEvent',
    inputs: [{ name: 'eventHash', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getWithdrawEventType',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nonce',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'processEvent',
    inputs: [
      {
        name: '_event',
        type: 'tuple',
        internalType: 'struct XChainEvent',
        components: [
          { name: 'publisher', type: 'address', internalType: 'address' },
          { name: 'originChainId', type: 'uint256', internalType: 'uint256' },
          { name: 'eventHash', type: 'bytes32', internalType: 'bytes32' },
          { name: 'eventData', type: 'bytes', internalType: 'bytes' },
          { name: 'eventNonce', type: 'uint256', internalType: 'uint256' },
        ],
      },
      { name: 'originChain', type: 'uint32', internalType: 'uint32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'processedEvents',
    inputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'producedEvents',
    inputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [
      { name: 'spokeToken', type: 'address', internalType: 'address' },
      { name: 'chainId', type: 'uint32', internalType: 'uint32' },
      { name: '_owner', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    name: 'EventProcessed',
    inputs: [
      {
        name: 'eventHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EventProcessed',
    inputs: [
      {
        name: 'eventHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'eventData',
        type: 'tuple',
        indexed: true,
        internalType: 'struct XChainEvent',
        components: [
          { name: 'publisher', type: 'address', internalType: 'address' },
          { name: 'originChainId', type: 'uint256', internalType: 'uint256' },
          { name: 'eventHash', type: 'bytes32', internalType: 'bytes32' },
          { name: 'eventData', type: 'bytes', internalType: 'bytes' },
          { name: 'eventNonce', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EventProduced',
    inputs: [
      {
        name: 'eventType',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'eventData',
        type: 'tuple',
        indexed: true,
        internalType: 'struct XChainEvent',
        components: [
          { name: 'publisher', type: 'address', internalType: 'address' },
          { name: 'originChainId', type: 'uint256', internalType: 'uint256' },
          { name: 'eventHash', type: 'bytes32', internalType: 'bytes32' },
          { name: 'eventData', type: 'bytes', internalType: 'bytes' },
          { name: 'eventNonce', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'MTokenCrossChainAdapter__EventAlreadyProcessed',
    inputs: [{ name: 'eventHash', type: 'bytes32', internalType: 'bytes32' }],
  },
  {
    type: 'error',
    name: 'MTokenCrossChainAdapter__OnlyEventHandlerCanCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MTokenMinter__OnlyIMTokenManagerCanCall',
    inputs: [],
  },
]
