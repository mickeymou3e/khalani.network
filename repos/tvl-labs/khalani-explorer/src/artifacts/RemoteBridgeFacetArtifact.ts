import { ContractInterface } from 'ethers'

export const REMOTE_BRIDGE_FACET_ARTIFACT: ContractInterface = [
  {
    inputs: [],
    name: 'BaseDiamondFacet__bridgeCallNonReentrant_reentrantCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroTargetAddress',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'destinationChainId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct Token[]',
        name: 'approvedTokens',
        type: 'tuple[]',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'RemoteBridgeRequest',
    type: 'event',
  },
  {
    inputs: [],
    name: 'getAssetReserves',
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
        internalType: 'uint256',
        name: 'destinationChainId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct Token[]',
        name: 'approvedTokens',
        type: 'tuple[]',
      },
      {
        internalType: 'bytes',
        name: 'interchainLiquidityHubPayload',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: 'isSwapWithAggregateToken',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'message',
        type: 'bytes',
      },
    ],
    name: 'send',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
