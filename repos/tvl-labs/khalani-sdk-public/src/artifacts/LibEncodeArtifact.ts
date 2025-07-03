import { InterfaceAbi } from 'ethers-v6'

export const LIB_ENCODE_ABI: InterfaceAbi = [
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'encodedData',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'arrayLength',
        type: 'uint256',
      },
    ],
    name: 'decodePacked',
    outputs: [
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
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
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
    ],
    name: 'encodePack',
    outputs: [
      {
        internalType: 'bytes',
        name: 'encodedSwaps',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'swapCount',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
]
