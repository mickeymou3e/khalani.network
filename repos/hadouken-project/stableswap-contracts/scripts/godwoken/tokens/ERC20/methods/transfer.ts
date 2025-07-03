import { Signer, Overrides, BigNumber } from 'ethers';

import connect from '../connect'

export async function transfer(
  amount: BigNumber,
  tokenAddress: string,
  recipientAddress: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  const token = connect(tokenAddress, deployer)

  const transferTransaction = await token.transfer(recipientAddress, amount, transactionOverrides)
  const receipt = await transferTransaction.wait()

  const transactionHash = receipt.transactionHash

  return transactionHash
}