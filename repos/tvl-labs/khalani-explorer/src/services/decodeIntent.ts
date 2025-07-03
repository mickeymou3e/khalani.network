import { ethers } from 'ethers'

export const decodeIntent = (intent: string) => {
  const decodedData = ethers.utils.defaultAbiCoder.decode(
    [
      'tuple(address,uint32,uint32,address,address,uint256,bytes,uint256,uint256)',
    ],
    intent,
  )[0]

  return {
    author: decodedData[0],
    sourceChainId: decodedData[1],
    destinationChainId: decodedData[2],
    sourceToken: decodedData[3],
    destinationToken: decodedData[4],
    sourceAmount: decodedData[5],
    sourcePermit2: decodedData[6],
    nonce: decodedData[7],
    deadline: decodedData[8],
  }
}
