import { ethers } from 'ethers'

// Raw emitted message
const rawMessage =
  '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000004841d269df0562fbd46399a253d3cf8ffcab2757000000000000000000000000000000000000000000000000000000000000426893ea3148bb81a197956e59a6c88d2e80380a1a9667de2587273b173e898e99a0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000004722ce3a7195dee57cec78edf5ac9c542fbc46260000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000c13113e56e00050327be3ad164185103541f19030000000000000000000000000000000000000000000000000000000000000000'

// ABI encoding types of XChainEvent as defined in Solidity
const xChainEventAbi = ['address', 'uint256', 'bytes32', 'bytes']

function decodeMessage(rawMessage: string) {
  const abiCoder = new ethers.utils.AbiCoder()

  try {
    const decodedData = abiCoder.decode(
      [`tuple(${xChainEventAbi.join(',')})`],
      rawMessage,
    )

    console.log('Decoded XChainEvent:', {
      publisher: decodedData[0][0],
      originChainId: decodedData[0][1],
      eventHash: decodedData[0][2],
      eventData: decodedData[0][3],
    })
  } catch (error) {
    console.error('Failed to decode message:', error)
  }
}

decodeMessage(rawMessage)
