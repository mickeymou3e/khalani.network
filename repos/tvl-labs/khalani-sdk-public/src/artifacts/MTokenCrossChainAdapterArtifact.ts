import { ContractInterface } from 'ethers'

export const MTOKEN_CROSSCHAIN_ADAPTER_ABI: ContractInterface = [
  {
    type: 'constructor',
    inputs: [
      { name: '_IMTokenManager', type: 'address', internalType: 'address' },
      { name: '_eventPublisher', type: 'address', internalType: 'address' },
      { name: '_mTokenRegistry', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
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
        ],
      },
      { name: 'originChain', type: 'uint32', internalType: 'uint32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'produceEvent',
    inputs: [
      { name: 'eventData', type: 'bytes', internalType: 'bytes' },
      { name: 'destChain', type: 'uint32', internalType: 'uint32' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [
      { name: 'spokeToken', type: 'address', internalType: 'address' },
      { name: 'chainId', type: 'uint32', internalType: 'uint32' },
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'error',
    name: 'MTokenMinter__OnlyIMTokenManagerCanCall',
    inputs: [],
  },
]
