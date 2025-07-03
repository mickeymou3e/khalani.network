import { Signer, Overrides, BigNumber } from 'ethers';

import connect from '../connect'

export async function approve(
  amount: BigNumber,
  tokenAddress: string,
  spenderAddress: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  const token = connect(tokenAddress, deployer)

  const approveTransaction = await token.approve(spenderAddress, amount, transactionOverrides)
  const receipt = await approveTransaction.wait()

  const transactionHash = receipt.transactionHash

  return transactionHash
}