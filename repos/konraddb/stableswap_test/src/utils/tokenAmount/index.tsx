import { AbiItem } from 'ethereum-multicall/dist/esm/models'
import { BigNumber } from 'ethers'
import web3 from 'web3'

import { Address } from '@tvl-labs/swap-v2-sdk'

const minABI: AbiItem[] = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
]

export const getTokenAmount = async (
  rpcUrl: string,
  tokenAddress: Address,
  userAddress: Address,
): Promise<BigNumber> => {
  const provider = new web3(rpcUrl)
  const checksumAddress = web3.utils.toChecksumAddress(tokenAddress)
  const contract = new provider.eth.Contract(minABI, checksumAddress)
  const data = await contract.methods
    .balanceOf(userAddress)
    .call()
    .catch(console.error)

  return BigNumber.from(data) || BigNumber.from(0)
}
