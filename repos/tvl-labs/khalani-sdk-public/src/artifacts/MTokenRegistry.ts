import { InterfaceAbi } from 'ethers-v6'

export const MTOKEN_REGISTRY_ABI: InterfaceAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_mTokenManager', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'checkValidMToken',
    inputs: [{ name: 'mToken', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createMToken',
    inputs: [
      { name: 'symbol', type: 'string', internalType: 'string' },
      { name: 'name', type: 'string', internalType: 'string' },
      { name: 'spokeAddr', type: 'address', internalType: 'address' },
      { name: 'spokeChainId', type: 'uint32', internalType: 'uint32' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'destroyMToken',
    inputs: [{ name: 'mToken', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getMTokenForSpokeToken',
    inputs: [
      { name: 'chainId', type: 'uint32', internalType: 'uint32' },
      { name: 'spokeToken', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMTokenInfo',
    inputs: [{ name: 'mToken', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct MTokenInfo',
        components: [
          { name: 'mTokenAddress', type: 'address', internalType: 'address' },
          { name: 'isPaused', type: 'bool', internalType: 'bool' },
          { name: 'isDestroyed', type: 'bool', internalType: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getSpokeInfoForMToken',
    inputs: [{ name: 'mToken', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct SpokeTokenInfo',
        components: [
          { name: 'token', type: 'address', internalType: 'address' },
          { name: 'chainId', type: 'uint32', internalType: 'uint32' },
        ],
      },
    ],
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
    name: 'pauseMToken',
    inputs: [{ name: 'mToken', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'unpauseMToken',
    inputs: [{ name: 'mToken', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'MTokenCreated',
    inputs: [
      {
        name: 'mToken',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'symbol',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
      { name: 'name', type: 'string', indexed: false, internalType: 'string' },
      {
        name: 'spokeAddr',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'spokeChainId',
        type: 'uint32',
        indexed: false,
        internalType: 'uint32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MTokenDestroyed',
    inputs: [
      {
        name: 'mToken',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MTokenPaused',
    inputs: [
      {
        name: 'mToken',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MTokenUnpaused',
    inputs: [
      {
        name: 'mToken',
        type: 'address',
        indexed: true,
        internalType: 'address',
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
  { type: 'error', name: 'MTokenRegistry__MTokenAlreadyExists', inputs: [] },
  { type: 'error', name: 'MTokenRegistry__MTokenDestroyed', inputs: [] },
  { type: 'error', name: 'MTokenRegistry__MTokenNotFound', inputs: [] },
  { type: 'error', name: 'MTokenRegistry__MTokenPaused', inputs: [] },
  { type: 'error', name: 'MTokenRegistry__UnsupportedMToken', inputs: [] },
]
