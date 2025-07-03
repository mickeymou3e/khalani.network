import { Signer, CallOverrides } from 'ethers';

import connect from '../connect'

export async function balanceOf(
  address: string,
  tokenAddress: string,
  deployer: Signer,
  transactionOverrides: CallOverrides,
) {
  const token = connect(tokenAddress, deployer)

  const balance = await token.balanceOf(address, { ...transactionOverrides, blockTag: 40876 })

  return balance
}