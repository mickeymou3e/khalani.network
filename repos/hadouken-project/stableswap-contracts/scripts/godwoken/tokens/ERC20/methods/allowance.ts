import { Signer, Overrides } from 'ethers';

import connect from '../connect'

export async function allowance(
  userAddress: string,
  tokenAddress: string,
  spenderAddress: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  const token = connect(tokenAddress, deployer)

  const allowance = await token.allowance(userAddress, spenderAddress, transactionOverrides)

  return allowance
}