import { ContractInterface } from 'ethers'

export const VORTEX_ABI: ContractInterface = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_nexus',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'eoa',
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
        name: 'balancerVault',
        type: 'address',
      },
      {
        internalType: 'enum IVault.SwapKind',
        name: 'kind',
        type: 'uint8',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'poolId',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'assetInIndex',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetOutIndex',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
        ],
        internalType: 'struct BatchSwapStep[]',
        name: 'swaps',
        type: 'tuple[]',
      },
      {
        internalType: 'contract IAsset[]',
        name: 'assets',
        type: 'address[]',
      },
      {
        internalType: 'int256[]',
        name: 'limits',
        type: 'int256[]',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'assetWithdrawIndexes',
        type: 'uint256[]',
      },
    ],
    name: 'executeSwapAndWithdraw',
    outputs: [
      {
        internalType: 'address[]',
        name: 'assetsWithdrawn',
        type: 'address[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nexus',
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
]
